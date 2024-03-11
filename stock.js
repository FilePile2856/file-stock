const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  price: Number,
  owner: String,
});

module.exports = mongoose.model('Stock', stockSchema);