const { StatusCodes } = require('http-status-codes');

const BookingSerice = require('../services/booking-service');

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

const update = async (req, res) => {
    try {
        const response = await bookingService.updateBooking(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({
            message: 'Successfully updated the flight',
            success: true,
            err: {},
            data: response
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        });
    }
}

const cancel = async (req, res) => {
    try {
        const response = await bookingService.cancelBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            message: 'Successfully cancelled the flight',
            success: true,
            err: {},
            data: response
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        });
    }
}

const get = async (req, res) => {
    try {
        const booking = await bookingService.getBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            message: 'Successfully getting the flight',
            success: true,
            err: {},
            data: booking
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        });
    }
}

module.exports = {
    create,
    update,
    cancel,
    get
}