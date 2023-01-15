const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');
require('dotenv').config();

const userSchema = Joi.object({
    username: Joi.string().min(1).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

async function auth (request, response) {
    //console.log(request.body);
    let validationResult = userSchema.validate(request.body);

    if(validationResult.error) {
        return response.status(400).json({ "error": validationResult.error.details[0].message });
    }

    let user = request.body.username;
    let pwd = request.body.password;

    const foundUser = usersDB.users.find(person => person.username === user);
    //console.log(foundUser);
    if (!foundUser) 
        return response.status(401).json({ 'error': `Incorrect UserName or Password` });
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        let accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: (process.env.AUTH_TYPE === 'JWT'?'30s':'9999y') }
        );
        if(process.env.AUTH_TYPE === 'JWT') {
            let refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
            const currentUser = { ...foundUser, refreshToken };
            usersDB.setUsers([...otherUsers, currentUser]);
            await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'),JSON.stringify(usersDB.users, null, 4));
            response.json({ accessToken, refreshToken });
        } else {
            response.json({ accessToken });
        }

        
    } else {
        response.status(401).json({ 'error': `Incorrect UserName or Password` });
    }
}

module.exports = { auth };