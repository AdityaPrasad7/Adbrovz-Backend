const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    moreInfo: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
    adminPrice: {
      type: Number,
    },
    isAdminPriced: {
      type: Boolean,
      default: false,
    },
    approxCompletionTime: {
      type: Number, // in minutes
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    quantityEnabled: {
      type: Boolean,
      default: true,
    },
    priceAdjustmentEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
serviceSchema.index({ category: 1, subcategory: 1 });
serviceSchema.index({ isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

