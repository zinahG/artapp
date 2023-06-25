

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const artworkSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available'
  },
  contactInfo: {
    email: {
      type: String
    },
    phone: {
      type: String
    }
  }
});
module.exports = mongoose.model('Artwork', artworkSchema);


