const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuth = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return response.sendStatus(401);
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return response.sendStatus(403);
            request.user = decoded.username;
            next();
        }
    );
}

module.exports = jwtAuth;