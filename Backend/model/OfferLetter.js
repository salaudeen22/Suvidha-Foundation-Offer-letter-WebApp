const mongoose = require('mongoose');
const { Schema } = mongoose;

const interschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  uid: {
    type: String,
    
    unique: true, 
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  
  paid: {
    type: String,
    enum: ["paid", "unpaid"],
    required: true,
  },
  
});

module.exports = mongoose.model('Intern', interschema);
