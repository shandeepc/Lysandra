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
    members:Joi.array().items(Joi.number()).min(1).optional()
});

async function updateData (dPath, content) {
    try {
        await fsPromises.writeFile(path.join(__dirname,'..','model',dPath), JSON.stringify(content, null, 4));
        if(dPath === 'employees.json')
            data.employees = require(`../model/${dPath}`);
        else
            data.groups = require(`../model/${dPath}`);
    } catch(error) {
        logger.log(`Caught Exception --> ${error}`, 'errorLog.txt');
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
    //console.log(request);
    response.status(200).json(data.groups);
}

const createNewGroup = (request, response) => {
    let newGroup = request.body;
    logger.log(`Recieved body --> ${JSON.stringify(newGroup)}`, 'reqLog.txt');
    newGroup.id = data.groups.at(-1).id + 1;

    let validationResult = groupSchema.validate(newGroup);

    if(validationResult.error) {
        response.status(400).json({ "error": validationResult.error.details[0].message });
    } else {
        let isMemberValid = checkMembers(newGroup.members);
        if( isMemberValid != 'Okay') {
            response.status(400).json({ "error": `${isMemberValid}` });
        } else {
            logger.log(`Updated body --> ${JSON.stringify(newGroup)}`, 'reqLog.txt');
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
            response.status(201).json(newGroup);
        }
    }
}

const updateGroup = (request, response) => {
    let updtGroup = request.body;
    logger.log(`Recieved body --> ${JSON.stringify(updtGroup)}`, 'reqLog.txt');
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
                data.groups.find(e => e.id === updtGroup.id).firstname = updtGroup.firstname;
                data.groups.find(e => e.id === updtGroup.id).lastname = updtGroup.lastname;
                let oldMembers = data.groups.find(e => e.id === updtGroup.id).members;
                data.groups.find(e => e.id === updtGroup.id).members = updtGroup.members;
                logger.log(`Updated body --> ${JSON.stringify(updtGroup)}`, 'reqLog.txt');
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

                    logger.log(`Members to grant --> ${membersToGrant}`, 'reqLog.txt');
                    logger.log(`Members to remove --> ${membersToRemove}`, 'reqLog.txt');
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
                response.status(201).json(updtGroup);
            } else {
                response.status(404).json({ "error": `Cannot find an existing group with ID ${updtGroup.id}` });
            }
        }
        
    }
}

const deleteGroup = (request, response) => {
    if(data.groups.find(g => g.id === parseInt(request.params.id))) {
        logger.log(`Deleting user --> ${JSON.stringify(data.groups.find(g => g.id === parseInt(request.params.id)))}`, 'reqLog.txt');
        data.groups.pop(data.groups.find(g => g.id === parseInt(request.params.id)));
        for(let element of data.employees) {
            if(element.groups && element.groups.indexOf(parseInt(request.params.id)) != -1) {
                element.groups.splice(element.groups.indexOf(parseInt(request.params.id)),1);
                if(element.groups.length == 0)
                    delete element['groups'];
            }
        }
        updateData('groups.json',data.groups);
        updateData('employees.json',data.employees);
        response.status(200).json({ "message": `Deleted group with ID ${request.params.id}` });
    } else {
        response.status(404).json({ "error": `Cannot find an group with ID ${request.params.id}` });
    }
}

const getGroup = (request, response) => {
    let group = data.groups.find(e => e.id === parseInt(request.params.id));
    logger.log(JSON.stringify(group), 'reqLog.txt');
    if(!group) {
        response.status(404).json({ "error": `Group with Id ${request.params.id} Not Found` });
    } else {
        response.status(200).json(group);
    }
}

module.exports = { getAllGroups, createNewGroup, updateGroup, deleteGroup, getGroup };