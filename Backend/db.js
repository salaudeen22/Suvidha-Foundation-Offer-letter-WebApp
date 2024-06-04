const mongoose = require("mongoose");


const mongoURI = process.env.MONGOCONNECTION;
const mongoDb = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
   
       
   
  } catch (error) {
    console.log(error);
  }
};
module.exports = mongoDb;
