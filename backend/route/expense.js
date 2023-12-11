const express = require('express');

const route = express.Router();

const Expense = require('../controller/expenses')

const userauthentication = require('../middleware/auth')

route.post('/add-expense', userauthentication.authenticate, Expense.addExpense)

route.delete('/delete-expense/:id', userauthentication.authenticate, Expense.deleteExpense)

route.get('/get-expenses', userauthentication.authenticate, Expense.getExpenses);

module.exports = route;