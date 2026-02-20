const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// A user can only leave one feedback per booking
feedbackSchema.index({ booking: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
