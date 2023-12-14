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
const expenseRoutes = require('./route/expense')
const purchaseRoutes = require('./route/purchase');
const premiumFeactureRoutes = require('./route/premiumFeature');
const resetPasswordRoutes = require('./route/resetpassword');

app.use(cors());

app.use(bodyParser.json({extended: false}));

app.use(express.json());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeactureRoutes)
app.use('/password', resetPasswordRoutes)

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