//Node Modules
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//Configs
const corsOptions = require('./config/corsOptions');
const authOptions = require('./config/authOptions');

//Middlewares
const logger = require('./middleware/logger');
const basicAuth = require('./middleware/basicAuth');
const jwtAuth = require('./middleware/jwtAuth');
const apiAuth = require('./middleware/apiAuth');

logger.log('Starting Application...', 'reqLog.txt');

const app = express();
const SERVER_PORT = process.env.PORT;
logger.log(`Setting authentication type as ${authOptions.authType}`, 'reqLog.txt');

//Entry point logger
app.use((request, response, next) => {
    logger.log(`${request.url}\t${request.method}\t${request.headers.host}`, 'reqLog.txt');
    next();
});

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Setting authentication type and endpoint access based on authOptions
if (authOptions.authType === 'basicAuthentication') {
    app.use('/authreg', require('./routes/authreg'));
    app.use(basicAuth);
} else if (authOptions.authType === 'APIAuth') {
    app.use('/authreg', require('./routes/authreg'));
    app.use('/auth', require('./routes/auth'));
    app.use(apiAuth);
} else if (authOptions.authType === 'JWT') {
    logger.log(`JWT Authentication is Still in progress..`, 'reqLog.txt');
    app.use('/authreg', require('./routes/authreg'));
    app.use('/auth', require('./routes/auth'));
    app.use('/refresh', require('./routes/refresh'));
    app.use(jwtAuth);
}

//Assigning routes
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/employees|/api/employees', require('./routes/api/employees'));
app.use('/employeespassword|/api/employeespassword', require('./routes/api/employeespassword'));
app.use('/groups|/api/groups', require('./routes/api/groups'));

//404 Handler
app.all('*', (request, response) => {
    logger.log(`Invaid request ${request.url}`, 'reqLog.txt');
    response.status(404);
    if (request.accepts('html')) {
        response.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (request.accepts('json')) {
        response.json({ "error": "404 Oppsi UwU, pawge nwut fUwUnd" });
    }
});

//Uncaught exception handler
app.use((error, request, response, next) => {
    logger.log(`ERROR --> ${error.stack}`, 'errorLog.txt');
    response.status(500).send(error.message);
});

app.listen(SERVER_PORT, () => logger.log(`Application running on port ${SERVER_PORT}`, 'reqLog.txt'));