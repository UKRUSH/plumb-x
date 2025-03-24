const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: String,
    email: String,
    address: String
  },
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'overdue'],
    default: 'unpaid'
  },
  dueDate: Date,
  paymentDate: Date,
  paymentMethod: String
}, {
  timestamps: true
});

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  basicSalary: Number,
  overtime: Number,
  deductions: Number,
  bonus: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  paymentDate: Date
}, {
  timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
const Salary = mongoose.model('Salary', salarySchema);

module.exports = { Invoice, Salary };
