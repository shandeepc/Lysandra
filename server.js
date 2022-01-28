const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const authOptions = require('./config/authOptions');
const logger = require('./middleware/logger');
const basicAuth = require('./middleware/basicAuth');
const path = require('path');

logger.log('Starting Application...', 'reqLog.txt');

const app = express();
const SERVER_PORT = process.env.PORT || 6969;

//Entry point logger
app.use((request, response, next) => {
    logger.log(`${request.url}\t${request.method}\t${request.headers.origin}`, 'reqLog.txt');
    next();
});

logger.log(`Setting authentication type as ${authOptions.authType}`, 'reqLog.txt');

if (authOptions.authType === 'basicAuthentication') {
    app.use(basicAuth);
}
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/employees|/api/employees', require('./routes/api/employees'));
app.use('/groups|/api/groups', require('./routes/api/groups'));
if (authOptions.authType != 'noAuth') {
    app.use('/authreg', require('./routes/authreg'));
    app.use('/auth', require('./routes/auth'));
}

app.all('*', (request, response) => {//404 Handler
    logger.log(`Invaid request ${request.url}`, 'reqLog.txt');
    response.status(404);
    if (request.accepts('html')) {
        response.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (request.accepts('json')) {
        response.json({ "error": "404 Oppsi UwU, pawge nwut fUwUnd" });
    }
});

app.use((error, request, response, next) => {//Error Handler
    logger.log(`ERROR --> ${error.stack}`, 'errorLog.txt');
    response.status(500).send(error.message);
});

app.listen(SERVER_PORT, () => logger.log(`Application running on port ${SERVER_PORT}`, 'reqLog.txt'));