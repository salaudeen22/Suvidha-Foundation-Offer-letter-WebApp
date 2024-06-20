const express = require("express");
const router = express.Router();
const OfferLetter = require("../model/OfferLetter");

router.get('/offerLetters', async (req, res) => {
    try {
      const offerLetters = await OfferLetter.find().sort({ date: -1 });
      // console.log(offerLetters);
      res.status(200).json({ success: true, data: offerLetters });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.get('/recentofferLetters', async (req, res) => {
  try {
      // Fetch the most recent 4 offer letters, sorted by the date field in descending order
      const offerLetters = await OfferLetter.find().sort({ date: -1 }).limit(4);
      // console.log(offerLetters);
      res.status(200).json({ success: true, data: offerLetters });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/totalOfferLetters', async (req, res) => {
  try {
    const totalCount = await OfferLetter.countDocuments();
    // console.log(totalCount);
    res.status(200).json({ success: true, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
router.get('/currentWorkingOfferLetters', async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date

    const currentWorkingOfferLetters = await OfferLetter.find({
      // Filter offer letters where the current date is between 'from' and 'to' dates
      $and: [
        { from: { $lte: currentDate } }, // Start date is less than or equal to current date
        { to: { $gte: currentDate } }   // End date is greater than or equal to current date
      ]
    }).countDocuments();

    res.status(200).json({ success: true, data: currentWorkingOfferLetters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/countByDesignation', async (req, res) => {
  try {
    const countByDesignation = await OfferLetter.aggregate([
      { $group: { _id: "$designation", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, 
      { $limit: 5 }, 
    ]);

  
    const totalOthers = await OfferLetter.countDocuments() - countByDesignation.reduce((acc, curr) => acc + curr.count, 0);

    let pieChartData = countByDesignation.map(item => ({
      name: item._id,
      value: item.count
    }));

    // Add 'Others' category if there are more than 5 designations
    if (totalOthers > 0) {
      pieChartData.push({ name: 'Others', value: totalOthers });
    }

    res.status(200).json({ success: true, data: pieChartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
router.get('/barGraphData', async (req, res) => {
  try {
     
      const countByDesignation = await OfferLetter.aggregate([
          { $group: { _id: "$designation", paid: { $sum: { $cond: [{ $eq: ["$paid", "paid"] }, 1, 0] } }, unpaid: { $sum: { $cond: [{ $eq: ["$paid", "unpaid"] }, 1, 0] } } } },
      ]);

    
      const barGraphData = countByDesignation.map(item => ({
          category: item._id,
          paid: item.paid,
          unpaid: item.unpaid,
      }));

      res.status(200).json({ success: true, data: barGraphData });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
module.exports = router;
