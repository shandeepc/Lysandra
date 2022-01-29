const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../middleware/logger');

router.get('^/$|/index(.html)?|/home(.html)?', (request, response) => {
    if (request.accepts('json')) {
        response.json({ "message": "Alive" });
    } else {
        response.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    }
});

module.exports = router;