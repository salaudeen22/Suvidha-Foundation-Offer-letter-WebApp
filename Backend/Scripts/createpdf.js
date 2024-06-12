const { PDFDocument } = require('pdf-lib');
const { readFile, writeFile } = require('fs/promises');

const createPDF = async (input, output, formData) => {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    const form = pdfDoc.getForm();

    // Populate existing form fields with data from formData
    form.getTextField('date_field').setText(formData.date.toDateString());
    form.getTextField('refno_field').setText(formData.uid);
    form.getTextField('position_field').setText(formData.designation);
    form.getTextField('role_field').setText(formData.designation); // Assuming 'role' and 'designation' are the same
    form.getTextField('period_field').setText(`${formData.from.toDateString()} to ${formData.to.toDateString()}`);

    const pdfBytes = await pdfDoc.save();
    await writeFile(output, pdfBytes);

    return output;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


module.exports = createPDF;