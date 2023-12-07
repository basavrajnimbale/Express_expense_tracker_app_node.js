const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./util/database');

const User = require('./model/users');

const Expense = require('./model/expenses');

const userRoutes = require('./route/user');

app.use(cors());

app.use(bodyParser.json({extended: false}));

app.use(express.json());

app.use('/user', userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

//app.listen(3000);

sequelize
.sync()
.then(result => {
    console.log(result);
    app.listen(3000);
})
.catch(err => console.log(err)); 