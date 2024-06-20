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

// Universal path to store temporary PDF files
const resolveFilePath = (refNo) => path.join(__dirname, `../temp/${refNo}.pdf`);

// Route to create a new offer letter
router.post(
  "/offerLetter",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("from").isISO8601().toDate().withMessage("Valid start date is required"),
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
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Route to generate an offer letter PDF
router.post("/generate/:refNo", async (req, res) => {
  let outputPDF;
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });

    if (!offerLetter) {
      return res.status(404).json({ success: false, message: "Offer letter not found" });
    }

    outputPDF = resolveFilePath(refNo);
    console.log("PDF path:", outputPDF);

    await generatePDF(
      path.join(__dirname, "../pdf/fiil2.pdf"),
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

    // Delete the generated PDF file if it was created before the error occurred
    if (outputPDF && fs.existsSync(outputPDF)) {
      fs.unlinkSync(outputPDF);
      console.log(`Deleted PDF file: ${outputPDF}`);
    }
  }
});



router.put(
  "/updateofferLetter/:uid",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("from").isISO8601().toDate().withMessage("Valid start date is required"),
    body("to").isISO8601().toDate().withMessage("Valid end date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, designation, from, to, paid } = req.body;
      const uid = req.params.uid;

      const updatedOfferLetter = await OfferLetter.findOneAndUpdate(
        { uid },
        { name, email, designation, from, to, paid },
        { new: true }
      );

      if (!updatedOfferLetter) {
        return res.status(404).json({ success: false, message: "Offer letter not found" });
      }

      res.status(200).json({
        success: true,
        message: "Offer letter updated successfully",
        uid,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);


router.get("/fetchofferLetters/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const offerLetter = await OfferLetter.findOne({ uid });

    if (!offerLetter) {
      return res.status(404).json({ success: false, message: "Offer letter not found" });
    }

    res.status(200).json({ success: true, data: offerLetter });
  } catch (error) {
    console.error("Error fetching offer letter:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.get("/view/:refNo", async (req, res) => {
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });
    console.log(offerLetter);

    if (!offerLetter) {
      return res.status(404).json({ success: false, message: "Offer letter not found" });
    }

    const pdfPath = resolveFilePath(refNo);
    console.log("PDF path for viewing:", pdfPath);

    // Check if the PDF file exists
    if (!fs.existsSync(pdfPath)) {
      console.log("PDF file does not exist. Generating new PDF.");
      const templatePath = path.join(__dirname, "../pdf/finalfill.pdf");
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

   
    fs.unlinkSync(pdfPath);
    console.log(`Deleted PDF file: ${pdfPath}`);
  } catch (error) {
    console.error("Error viewing PDF:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// Route to send an offer letter via email
router.post("/sendMail/:refNo", async (req, res) => {
  let outputPDF;
  try {
    const refNo = req.params.refNo;
    const offerLetter = await OfferLetter.findOne({ uid: refNo });

    if (!offerLetter) {
      return res.status(404).json({ success: false, message: "Offer letter not found" });
    }

    const pdfPath = resolveFilePath(refNo);

    // Check if the PDF file exists, if not generate it
    if (!fs.existsSync(pdfPath)) {
      console.log("PDF file does not exist. Generating new PDF.");
      const templatePath = path.join(__dirname, "../pdf/fill.pdf");
      await generatePDF(templatePath, pdfPath, offerLetter);
    } else {
      console.log("PDF file exists.");
    }

    // Check again if the PDF file exists after potentially generating it
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: "PDF file not found" });
    }

    // Send email with the offer letter attached
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: offerLetter.email,
      subject: "Your Offer Letter from Suvidha Foundation",
      text: `Dear ${offerLetter.name},

Greetings of the day!

Congratulations on your offer from Suvidha Foundation! Please find attached the detailed offer letter.

For the process of acceptance, please revert with the physically signed copy of the Offer Letter within 48 hours to hr@suvidhafoundationedutech.org.

Upon successful completion of your internship, you will be awarded with a "Certificate of Completion" and, based on your performance, a "Letter of Recommendation".

We look forward to hearing from you and hope you'll join our team!

Best regards,

Sonal Godshelwar
Human Resource Team
Suvidha Foundation
R. No: MH/568/95/Nagpur
H.No. 1951, W.N.4, Khaperkheda, Saoner, Nagpur
Email: info@suvidhafoundationedutech.org
Phone No: +918378042291
`,
      attachments: [
        {
          filename: "OfferLetter.pdf",
          path: pdfPath,
        },
      ],
    };

   
    await sendMail(mailOptions);

   
    fs.unlinkSync(pdfPath);
    console.log(`Deleted PDF file: ${pdfPath}`);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });

   
    if (outputPDF && fs.existsSync(outputPDF)) {
      fs.unlinkSync(outputPDF);
      console.log(`Deleted PDF file: ${outputPDF}`);
    }
  }
});

router.delete("/offerLetter/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const offerLetter = await OfferLetter.findOne({ uid });
    

    if (!offerLetter) {
      return res.status(404).json({ success: false, message: "Offer letter not found" });
    }

    // Delete associated PDF file if exists
    const pdfPath = resolveFilePath(uid);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log(`Deleted PDF file: ${pdfPath}`);
    }

    await OfferLetter.findOneAndDelete({ uid });

    res.status(200).json({
      success: true,
      message: "Offer letter deleted successfully",
      uid,
    });
  } catch (error) {
    console.error("Error deleting offer letter:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
