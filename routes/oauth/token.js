const express = require('express');
const router = express.Router();
const oAuthController = require('../../controllers/oAuthController');

router.all('/', oAuthController.obtainToken);

module.exports = router;