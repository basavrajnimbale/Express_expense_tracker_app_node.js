const User = require('../model/users');
const Expense = require('../model/expenses');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

const getUserLeaderBoard = async (req, res) => {
    try{
        const users = await User.findAll()
        const expenses = await Expense.findAll()
        const userAggregatedExpenses = {}
    
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + +expense.expenseamout
            }else{
                userAggregatedExpenses[expense.userId] = +expense.expenseamout
            }
            console.log(expense.expenseamout + 'basuuuuuuu');
        })

        var userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] || 0 }) 
        })
        console.log(userLeaderBoardDetails)
        userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost)
        res.status(200).json(userLeaderBoardDetails)
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard 
}