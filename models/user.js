const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  balance: Number,
  stocks: [
    {
      stockName: String,
      stockAmount: Number,
      stockPrice: Number,
    },
  ],
  // Add other user-related fields as needed
});

module.exports = mongoose.model('User', userSchema);
