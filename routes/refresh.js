const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

router.post('/', refreshTokenController.refreshToken);

module.exports = router;