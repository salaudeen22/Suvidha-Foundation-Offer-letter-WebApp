const express = require("express");
const router = express.Router();
const OfferLetter = require("../model/OfferLetter");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const generatePDF = require("../Scripts/createpdf");
const sendMail = require("../Scripts/SendMail");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

//universal path
const resolveFilePath = (refNo) => path.join(__dirname, `../temp/${refNo}.pdf`);

// Route to create a new offer letter
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
        paid,
      });

      await newOfferLetter.save();

      res.status(200).json({
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

// Route to generate an offer letter PDF
router.post("/generate/:refNo", async (req, res) => {
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });

    if (!offerLetter) {
      return res
        .status(404)
        .json({ success: false, message: "Offer letter not found" });
    }

    const outputPDF = resolveFilePath(refNo);
    console.log("PDF path:", outputPDF);

    await generatePDF(
      path.join(__dirname, "../pdf/fill.pdf"),
      outputPDF,
      offerLetter
    );

    offerLetter.offerLetter = outputPDF;
    let pdfDoc = outputPDF;
    pdfDoc.getForm().flatten();
    await offerLetter.save();

    res.status(200).json({
      success: true,
      message: "Offer letter generated successfully",
      outputPDF,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to view an offer letter PDF and flatten it
router.get("/view/:refNo", async (req, res) => {
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });

    if (!offerLetter) {
      return res
        .status(404)
        .json({ success: false, message: "Offer letter not found" });
    }

    const pdfPath = resolveFilePath(refNo);
    console.log("PDF path for viewing:", pdfPath);

    // Check if the PDF file exists
    if (!fs.existsSync(pdfPath)) {
      console.log("PDF file does not exist. Generating new PDF.");
      const templatePath = path.join(__dirname, "../pdf/fill.pdf");
      await generatePDF(templatePath, pdfPath, offerLetter);
    } else {
      console.log("PDF file exists.");
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.getForm().flatten();

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${refNo}.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error viewing PDF:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to send an offer letter via email
router.post("/sendMail/:refNo", async (req, res) => {
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });

    if (!offerLetter) {
      return res
        .status(404)
        .json({ success: false, message: "Offer letter not found" });
    }

    const pdfPath = resolveFilePath(refNo);
    console.log("PDF path for email:", pdfPath);

    if (!fs.existsSync(pdfPath)) {
      return res
        .status(404)
        .json({ success: false, message: "PDF file not found" });
    }

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: offerLetter.email,
      subject: "Your Offer Letter",
      text: "Please find attached your offer letter.",
      attachments: [
        {
          filename: "OfferLetter.pdf",
          path: pdfPath,
        },
      ],
    };

    await sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
