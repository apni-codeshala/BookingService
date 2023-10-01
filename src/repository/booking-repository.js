const { StatusCodes } = require('http-status-codes');

const { Booking } = require('../models/index');
const { AppError, ValidationError} = require('../utils/index');

class BookingRepository {

    async create (data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create Bookiing',
                'There are some issue in creating new booking, please tryagain later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update (bookingId, data) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status) {
                booking.status = data.status;
            }
            await booking.save();
            return booking;
        } catch (error) {
            throw new AppError (
                'RepositoryError',
                'Cannot Update Booking',
                'There was some issue in updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateFlight (bookingId, data) {
        try {
            const response = await Booking.update(data, {
                where: {
                    id: bookingId
                }
            });
            return response;
        } catch (error) {
            throw new AppError (
                'Repository Error',
                'Cannot update booking',
                'There was some issue in updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async cancelBooking (bookingId, data) {
        try {
            console.log('Inside booking repository', data, bookingId);
            const response = await Booking.update(data, {
                where: {
                    id: bookingId
                }
            });
            return response;
        } catch (error) {
            throw new AppError (
                'Repository Error',
                'Cannot able to cancel booking try again later',
                'There was some issue in cancelling the flight, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR 
            );
        }
    }

    async get (bookingId) {
        try {
            const response = await Booking.findByPk(bookingId);
            return response;
        } catch (error) {
            throw new AppError (
                'Repository Error',
                'Cannot able to get bboking try again later',
                'There was some issue in getting the flight, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR 
            );
        }
    }

}

module.exports = BookingRepository;