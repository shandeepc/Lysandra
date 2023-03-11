const logger = require('../middleware/logger');
const fs =  require('fs');
const fsPromises =  require('fs').promises;
const path =  require('path');
const Joi = require('joi');

let data = [];
data.employees = require('../model/employees.json');
data.groups = require('../model/groups.json');

const groupSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().min(1).max(30).required(),
    description: Joi.string().min(1).max(50).required(),
    members:Joi.array().items(Joi.number()).optional()
});

async function updateData (dPath, content) {
    try {
        await fsPromises.writeFile(path.join(__dirname,'..','model',dPath), JSON.stringify(content, null, 4));
        if(dPath === 'employees.json')
            data.employees = require(`../model/${dPath}`);
        else
            data.groups = require(`../model/${dPath}`);
    } catch(error) {
        logger.error(`Caught Exception --> ${error}`);
    }
}

function checkMembers (memberArray) {
    if(memberArray){
        for(let element of memberArray) {
            if(!data.employees.find(e => e.id === element)) {
                return `${element} is not a valid employee ID`;
            }
        }
    }
    return 'Okay';
}

const getAllGroups = (request, response) => {
    let result;
    if(request.query.offset && request.query.limit) {
        let offset = request.query.offset;
        let limit = request.query.limit;
        let startIndex = (offset -1);
        let endIndex = parseInt(startIndex) + parseInt(limit);
        console.log(startIndex);
        console.log(endIndex);
        result = data.groups.slice(startIndex, endIndex);
    } else {
        result = data.groups;
    }
    logger.debug(`Sending --> ${JSON.stringify(result)}`);
    response.status(200).json(result);
}

const createNewGroup = (request, response) => {
    let newGroup = request.body;
    newGroup.id = data.groups.at(-1).id + 1;

    let validationResult = groupSchema.validate(newGroup);

    if(validationResult.error) {
        response.status(400).json({ "error": validationResult.error.details[0].message });
    } else {
        let isMemberValid = checkMembers(newGroup.members);
        if( isMemberValid != 'Okay') {
            response.status(400).json({ "error": `${isMemberValid}` });
        } else {
            logger.debug(`Updated body --> ${JSON.stringify(newGroup)}`);
            data.groups.push(newGroup);
            if(newGroup.members) {
                for(let element of newGroup.members) {
                    if(data.employees.find(e => e.id === element).groups) {
                        if(!data.employees.find(e => e.id === element).groups.includes(newGroup.id)) {
                            data.employees.find(e => e.id === element).groups.push(newGroup.id);
                        }
                    } else {
                        data.employees.find(e => e.id === element).groups = [ newGroup.id ];
                    }
                }
            }
            updateData('groups.json',data.groups);
            updateData('employees.json',data.employees);
            logger.debug(`Sending --> ${JSON.stringify(newGroup)}`);
            response.status(201).json(newGroup);
        }
    }
}

const updateGroup = (request, response) => {
    let updtGroup = request.body;
    updtGroup.id = parseInt(request.params.id);

    let validationResult = groupSchema.validate(updtGroup);

    if(validationResult.error) {
        response.status(400);
        response.json({ "error": validationResult.error.details[0].message });
    } else {
        let isMemberValid = checkMembers(updtGroup.groups);
        if( isMemberValid != 'Okay') {
            response.status(400).json({ "error": `${isMemberValid}` });
        } else {
            if(data.groups.find(e => e.id === updtGroup.id)) {
                data.groups.find(e => e.id === updtGroup.id).name = updtGroup.name;
                data.groups.find(e => e.id === updtGroup.id).description = updtGroup.description;
                let oldMembers = data.groups.find(e => e.id === updtGroup.id).members;
                data.groups.find(e => e.id === updtGroup.id).members = updtGroup.members;
                logger.debug(`Updated body --> ${JSON.stringify(updtGroup)}`);
                if(updtGroup.members) {
                    let membersToRemove = [];
                    let membersToGrant = updtGroup.members;
                    if(oldMembers) {
                        membersToRemove = oldMembers.filter( ( g ) => !updtGroup.members.includes( g ) );
                        membersToGrant = membersToGrant.concat(oldMembers);
                        membersToGrant = membersToGrant.filter( ( g ) => !membersToRemove.includes( g ) );
                    }
                    membersToGrant = Array.from(new Set(membersToGrant)); 
                    membersToRemove = Array.from(new Set(membersToRemove));

                    logger.debug(`Members to grant --> ${membersToGrant}`);
                    logger.debug(`Members to remove --> ${membersToRemove}`);
                    //return;
                    for(let element of membersToGrant) {
                        if(data.employees.find(g => g.id === element).groups){
                            if(!data.employees.find(g => g.id === element).groups.includes(updtGroup.id))
                                data.employees.find(g => g.id === element).groups.push(updtGroup.id);
                        } else {
                            data.employees.find(g => g.id === element).groups = [ updtGroup.id ];
                        }
                    }
                    for(let element of membersToRemove) {
                        data.employees.find(g => g.id === element).groups.splice(data.employees.find(g => g.id === element).groups.indexOf(updtGroup.id),1);
                        if(data.employees.find(g => g.id === element).groups.length == 0)
                            delete data.employees.find(g => g.id === element)['groups'];
                    }
                } else {
                    for(let element of data.employees) {
                        if(element.groups && element.groups.indexOf(updtGroup.id) != -1) {
                            element.groups.splice(element.groups.indexOf(updtGroup.id),1);
                            if(element.groups.length == 0)
                                delete element['groups'];
                        }
                    }
                }
                updateData('groups.json',data.groups);
                updateData('employees.json',data.employees);
                logger.debug(`Sending --> ${JSON.stringify(updtGroup)}`);
                response.status(200).json(updtGroup);
            } else {
                response.status(404).json({ "error": `Cannot find an existing group with ID ${updtGroup.id}` });
            }
        }
        
    }
}

const deleteGroup = (request, response) => {
    if(data.groups.find(g => g.id === parseInt(request.params.id))) {
        logger.debug(`Deleting group --> ${JSON.stringify(data.groups.find(g => g.id === parseInt(request.params.id)))}`);
        data.groups.splice(data.groups.indexOf(data.groups.find(g => g.id === parseInt(request.params.id))),1);
        for(let element of data.employees) {
            if(element.groups && element.groups.indexOf(parseInt(request.params.id)) != -1) {
                element.groups.splice(element.groups.indexOf(parseInt(request.params.id)),1);
                if(element.groups.length == 0)
                    delete element['groups'];
            }
        }
        updateData('groups.json',data.groups);
        updateData('employees.json',data.employees);
        logger.debug(`Sending --> { "message": "Deleted group with ID ${request.params.id}"`);
        response.status(200).json({ "message": `Deleted group with ID ${request.params.id}` });
    } else {
        response.status(404).json({ "error": `Cannot find an group with ID ${request.params.id}` });
    }
}

const getGroup = (request, response) => {
    let group = data.groups.find(e => e.id === parseInt(request.params.id));
    logger.debug(JSON.stringify(group));
    if(!group) {
        response.status(404).json({ "error": `Group with Id ${request.params.id} Not Found` });
    } else {
        logger.debug(`Sending --> ${JSON.stringify(group)}`);
        response.status(200).json(group);
    }
}

module.exports = { getAllGroups, createNewGroup, updateGroup, deleteGroup, getGroup };