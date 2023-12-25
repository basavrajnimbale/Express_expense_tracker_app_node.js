const Expense = require('../model/expenses');
const User = require('../model/users');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices')
const S3service = require('../services/S3services')
const Url = require('../model/urls')

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
            return res.status(400).json({ success: false, message: "bad parameter" })
        }

        const deleteExpense = await Expense.findByPk(expenseId);

        if (!deleteExpense) {
            return res.status(404).json({ success: false, message: "Expense not found" }); // Return after sending response
        }

        req.user.totalExpenses -= deleteExpense.expenseamount;

        await req.user.save({ transaction: t });

        const deletedExpenseCount = await Expense.destroy({ where: { id: expenseId, userId: req.user.id }, transaction: t });

        await t.commit();

        res.status(200).json({ deletedCount: deletedExpenseCount, user: req.user });
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
        // const currentPage = req.query.page || 1;
        let {page, number} = req.query;
        currentPage = Number(page)
        number = Number(number)

        const total = await Expense.count({ where: { userId: req.user.id } });
        console.log('know the type', number, typeof(number), currentPage, typeof(total));
        const hasNextPage = (currentPage * number) < total;
        console.log(hasNextPage, '!?', currentPage * number, typeof (currentPage));
        const nextPage = hasNextPage ? Number(currentPage) + 1 : null; // Calculate next page number

        const expenses = await req.user.getExpenses({ offset: (currentPage - 1) * number, limit: number });
        // console.log(expenses);
        
        const pageData = {
            currentPage: Number(currentPage),
            lastPage: Math.ceil(total / number),
            hasNextPage,
            previousPage: currentPage > 1 ? currentPage - 1 : null, // Set previous page number or null for the first page
            nextPage
        };

        const response = { expenses, pageData }; // Combine expenses and pageData into a single object
        console.log(pageData)
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
    }
}

exports.downloadexpense = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3service.uploadToS3(stringifiedExpenses, filename);
        console.log(fileURL);
        const url = await Url.create({ url: fileURL, userId: req.user.id })
        console.log(url);
        res.status(200).json({ fileURL, success: true, url });

    } catch (err) {
        console.log(err)
        res.status(500).json({ fileURL: '', success: false, err: err });
    }
};