const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Create new employee
router.post('/', employeeController.createEmployee);

// Update employee
router.put('/:id', employeeController.updateEmployee);

// Delete employee
router.delete('/:id', employeeController.deleteEmployee);

// Record attendance
router.post('/attendance', employeeController.recordAttendance);

// Get attendance records
router.get('/attendance/:employeeId', employeeController.getAttendanceRecords);

// Manage leave requests
router.post('/leave', employeeController.createLeaveRequest);
router.get('/leave/:employeeId', employeeController.getLeaveRequests);
router.put('/leave/:requestId', employeeController.updateLeaveRequest);

module.exports = router; 