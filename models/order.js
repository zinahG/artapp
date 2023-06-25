const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  artworks: [
    {
      artwork: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  customer: {
    email: {
      type: String,
      required: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Customer'
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);