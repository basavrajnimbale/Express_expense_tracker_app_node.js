const express = require('express');

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT

const app = express();
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const sequelize = require('./util/database');

const User = require('./model/users');
const Expense = require('./model/expenses');
const Order = require('./model/orders');
const ForgotPasswordRequest = require('./model/forgotpasswords')
const Url = require('./model/urls')

const userRoutes = require('./route/user');
const expenseRoutes = require('./route/expense')
const purchaseRoutes = require('./route/purchase');
const premiumFeactureRoutes = require('./route/premiumFeature');
const resetPasswordRoutes = require('./route/resetpassword');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
)

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

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

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(Url);
Url.belongsTo(User);


sequelize
.sync()
.then(result => {
    console.log("table created");
    app.listen(PORT);
})
.catch(err => console.log(err));