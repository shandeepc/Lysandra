const datefns = require('date-fns');

const fs =  require('fs');
const fsPromises =  require('fs').promises;
const path =  require('path');

const logDir = path.join(__dirname, '..', 'logs');


const debug = async (msg) => {
    log(msg, 'reqLog.txt');
}

const error = async (msg) => {
    log(msg, 'errorLog.txt');
}

const log = async (msg, logFile) => {
    logFile = path.join(logDir,logFile);
    var dateAndTime = datefns.format(new Date(), 'dd:MM:yyyy\tHH:mm:ss');
    console.log(`${dateAndTime}\t${msg}`);
    try {
        if(!fs.existsSync(logDir))
            await fsPromises.mkdir(logDir);
        await fsPromises.appendFile(logFile, `${dateAndTime}\t${msg}\n`);
    } catch(error) {
        console.log(`Caught Exception --> ${error}`);
    }
}

module.exports = { debug, error } ;