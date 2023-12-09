const express = require('express');

const dotenv = require('dotenv')
dotenv.config()

const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./util/database');

const User = require('./model/users');

const Expense = require('./model/expenses');

const Order = require('./model/orders');

const userRoutes = require('./route/user');
const purchaseRoutes = require('./route/purchase');

app.use((req, res, next) => {
    console.log(req.method, req.url)
    next();
})

app.use(cors());

app.use(bodyParser.json({extended: false}));

app.use(express.json());

app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
.sync()
.then(result => {
    console.log("table created");
    app.listen(3000);
})
.catch(err => console.log(err));