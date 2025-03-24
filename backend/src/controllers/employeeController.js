const Employee = require('../models/employeeModel');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res) => {
  try {
    // Remove employeeId from request body if it exists
    const { employeeId, ...employeeData } = req.body;
    
    const employee = new Employee(employeeData);
    const newEmployee = await employee.save();
    
    res.status(201).json(newEmployee);
  } catch (error) {
    // Check if it's a duplicate email error
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ 
        message: 'An employee with this email already exists' 
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record attendance
// @route   POST /api/employees/attendance
// @access  Private
exports.recordAttendance = async (req, res) => {
  try {
    res.status(201).json({
      status: 'success',
      message: 'Record attendance endpoint',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get attendance records
// @route   GET /api/employees/attendance/:employeeId
// @access  Private
exports.getAttendanceRecords = async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: `Get attendance records for employee ID: ${req.params.employeeId}`,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create leave request
// @route   POST /api/employees/leave
// @access  Private
exports.createLeaveRequest = async (req, res) => {
  try {
    res.status(201).json({
      status: 'success',
      message: 'Create leave request endpoint',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get leave requests
// @route   GET /api/employees/leave/:employeeId
// @access  Private
exports.getLeaveRequests = async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: `Get leave requests for employee ID: ${req.params.employeeId}`,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update leave request
// @route   PUT /api/employees/leave/:requestId
// @access  Private/Admin
exports.updateLeaveRequest = async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: `Update leave request with ID: ${req.params.requestId}`,
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 