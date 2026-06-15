const db = require('../config/db');

// GET /api/expenses/trip/:tripId
const getExpensesByTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    // Future database integration template (verifying trip belongs to user first):
    // const [rows] = await db.query('SELECT * FROM expenses WHERE trip_id = ?', [tripId]);

    const mockExpenses = [
      {
        id: 1,
        tripId: parseInt(tripId),
        title: 'Cena Ristorante',
        amount: 85.50,
        category: 'Ristorazione',
        receiptUrl: '/uploads/mock-receipt.jpg',
        createdAt: '2026-07-02'
      },
      {
        id: 2,
        tripId: parseInt(tripId),
        title: 'Biglietto Metro',
        amount: 12.00,
        category: 'Trasporti',
        receiptUrl: null,
        createdAt: '2026-07-03'
      }
    ];

    return res.status(200).json({
      message: `Lista spese per il viaggio ${tripId} recuperata con successo (Mock)`,
      expenses: mockExpenses
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/expenses/:id
const getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    // Future database integration template:
    // const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [id]);

    return res.status(200).json({
      message: `Dettagli spesa ${id} recuperati con successo (Mock)`,
      expense: {
        id: parseInt(id),
        tripId: 1,
        title: 'Cena Ristorante',
        amount: 85.50,
        category: 'Ristorazione',
        receiptUrl: '/uploads/mock-receipt.jpg',
        createdAt: '2026-07-02'
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/expenses
const createExpense = async (req, res) => {
  const { tripId, title, amount, category } = req.body;

  if (!tripId || !title || !amount) {
    return res.status(400).json({ error: 'I campi tripId, title e amount sono obbligatori' });
  }

  try {
    // If a file was uploaded, multer puts it in req.file
    let receiptUrl = null;
    if (req.file) {
      receiptUrl = `/uploads/${req.file.filename}`;
    }

    // Future database integration template:
    // const [result] = await db.query(
    //   'INSERT INTO expenses (trip_id, title, amount, category, receipt_url) VALUES (?, ?, ?, ?, ?)',
    //   [tripId, title, amount, category, receiptUrl]
    // );

    return res.status(201).json({
      message: 'Spesa registrata con successo (Mock)',
      expense: {
        id: 3,
        tripId: parseInt(tripId),
        title,
        amount: parseFloat(amount),
        category: category || 'Generico',
        receiptUrl,
        createdAt: new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category } = req.body;

  try {
    let receiptUrl = undefined;
    if (req.file) {
      receiptUrl = `/uploads/${req.file.filename}`;
    }

    // Future database integration template:
    // const [result] = await db.query(
    //   'UPDATE expenses SET title = ?, amount = ?, category = ?' + (receiptUrl ? ', receipt_url = ?' : '') + ' WHERE id = ?',
    //   receiptUrl ? [title, amount, category, receiptUrl, id] : [title, amount, category, id]
    // );

    return res.status(200).json({
      message: `Spesa ${id} aggiornata con successo (Mock)`,
      expense: {
        id: parseInt(id),
        title,
        amount: amount ? parseFloat(amount) : undefined,
        category,
        receiptUrl: receiptUrl || null
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    // Future database integration template:
    // const [result] = await db.query('DELETE FROM expenses WHERE id = ?', [id]);

    return res.status(200).json({
      message: `Spesa ${id} eliminata con successo (Mock)`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getExpensesByTrip,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
