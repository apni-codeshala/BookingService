const axios = require('axios');

const BookingRepository = require('../repository/booking-repository');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/index');

class BookingSerice {

    constructor () {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking (data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            console.log(getFlightRequestUrl);
            const response = await axios.get(getFlightRequestUrl);
            console.log(response);
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the Booking process', 'Insufficient seats');
            }
            const totalCoast = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost: totalCoast};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: 'Booked'});
            return finalBooking;
        } catch (error) {
            console.log(error);
            if(error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }
    }

}

module.exports = BookingSerice;