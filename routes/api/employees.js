const express = require('express');
const router = express.Router();
const logger = require('../../middleware/logger');
const employeesController = require('../../controllers/employeesController');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee);

router.route('/:id')
    .get(employeesController.getEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

module.exports = router;