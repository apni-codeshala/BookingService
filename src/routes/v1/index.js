const express = require('express');

const router = express.Router();

const { BookingController } = require('../../controllers/index');

router.post('/bookings', BookingController.create);
router.get('/bookings/:id', BookingController.get);
router.patch('/bookings/:id', BookingController.update);
router.delete('/bookings/:id', BookingController.cancel);

module.exports = router;