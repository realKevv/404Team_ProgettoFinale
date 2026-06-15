const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Prepared database pool

// POST /api/auth/register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email e password sono richiesti' });
  }

  try {
    // Mock user registration success.
    // Future database query integration template:
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    
    return res.status(201).json({
      message: 'Utente registrato con successo (Mock)',
      user: {
        id: 1,
        username,
        email
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono richieste' });
  }

  try {
    // Mock login verification.
    // Future database query integration template:
    // const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    // const user = rows[0];
    // if (!user || !(await bcrypt.compare(password, user.password))) { ... }
    
    const mockUserId = 1;
    const token = jwt.sign(
      { userId: mockUserId, email: email },
      process.env.JWT_SECRET || 'super_secret_session_token_key_123!',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Accesso eseguito con successo (Mock)',
      token,
      user: {
        id: mockUserId,
        email,
        username: 'UserMock'
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    // User is retrieved from authMiddleware (req.userId)
    // Future database query integration template:
    // const [rows] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [req.userId]);

    return res.status(200).json({
      message: 'Profilo utente recuperato con successo (Mock)',
      user: {
        id: req.userId,
        username: 'UserMock',
        email: 'user@mock.com'
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
};
