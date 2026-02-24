const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const bookingService = require('./booking.service');

/**
 * Create a new service request (Lead)
 */
const requestLead = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.body.userId; // supports demo + auth
    const result = await bookingService.requestLead(userId, req.body);

    res.status(201).json(
        new ApiResponse(201, result, 'Lead request created successfully')
    );
});

/**
 * Vendor accepts a lead
 */
const acceptLead = asyncHandler(async (req, res) => {
    const vendorId = req.user?._id || req.body.vendorId; // supports demo + auth
    const { bookingId } = req.params;

    const result = await bookingService.acceptLead(vendorId, bookingId);

    res.status(200).json(
        new ApiResponse(200, result, 'Lead accepted successfully')
    );
});

/**
 * Create a new booking
 */
const createBooking = asyncHandler(async (req, res) => {
    const userId = req.user?.userId || req.body.userId;
    const booking = await bookingService.createBooking(userId, req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            {
                booking,
                message: "Request sent, waiting for vendor confirmation.",
                status: "Pending Acceptance"
            },
            'Booking request placed successfully'
        )
    );
});

/**
 * Cancel booking
 */
const cancelBooking = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await bookingService.cancelBooking(userId, id, reason);

    res.status(200).json(
        new ApiResponse(200, booking, 'Booking cancelled successfully')
    );
});

/**
 * Reschedule booking
 */
const rescheduleBooking = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
        throw new ApiError(400, 'Both date and time are required for rescheduling');
    }

    const booking = await bookingService.rescheduleBooking(
        userId,
        id,
        { date, time }
    );

    res.status(200).json(
        new ApiResponse(200, booking, 'Booking rescheduled successfully')
    );
});

/**
 * Get bookings for logged-in user or vendor
 */
const getMyBookings = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const role = req.user?.role;

    const rawBookings =
        role === 'vendor'
            ? await bookingService.getBookingsByVendor(userId)
            : await bookingService.getBookingsByUser(userId);

    const categorized = {
        pending: rawBookings.filter(b =>
            ['pending_acceptance', 'pending'].includes(b.status)
        ),
        active: rawBookings.filter(b =>
            ['on_the_way', 'arrived', 'ongoing'].includes(b.status)
        ),
        completed: rawBookings.filter(b => b.status === 'completed'),
        cancelled: rawBookings.filter(b => b.status === 'cancelled')
    };

    res.status(200).json(
        new ApiResponse(200, categorized, 'Bookings retrieved successfully')
    );
});

/**
 * Get booking by ID
 */
const getBookingById = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { id } = req.params;

    const booking = await bookingService.getBookingDetails(id, userId, role);

    res.status(200).json(
        new ApiResponse(200, { booking, otp: "1234" }, 'Booking details retrieved successfully')
    );
});

/**
 * Get completed booking history for user
 */
const getCompletedHistory = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const bookings = await bookingService.getCompletedBookingsByUser(userId);

    res.status(200).json(
        new ApiResponse(200, bookings, 'Completed booking history retrieved successfully')
    );
});

/**
 * Retry vendor search
 */
const retrySearch = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await bookingService.retrySearchVendors(userId, id);

    res.status(200).json(
        new ApiResponse(200, result, 'Search retried successfully')
    );
});

/**
 * Vendor rejects a lead
 */
const rejectLead = asyncHandler(async (req, res) => {
    const vendorId = req.user?._id || req.user?.userId || req.body.vendorId;
    const { id } = req.params;

    const result = await bookingService.rejectLead(vendorId, id);

    res.status(200).json(
        new ApiResponse(200, result, 'Lead rejected successfully')
    );
});

/**
 * Vendor marks a lead for later
 */
const markLeadLater = asyncHandler(async (req, res) => {
    const vendorId = req.user?._id || req.user?.userId || req.body.vendorId;
    const { id } = req.params;

    const result = await bookingService.markLeadLater(vendorId, id);

    res.status(200).json(
        new ApiResponse(200, result, 'Lead marked for later successfully')
    );
});

/**
 * Get vendor booking history (including Later)
 */
const getVendorHistory = asyncHandler(async (req, res) => {
    const vendorId = req.user?._id || req.user?.userId;

    const result = await bookingService.getVendorBookingHistory(vendorId);

    res.status(200).json(
        new ApiResponse(200, result, 'Vendor booking history retrieved successfully')
    );
});

module.exports = {
    // Lead flow
    requestLead,
    acceptLead,
    rejectLead,
    markLeadLater,

    // Booking flow
    createBooking,
    cancelBooking,
    rescheduleBooking,
    getMyBookings,
    getBookingById,
    getCompletedHistory,
    getVendorHistory,
    retrySearch
};
