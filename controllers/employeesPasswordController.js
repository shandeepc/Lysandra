const logger = require('../middleware/logger');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Joi = require('joi');
const bcrypt = require('bcrypt');

let data = [];
data.employees = require('../model/employees.json');
data.employeesPassword = require('../model/employeesPassword.json');

const employeePasswordSchema = Joi.object({
    id: Joi.number().required(),
    password: Joi.string().min(3).max(15).required()
});

async function updateData(dPath, content) {
    try {
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', dPath), JSON.stringify(content, null, 4));
        data.employeesPassword = require('../model/employeesPassword.json');
    } catch (error) {
        logger.log(`Caught Exception --> ${error}`, 'errorLog.txt');
    }
}

const setPassword = async (request, response) => {
    let newEmployeePassword = request.body;
    logger.log(`Recieved body --> ${JSON.stringify(newEmployeePassword)}`, 'reqLog.txt');
    newEmployeePassword.id = parseInt(request.params.id);

    let validationResult = employeePasswordSchema.validate(newEmployeePassword);

    if (validationResult.error) {
        response.status(400).json({ "error": validationResult.error.details[0].message });
    } else {
        if (!data.employees.find(e => e.id === newEmployeePassword.id)) {
            return response.status(400).json({ "error": `Cannot find employee with ID ${newEmployeePassword.id}` });
        } else {
            if (data.employeesPassword.find(e => e.id === newEmployeePassword.id)) {
                let oldPassword = data.employeesPassword.find(e => e.id === newEmployeePassword.id).password;
                const match = await bcrypt.compare(newEmployeePassword.password, oldPassword);
                if (match) {
                    return response.status(400).json({ "error": "New password cannot be same as old password" });
                }
            } else {
                data.employeesPassword.push(newEmployeePassword);
            }
            logger.log(`Updated body --> ${JSON.stringify(newEmployeePassword)}`, 'reqLog.txt');
            let hashedPwd = await bcrypt.hash(newEmployeePassword.password, 10);
            data.employeesPassword.find(e => e.id === newEmployeePassword.id).password = hashedPwd;
            updateData('employeesPassword.json', data.employeesPassword);
            response.status(201).json(newEmployeePassword);
        }
    }
}

module.exports = { setPassword };