const expressBasicAuth = require('express-basic-auth');
const bcrypt = require('bcrypt');
const users = require('../model/users.json');
const logger = require('./logger');

const basicAuth = expressBasicAuth({
    authorizer: (username, password) => {
        const user = users.find(u => u.username === username);
        if(user) {
            const userMatches = expressBasicAuth.safeCompare(username, user.username);
            const passwordMatches = bcrypt.compareSync(password, user.password);
            return userMatches & passwordMatches;
        }
        return 0;
    },
    unauthorizedResponse: (req) => {
        logger.log(`Unauthorized ~~> basicAuthentication`, 'reqLog.txt');
        return `Unauthorized.`;
    }
});

module.exports = basicAuth;
