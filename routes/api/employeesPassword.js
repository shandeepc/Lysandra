const express = require('express');
const router = express.Router();
const logger = require('../../middleware/logger');
const employeesPasswordController = require('../../controllers/employeesPasswordController');

router.route('/:id')
    .post(employeesPasswordController.setPassword)

module.exports = router;