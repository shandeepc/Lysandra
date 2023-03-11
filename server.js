/*
Project Name - Lysandra
Version - 3.0.1
Author - @shandeepc
Website - www.shandeep.tk
*/

//Node Modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const OAuth2Server = require('@node-oauth/oauth2-server');
const bodyParser = require('body-parser');
require('dotenv').config();

//Configs
const corsOptions = require('./config/corsOptions');
const pkg = require('./package.json');

//Middlewares
const logger = require('./middleware/logger');
const basicAuth = require('./middleware/basicAuth');
const jwtAuth = require('./middleware/jwtAuth');
const apiAuth = require('./middleware/apiAuth');
const oAuthAuth = require('./middleware/oAuthAuth');
const oAuthController = require('./controllers/oAuthController');

logger.debug(" ");
logger.debug(" ██╗  ██╗   ██╗███████╗ █████╗ ███╗   ██╗██████╗ ██████╗  █████╗ ");
logger.debug(" ██║  ╚██╗ ██╔╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔══██╗");
logger.debug(" ██║   ╚████╔╝ ███████╗███████║██╔██╗ ██║██║  ██║██████╔╝███████║");
logger.debug(" ██║    ╚██╔╝  ╚════██║██╔══██║██║╚██╗██║██║  ██║██╔══██╗██╔══██║");
logger.debug(" ███████╗██║   ███████║██║  ██║██║ ╚████║██████╔╝██║  ██║██║  ██║");
logger.debug(" ╚══════╝╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝");
logger.debug("                                                                 ");
logger.debug(`Project ~${pkg.name}~`);
logger.debug(`Version - ${pkg.version}`);
logger.debug('By - Shandeep - www.shandeep.tk\n');

logger.debug('Starting Application...');

const app = express();
const SERVER_PORT = process.env.PORT;
logger.debug(`Setting authentication type as ${process.env.AUTH_TYPE}`);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//Entry point logger
app.use((request, response, next) => {
    logger.debug(`${request.method}\t${request.headers.host}${request.url}`);
    logger.debug(`Recieved body --> ${JSON.stringify(request.body)}`);
    logger.debug(`Recieved Header --> ${JSON.stringify(request.headers)}`);
    next();
});

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Setting authentication type and endpoint access based on authOptions
if (process.env.AUTH_TYPE === 'basicAuthentication') {
    app.use('/authreg', require('./routes/authreg'));
    app.use(basicAuth);
} else if (process.env.AUTH_TYPE === 'APIAuth') {
    app.use('/authreg', require('./routes/authreg'));
    app.use('/auth', require('./routes/auth'));
    app.use(apiAuth);
} else if (process.env.AUTH_TYPE === 'JWT') {
    logger.debug(`JWT Authentication is Still in progress..`);
    app.use('/authreg', require('./routes/authreg'));
    app.use('/auth', require('./routes/auth'));
    app.use('/refresh', require('./routes/refresh'));
    app.use(jwtAuth);
} else if (process.env.AUTH_TYPE.startsWith("OAuth2.0")) {
    logger.debug(`Setting Up..OAuth2.0`);
    logger.debug(`Setting CLEAR_GRANTS_ON_START as ${JSON.parse(process.env.CLEAR_GRANTS_ON_START.toLowerCase())}`);
    logger.debug(`Setting CLEAR_GRANTS_ON_EXPIRE as ${JSON.parse(process.env.CLEAR_GRANTS_ON_EXPIRE.toLowerCase())}`);
    if(JSON.parse(process.env.CLEAR_GRANTS_ON_START.toLowerCase()))
        oAuthController.updateData(JSON.parse('{"tokens":[]}'));
    app.oauth = new OAuth2Server({
        model: require('./controllers/oAuthController'),
        refreshTokenLifetime: process.env.REFRESH_TOKEN_LIFE_TIME,
        accessTokenLifetime: process.env.ACCESS_TOKEN_LIFE_TIME,
        allowBearerTokensInQueryString: true
    });
    if (process.env.AUTH_TYPE.includes("Client Credentials")) {
        logger.debug(`Setting grant type as Client Credentials`);
        app.use('/oauth/token', require('./routes/oauth/token'));
    }
    app.use(oAuthAuth);
}

//Assigning routes
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/employees|/api/employees', require('./routes/api/employees'));
app.use('/employeespassword|/api/employeespassword', require('./routes/api/employeespassword'));
app.use('/groups|/api/groups', require('./routes/api/groups'));

//404 Handler
app.all('*', (request, response) => {
    logger.debug(`Invaid request ${request.url}`);
    response.status(404);
    if (request.accepts('html')) {
        response.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (request.accepts('json')) {
        response.json({ "error": "-_-" });
    }
});

//Uncaught exception handler
app.use((error, request, response, next) => {
    logger.error(`ERROR --> ${error.stack}`);
    response.status(500).send(error.message);
});

app.listen(
    SERVER_PORT, 
    () => (
        logger.debug(`Application running on port ${SERVER_PORT}`),
        logger.debug(`Open your browser and visit http://localhost:${SERVER_PORT}`)
        )
    );
