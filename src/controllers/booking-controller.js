const { StatusCodes } = require('http-status-codes');

const BookingSerice = require('../services/booking-service');
const { response } = require('express');

const bookingService = new BookingSerice();

const create = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        console.log('From booking controller', response);
        return res.status(StatusCodes.OK).json({
            message: 'Successfully completed booking',
            success: true,
            err: {},
            data: response
        })
    } catch (error) {
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        })
    }
}

module.exports = {
    create
}