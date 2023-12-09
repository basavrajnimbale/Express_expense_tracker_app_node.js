const Expense = require('../model/expenses');

exports.addExpense = async (req, res, next) => {
    try{
        const {expenseamout, description, category} = req.body;
        // console.log(req.body + 'basu');
        const newExpense = await Expense.create({expenseamout, description, category, userId: req.user.id});
        // console.log(newExpense  + 'basu');
        res.status(201).json(newExpense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the expense.' });
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        if(expenseId == undefined || expenseId.length === 0){
            res.status(400).json({success:false, message:"bad parameter"})
        }
        const deletedExpenseCount = await Expense.destroy({ where: { id: expenseId, userId : req.user.id}});
        res.status(201).json({ deletedCount: deletedExpenseCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the expense.'});
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        console.log(req + 'this is user id');
        const expense = await Expense.findAll({where : {userId: req.user.id}});
        //('hiiii', expense);
        res.status(201).json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching expense.' });
    }
};