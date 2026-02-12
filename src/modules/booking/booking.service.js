const Booking = require('../../models/Booking.model');
const Service = require('../../models/Service.model');
const ApiError = require('../../utils/ApiError');
const crypto = require('crypto');
const mongoose = require('mongoose');

/**
 * Helper to find a booking by either MongoDB ID or custom bookingID
 */
const findBookingByUser = async (bookingId, userId) => {
    const query = { user: userId };
    if (mongoose.isValidObjectId(bookingId)) {
        query.$or = [{ _id: bookingId }, { bookingID: bookingId }];
    } else {
        query.bookingID = bookingId;
    }
    return await Booking.findOne(query);
};

/**
 * Generate a unique booking ID
 * Format: B + timestamp (shortened) + random hex
 */
const generateBookingID = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `B${timestamp}${random}`;
};

/**
 * Create a new booking
 */
const createBooking = async (userId, bookingData) => {
    const {
        services,
        date,
        time,
        address,
        totalPrice,
        latitude,
        longitude,
        pincode,
        confirmation
    } = bookingData;

    if (!services || services.length === 0) {
        throw new ApiError(400, 'At least one service is required for booking');
    }

    // Process services and validate
    const processedServices = [];
    for (const item of services) {
        const serviceDoc = await Service.findById(item.serviceId);
        if (!serviceDoc) {
            throw new ApiError(404, `Service with ID ${item.serviceId} not found`);
        }

        processedServices.push({
            service: serviceDoc._id,
            quantity: item.quantity || 1,
            adminPrice: serviceDoc.adminPrice,
            // If adminPrice exists, finalPrice is adminPrice * quantity
            finalPrice: serviceDoc.adminPrice ? (serviceDoc.adminPrice * (item.quantity || 1)) : 0,
            isPriceConfirmed: !!serviceDoc.adminPrice
        });
    }

    // Create booking record
    const booking = await Booking.create({
        bookingID: generateBookingID(),
        user: userId,
        services: processedServices,
        scheduledDate: new Date(date),
        scheduledTime: time,
        location: {
            address,
            latitude,
            longitude,
            pincode
        },
        pricing: {
            totalPrice: totalPrice || 0,
            basePrice: totalPrice || 0
        },
        status: 'pending_acceptance'
    });

    // If user confirms on creation, trigger vendor search
    if (confirmation === true) {
        // Run search in background to not block response
        searchVendors(booking).then(nearby => {
            if (nearby.length === 0) {
                console.log(`[INFO] No vendors found for booking ${booking.bookingID}`);
                // In a real app, send a notification to user here
            }
        }).catch(err => {
            console.error(`[ERROR] Background vendor search failed for ${booking.bookingID}:`, err);
        });
    }

    return booking;
};

const Vendor = require('../../models/Vendor.model');

/**
 * Generate a 4-digit numeric OTP
 */
const generateNumericOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const config = require('../../config/env');

/**
 * Find available vendors (Simplified for now)
 */
const searchVendors = async (booking) => {
    console.log(`[DEBUG] Searching vendors for booking ${booking.bookingID}`);

    // Simplified: Just returning all online vendors for now as requested
    const onlineVendors = await Vendor.find({
        'dutyStatus.isOn': true,
        isActive: true,
        isVerified: true,
        isSuspended: false,
        isBlocked: false,
    });

    const results = onlineVendors.map(v => ({
        vendorId: v._id,
        distance: 0 // Placeholder
    }));

    console.log(`[DEBUG] Found ${results.length} online vendors`);

    return results;
};

/**
 * Cancel Booking (User side)
 */
const cancelBooking = async (userId, bookingId, reason) => {
    const booking = await findBookingByUser(bookingId, userId);
    if (!booking) throw new ApiError(404, 'Booking not found');

    if (['completed', 'cancelled'].includes(booking.status)) {
        throw new ApiError(400, `Booking is already ${booking.status}`);
    }

    booking.status = 'cancelled';
    booking.cancellation = {
        cancelledBy: 'user',
        reason,
        cancelledAt: new Date()
    };

    await booking.save();
    return booking;
};

/**
 * Reschedule Booking (User side)
 * Requirement: Max 2 reschedules allowed
 */
const rescheduleBooking = async (userId, bookingId, { date, time }) => {
    console.log(`[SERVICE] Rescheduling booking: ${bookingId}, Date: ${date}, Time: ${time}`);

    const booking = await findBookingByUser(bookingId, userId);
    if (!booking) throw new ApiError(404, 'Booking not found');

    if (booking.rescheduleCount >= 2) {
        throw new ApiError(400, 'Maximum reschedule limit (2) reached for this booking');
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
        throw new ApiError(400, 'Cannot reschedule a completed or cancelled booking');
    }

    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
        throw new ApiError(400, 'Invalid date format provided');
    }

    booking.scheduledDate = newDate;
    booking.scheduledTime = time;
    booking.rescheduleCount += 1;

    await booking.save();
    return booking;
};

/**
 * Get bookings for a specific user
 */
const getBookingsByUser = async (userId) => {
    return await Booking.find({ user: userId })
        .populate('services.service', 'title isAdminPriced adminPrice photo')
        .populate('vendor', 'name phoneNumber')
        .sort({ createdAt: -1 });
};

/**
 * Get bookings for a specific vendor
 */
const getBookingsByVendor = async (vendorId) => {
    return await Booking.find({ vendor: vendorId })
        .populate('services.service', 'title isAdminPriced adminPrice photo')
        .populate('user', 'name phoneNumber')
        .sort({ createdAt: -1 });
};

/**
 * Retry vendor search for a booking
 */
const retrySearchVendors = async (userId, bookingId) => {
    const booking = await findBookingByUser(bookingId, userId);
    if (!booking) throw new ApiError(404, 'Booking not found');

    if (booking.status !== 'pending_acceptance') {
        throw new ApiError(400, 'Search can only be retried for pending bookings');
    }

    const nearby = await searchVendors(booking);
    return {
        found: nearby.length > 0,
        count: nearby.length,
        bookingID: booking.bookingID
    };
};

module.exports = {
    createBooking,
    generateBookingID,
    searchVendors,
    cancelBooking,
    rescheduleBooking,
    getBookingsByUser,
    getBookingsByVendor,
    retrySearchVendors
};
