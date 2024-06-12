const express = require("express");
const router = express.Router();
const OfferLetter = require("../model/OfferLetter");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const generatePDF = require("../Scripts/createpdf");

const sendMail = require("../Scripts/SendMail");
const path = require("path");
const fs = require("fs");

router.post(
  "/offerLetter",

  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("from")
      .isISO8601()
      .toDate()
      .withMessage("Valid start date is required"),
    body("to").isISO8601().toDate().withMessage("Valid end date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, designation, from, to, paid } = req.body;
      const uid = uuidv4();
      
      const newOfferLetter = new OfferLetter({
        name,
        email,
        designation,
        from,
        to,
        uid,
        paid 
      });
      
      await newOfferLetter.save();
      
      res
        .status(200)
        .json({
          success: true,
          message: "Offer letter uploaded successfully",
          uid,
        });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);
router.post("/generate/:refNo", async (req, res) => {
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });
    console.log(offerLetter);

    if (!offerLetter) {
      return res
        .status(404)
        .json({ success: false, message: "Offer letter not found" });
    }

    const outputPDF = path.join(__dirname, `../temp/${refNo}.pdf`);
    console.log(outputPDF);
    await generatePDF(
      path.join(__dirname, "../pdf/fill.pdf"),
      outputPDF,
      offerLetter
    );
    

    offerLetter.offerLetter = outputPDF;
    await offerLetter.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Offer letter generated successfully",
        outputPDF,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get('/view/:refNo', async (req, res) => {
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });
   
    if (!offerLetter) {
      return res.status(404).json({ success: false, message: 'Offer letter not found' });
    }

    const pdfPath = path.join(__dirname, `../temp/${refNo}.pdf`); // Constructing the full path to the PDF file
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: 'PDF file not found' });
    }

    res.sendFile(pdfPath); // Sending the PDF file
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


router.post('/sendMail/:refNo', async (req, res) => {
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });

    if (!offerLetter) {
      return res.status(404).json({ success: false, message: 'Offer letter not found' });
    }

    const pdfPath = path.join(__dirname, `../temp/${refNo}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: 'PDF file not found' });
    }

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: offerLetter.email,
      subject: 'Your Offer Letter',
      text: 'Please find attached your offer letter.',
      attachments: [
        {
          filename: 'OfferLetter.pdf',
          path: pdfPath,
        },
      ],
    };

    await sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
