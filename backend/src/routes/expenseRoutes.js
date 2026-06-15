const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// All expense routes require authentication
router.use(authMiddleware);

router.get('/trip/:tripId', expenseController.getExpensesByTrip);
router.get('/:id', expenseController.getExpenseById);
router.post('/', upload.single('receipt'), expenseController.createExpense);
router.put('/:id', upload.single('receipt'), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
