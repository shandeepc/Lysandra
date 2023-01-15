const express = require('express');
const router = express.Router();
const logger = require('../../middleware/logger');
const employeesController = require('../../controllers/employeesController');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee);

router.route('/:id')
    .get(employeesController.getEmployee)
    .put(employeesController.updateEmployeeOverwrite)
    .patch(employeesController.updateEmployeeAppend)
    .delete(employeesController.deleteEmployee);

router.route('/enable/:id')
    .patch(employeesController.enableEmployee);

router.route('/disable/:id')
    .patch(employeesController.disableEmployee);

module.exports = router;