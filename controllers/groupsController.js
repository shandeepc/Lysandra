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
    members:Joi.array().items(Joi.number()).min(1).optional()
});