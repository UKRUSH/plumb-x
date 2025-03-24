const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Get all invoices
router.get('/invoices', financeController.getAllInvoices);

// Get invoice by ID
router.get('/invoices/:id', financeController.getInvoiceById);

// Create new invoice
router.post('/invoices', financeController.createInvoice);

// Update invoice
router.put('/invoices/:id', financeController.updateInvoice);

// Delete invoice
router.delete('/invoices/:id', financeController.deleteInvoice);

// Get all salary records
router.get('/salary', financeController.getAllSalaryRecords);

// Get salary record by ID
router.get('/salary/:id', financeController.getSalaryRecordById);

// Create new salary record
router.post('/salary', financeController.createSalaryRecord);

// Get financial reports
router.get('/reports', financeController.getFinancialReports);

module.exports = router; 