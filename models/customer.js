const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        artworkId: {
          type: Schema.Types.ObjectId,
          ref: 'Artwork',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

customerSchema.methods.addToCart = function(artwork) {
  const cartArtworkIndex = this.cart.items.findIndex(cp => {
    return cp.artworkId.toString() === artwork._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartArtworkIndex >= 0) {
    newQuantity = this.cart.items[cartArtworkIndex].quantity + 1;
    updatedCartItems[cartArtworkIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      artworkId: artwork._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

customerSchema.methods.removeFromCart = function(artworkId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.artworkId.toString() !== artworkId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

customerSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);





