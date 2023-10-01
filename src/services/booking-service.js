const axios = require('axios');

const BookingRepository = require('../repository/booking-repository');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/index');

class BookingSerice {

    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            console.log(getFlightRequestUrl);
            const response = await axios.get(getFlightRequestUrl);
            console.log(response);
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if (data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the Booking process', 'Insufficient seats');
            }
            const totalCoast = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = { ...data, totalCost: totalCoast };
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, { totalSeats: flightData.totalSeats - booking.noOfSeats });
            const finalBooking = await this.bookingRepository.update(booking.id, { status: 'Booked' });
            return finalBooking;
        } catch (error) {
            console.log(error);
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async updateBooking (bookingId, data) {
        try {
            const isSeatChange = data.hasOwnProperty('noOfSeats');
            if(isSeatChange) {
                const preBooked = await this.bookingRepository.get(bookingId);
                const flightId = preBooked.flightId;
                const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                const axiosFlightData = await axios.get(getFlightRequestURL);
                const flightData = axiosFlightData.data.data;
                const flightPrice = flightData.price;
                if( flightData.totalSeats+preBooked.noOfSeats < data.noOfSeats ) {
                    throw new ServiceError('Something went wrong in the updating process', 'Insufficient seats');
                }
                const updatedData = {...data, totalCoast: data.noOfSeats * flightPrice};
                const response = await this.bookingRepository.updateFlight(bookingId, updatedData);
                console.log(flightData.totalSeats);
                console.log(preBooked.noOfSeats);
                console.log(data.noOfSeats);
                const updateSeatsFlight = { totalSeats: flightData.totalSeats+preBooked.noOfSeats-data.noOfSeats }
                console.log(updateSeatsFlight);
                await axios.patch(getFlightRequestURL, updateSeatsFlight);
                // await axios.patch(getFlightRequestURL, { totalSeats: flightData.totalSeats+preBooked.noOfSeats-data.noOfSeats });
                return response;
            }
            console.log(data);
            const response = await this.bookingRepository.updateFlight(bookingId, data);
            return response;
        } catch (error) {
            console.log(error);
            if(error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async cancelBooking (bookingId) {
        try {
            const cancel = { status: 'Cancelled' }
            const response = await this.bookingRepository.cancelBooking(bookingId, cancel);
            return response;
        } catch (error) {
            console.log(error);
            if(error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async getBooking (bookingId) {
        try {
            const booking = await this.bookingRepository.get(bookingId);
            return booking;
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