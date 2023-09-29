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
                'Cannot Updat Booking',
                'There was some issue in updating the booing, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

}

module.exports = BookingRepository;