const express = require('express');

const route = express.Router();

const User = require('../controller/user');

const Expense = require('../controller/expenses')

route.post('/signup', User.Signup);

route.post('/login', User.login);

route.post('/add-expense', Expense.addExpense)

route.delete('/delete-expense/:id', Expense.deleteExpense)

route.get('/get-expenses', Expense.getExpenses);

module.exports = route;