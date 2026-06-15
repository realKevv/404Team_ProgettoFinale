const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middlewares/authMiddleware');

// All trip routes require authentication
router.use(authMiddleware);

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
