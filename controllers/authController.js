const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');
const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().min(1).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

async function login (request, response) {
    let validationResult = userSchema.validate(request.body);

    if(validationResult.error) {
        response.status(400).json({ "error": validationResult.error.details[0].message });
    }

    let user = request.body.username;
    let pwd = request.body.password;

    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) 
        return response.status(401).json({ 'error': `Incorrect UserName or Password` });
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        response.json({ 'message': `User ${user} is logged in!` });
    } else {
        response.status(401).json({ 'error': `Incorrect UserName or Password` });
    }
}

module.exports = { login };