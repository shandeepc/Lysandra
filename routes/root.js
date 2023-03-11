const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../middleware/logger');
var pkg = require('../package.json');


router.get('^/$|/status|/index(.html)?|/home(.html)?', (request, response) => {
        var contype = request.headers['content-type'];
        if (contype && contype.indexOf('application/json') === 0)
           response.status(200).json({
                                       "Project" : pkg.name,
                                       "Version" : pkg.version,
                                       "Status" : "Alive"
                                    });
        else
           response.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('^/favicon.ico', (request, response) => {
      response.sendFile(path.join(__dirname, '..', 'favicon.ico'));
});

module.exports = router;