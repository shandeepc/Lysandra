const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const logger = require('../middleware/logger');

const userSchema = Joi.object({
    username: Joi.string().min(1).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

async function createNewUser (request, response) {
    logger.debug(`Recieved body --> ${JSON.stringify(request.body)}`);
    let validationResult = userSchema.validate(request.body);

    if(validationResult.error) {
        logger.debug(`ERROR --> { "error": ${validationResult.error.details[0].message} }`);
        return response.status(400).json({ "error": validationResult.error.details[0].message });
    }
    let user = request.body.username;
    let pwd = request.body.password;
    if (usersDB.users.find(person => person.username === user)) {
        logger.debug(`ERROR --> { 'error': "Username ${user} already exist." }`);
        return response.status(409).json({ 'error': `Username ${user} already exist.` });
    }
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = { "username": user, "password": hashedPwd };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'),JSON.stringify(usersDB.users, null, 4));
        logger.debug(`Sending --> { 'message': "New user ${user} created!" }`);
        response.status(201).json({ 'message': `New user ${user} created!` });
    } catch (err) {
        response.status(500).json({ 'error': err.message });
    }
}

module.exports = { createNewUser };