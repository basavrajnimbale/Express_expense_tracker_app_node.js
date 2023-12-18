const Rezorpay = require('razorpay')
const Order = require('../model/orders')
const Expense = require('../model/expenses')
const user = require('./user')

const purchasepremium = async (req, res, next) => {
    try {
        const rzp = new Rezorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET                                                 
        });
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                if (err) {
                    console.log(err);
                    // throw new Error(JSON.stringify(err));
                }
                const response = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};

const updateTransactionStatus = async (req,res) => {
    try {
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({where : {orderid : order_id}})
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 = await req.user.update({ ispremiumuser: true})

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({success:true, message: "Transaction Successful", token: user.generateAccessToken(order.userId, undefined, true)})
        }).catch((error) => {
            throw new Error(error)
        })
    } catch (err) {
        console.log(err);
        // throw new Error(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus

}