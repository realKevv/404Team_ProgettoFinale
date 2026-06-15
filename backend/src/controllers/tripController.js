const db = require('../config/db');

// GET /api/trips
const getAllTrips = async (req, res) => {
  try {
    // Future database integration template:
    // const [rows] = await db.query('SELECT * FROM trips WHERE user_id = ?', [req.userId]);
    
    const mockTrips = [
      {
        id: 1,
        title: 'Vacanza a Parigi',
        description: 'Viaggio romantico di 5 giorni',
        startDate: '2026-07-01',
        endDate: '2026-07-06',
        userId: req.userId
      },
      {
        id: 2,
        title: 'Meeting di Lavoro a Milano',
        description: 'Fiera e meeting aziendali',
        startDate: '2026-08-15',
        endDate: '2026-08-18',
        userId: req.userId
      }
    ];

    return res.status(200).json({
      message: 'Lista viaggi recuperata con successo (Mock)',
      trips: mockTrips
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/trips/:id
const getTripById = async (req, res) => {
  const { id } = req.params;
  try {
    // Future database integration template:
    // const [rows] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [id, req.userId]);
    
    return res.status(200).json({
      message: `Dettagli viaggio ${id} recuperati con successo (Mock)`,
      trip: {
        id: parseInt(id),
        title: 'Vacanza a Parigi',
        description: 'Viaggio romantico di 5 giorni',
        startDate: '2026-07-01',
        endDate: '2026-07-06',
        userId: req.userId
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/trips
const createTrip = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Il titolo del viaggio è obbligatorio' });
  }

  try {
    // Future database integration template:
    // const [result] = await db.query(
    //   'INSERT INTO trips (title, description, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
    //   [title, description, startDate, endDate, req.userId]
    // );
    
    return res.status(201).json({
      message: 'Viaggio creato con successo (Mock)',
      trip: {
        id: 3,
        title,
        description,
        startDate,
        endDate,
        userId: req.userId
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /api/trips/:id
const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;

  try {
    // Future database integration template:
    // const [result] = await db.query(
    //   'UPDATE trips SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ? AND user_id = ?',
    //   [title, description, startDate, endDate, id, req.userId]
    // );

    return res.status(200).json({
      message: `Viaggio ${id} modificato con successo (Mock)`,
      trip: {
        id: parseInt(id),
        title,
        description,
        startDate,
        endDate,
        userId: req.userId
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  try {
    // Future database integration template:
    // const [result] = await db.query('DELETE FROM trips WHERE id = ? AND user_id = ?', [id, req.userId]);

    return res.status(200).json({
      message: `Viaggio ${id} eliminato con successo (Mock)`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
};
