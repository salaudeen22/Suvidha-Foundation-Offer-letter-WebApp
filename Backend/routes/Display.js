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


module.exports = router;
