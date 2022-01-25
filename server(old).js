const logger = require('./middleware/logger');
const EventEmitter = require('events');
const path =  require('path');
const http =  require('http');
const fs =  require('fs');
const fsPromises =  require('fs').promises;

const serveWebPage = async (webPagePath, contentType, responseObj) => {
    try {
        serverLogger.emit('reqLog', `Serving file ${webPagePath}`);
        var rawData = await fsPromises.readFile(webPagePath, !contentType.includes('image') ? 'utf8' : '');
        var pageData = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        responseObj.writeHead(webPagePath.includes('404.html') ? 404 : 200, { 'Content-Type' : contentType });
        responseObj.end(contentType === 'application/json' ? JSON.stringify(pageData) : pageData);
    } catch(error) {
        serverLogger.emit('errorLog', `Caught Exception --> ${error}`);
        responseObj.statusCode = 500;
        responseObj.end();
    }
};


class ServerLogger extends EventEmitter{};
const serverLogger = new ServerLogger();
serverLogger.on('reqLog', (msg) => logger(msg,'reqLog.txt'));
serverLogger.on('errorLog', (msg) => logger(msg,'errorLog.txt'));

serverLogger.emit('reqLog', 'Starting Server...');

const SERVER_PORT = process.env.PORT || 6969;
const server = http.createServer((request, response) => {
    serverLogger.emit('reqLog', `${request.url}\t${request.method}`);

    const extension = path.extname(request.url);

    var contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && request.url === '/'
            ? path.join(__dirname, 'webpage', 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'webpage', request.url)
                    : path.join(__dirname, request.url);
    if (!extension && request.url.slice(-1) !== '/') filePath += '.html';

    if(fs.existsSync(filePath)) {
        serveWebPage(filePath, 'text/html', response);
    } else {
        switch (path.basename(filePath)) {
            case 'home.html':
                response.writeHead(301, { 'Location': '/index.html' });
                response.end();
                break;
            default:
                serverLogger.emit('reqLog', `invaid request ${filePath}`);
                serveWebPage(path.join(__dirname, 'webpage', '404.html'), 'text/html', response);
        }

    }

});

server.listen(SERVER_PORT, () => serverLogger.emit('reqLog', `Server running on port ${SERVER_PORT}`));