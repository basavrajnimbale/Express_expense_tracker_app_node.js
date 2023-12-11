const express = require('express');

const route = express.Router();

// const userauthentication = require('../middleware/auth')

const User = require('../controller/user');

// const Expense = require('../controller/expenses')

route.post('/signup', User.Signup);

route.post('/login', User.login);

// route.post('/add-expense', userauthentication.authenticate, Expense.addExpense)

// route.delete('/delete-expense/:id', userauthentication.authenticate, Expense.deleteExpense)

// route.get('/get-expenses', userauthentication.authenticate, Expense.getExpenses);

module.exports = route;