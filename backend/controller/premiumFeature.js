const User = require('../model/users');
const Expense = require('../model/expenses');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers = await User.findAll({
            order:[['totalExpenses', 'DESC']]
        })
        res.status(200).json(leaderboardofusers)
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard 
}