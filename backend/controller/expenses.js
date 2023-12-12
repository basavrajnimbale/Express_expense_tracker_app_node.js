const Expense = require('../model/expenses');
const User = require('../model/users');
const sequelize = require('../util/database');

exports.addExpense = async (req, res, next) => {
    try {
        const t = await sequelize.transaction(); 
        const { expenseamount, description, category } = req.body;

        const expense = await Expense.create(
            { expenseamount, description, category, userId: req.user.id },
            { transaction: t } 
        );

        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
        console.log(totalExpense);

        await User.update(
            { totalExpenses: totalExpense },
            {
                where: { id: req.user.id },
                transaction: t
            }
        );

        await t.commit();
        res.status(200).json({ expense });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, error: err });
    }
};

exports.deleteExpense = async (req, res, next) => {
    let t;
    try {
        t = await sequelize.transaction();

        const expenseId = req.params.id;
        if (expenseId == undefined || expenseId.length === 0) {
            res.status(400).json({ success: false, message: "bad parameter" })
        }

        const deleteExpense = await Expense.findByPk(expenseId);

        req.user.totalExpenses -= deleteExpense.expenseamount;

        await req.user.save({ transaction: t });

        const deletedExpenseCount = await Expense.destroy({ where: { id: expenseId, userId: req.user.id }, transaction: t });

        await t.commit();

        res.status(201).json({ deletedCount: deletedExpenseCount, user: req.user });
    } catch (err) {
        if (t) {
            await t.rollback();
        }
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the expense.' });
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        console.log(req + 'this is user id');
        const expense = await Expense.findAll({ where: { userId: req.user.id } });
        //('hiiii', expense);
        res.status(201).json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching expense.' });
    }
};
