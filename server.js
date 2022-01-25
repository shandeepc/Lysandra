const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const EventEmitter = require('events');
const path =  require('path');
class ServerLogger extends EventEmitter{};
const serverLogger = new ServerLogger();
serverLogger.on('reqLog', (msg) => logger(msg,'reqLog.txt'));
serverLogger.on('errorLog', (msg) => logger(msg,'errorLog.txt'));
serverLogger.emit('reqLog', 'Starting Application...');
const app = express();
const SERVER_PORT = process.env.PORT || 6969;

app.use((request, response, next) => {
    serverLogger.emit('reqLog', `${request.url}\t${request.method}\t${request.headers.origin}`);
    next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?|/home(.html)?', (request, response) => {
    response.sendFile('./webpage/index.html', {root : __dirname});
});

app.get('/*', (request, response) => {
    serverLogger.emit('reqLog', `Invaid request ${request.url}`);
    response.status(404).sendFile('./webpage/404.html', {root : __dirname});
});

app.listen(SERVER_PORT, () => serverLogger.emit('reqLog', `Application running on port ${SERVER_PORT}`));