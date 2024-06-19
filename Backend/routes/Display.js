const express = require("express");
const router = express.Router();
const OfferLetter = require("../model/OfferLetter");

router.get('/offerLetters', async (req, res) => {
    try {
      const offerLetters = await OfferLetter.find();
      res.status(200).json({ success: true, data: offerLetters });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.get('/recentofferLetters', async (req, res) => {
  try {
      const offerLetters = await OfferLetter.find().sort({ createdAt: -1 }).limit(4);
      res.status(200).json({ success: true, data: offerLetters });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/countByDesignation', async (req, res) => {
  try {
    const countByDesignation = await OfferLetter.aggregate([
      { $group: { _id: "$designation", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // Sort by count descending
      { $limit: 5 }, // Limit to top 5
    ]);

    // Calculate total count for 'Others'
    const totalOthers = await OfferLetter.countDocuments() - countByDesignation.reduce((acc, curr) => acc + curr.count, 0);

    // Format the response in the desired structure for the pie chart
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
