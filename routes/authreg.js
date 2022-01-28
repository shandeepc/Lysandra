const express = require('express');
const router = express.Router();
const authRegController = require('../controllers/authRegController');

router.post('/', authRegController.createNewUser);

module.exports = router;