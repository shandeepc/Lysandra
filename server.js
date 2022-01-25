const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const path =  require('path');
logger.log('Starting Application...', 'reqLog.txt');
const app = express();
const SERVER_PORT = process.env.PORT || 6969;

app.use((request, response, next) => {
    logger.log(`${request.url}\t${request.method}\t${request.headers.origin}`, 'reqLog.txt');
    next();
});

const whitelist = ['http://127.0.0.1'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
            logger.log(`Not allowed by CORS, Origin --> ${origin}`, 'errorLog.txt');
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/employees|/api/employees', require('./routes/api/employees'));


app.all('*', (request, response) => {
    logger.log(`Invaid request ${request.url}`, 'reqLog.txt');
    response.status(404);
    if (request.accepts('html')) {
        response.sendFile(path.join(__dirname, 'webpage', '404.html'));
    } else if (req.accepts('json')) {
        response.json({ "error": "404 Not Found" });
    }
});

app.use((error, request, response , next) => {
    logger.log(`ERROR --> ${error.stack}`, 'errorLog.txt');
    response.status(500).send(error.message);
});

app.listen(SERVER_PORT, () => logger.log(`Application running on port ${SERVER_PORT}`, 'reqLog.txt'));