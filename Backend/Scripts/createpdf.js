const { PDFDocument, StandardFonts } = require('pdf-lib');
const { readFile, writeFile } = require('fs/promises');

const createPDF = async (input, output, formData) => {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    const form = pdfDoc.getForm();

    // Embedding Helvetica font for consistency
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Font size for bold fields
    const fontSizeBold = 10;
    // Font size for regular fields
    const fontSizeRegular = 9;

    // Log all text field names for debugging purposes
    console.log('All text fields:');
    form.getFields().forEach(field => {
      if (field.constructor.name === 'PDFTextField') {
        console.log(field.getName());
      }
    });

    // Function to truncate text to first two words
    const truncateToTwoWords = (text) => {
      const words = text.trim().split(/\s+/);
      if (words.length <= 2) {
        return text;
      } else {
        return words.slice(0, 2).join(' ');
      }
    };

    // Populate existing form fields with data from formData
    form.getTextField('date_field').setText(formData.date.toDateString());
    form.getTextField('ref_field').setText(formData.uid);
    
    // Set Intern_name field with bold font and regular font for others
    if (formData.name) {
      const internNameField = form.getTextField('Intern_name');
      internNameField.setText(formData.name);
      internNameField.defaultUpdateAppearances(helveticaFont);
      internNameField.defaultUpdateAppearances(helveticaFont, fontSizeBold);
    }

    // Truncate destination_field to first two words if exceeds 12 characters
    let truncatedDesignation = formData.designation;
    if (truncatedDesignation.length > 12) {
      truncatedDesignation = truncateToTwoWords(formData.designation);
    }
    form.getTextField('destination_field').setText(truncatedDesignation);

    // Set role_field with designation
    form.getTextField('role_field').setText(formData.designation);

    // Set period_field with date range
    form.getTextField('period_field').setText(`${formData.from.toDateString()} to ${formData.to.toDateString()}`);

    // Setting default appearance for all fields
    form.getFields().forEach(field => {
      if (field.constructor.name === 'PDFTextField') {
        const defaultAppearance = field.acroField.getDefaultAppearance() ?? '';
        let newDefaultAppearance = defaultAppearance + `\n/${helveticaFont.name} ${fontSizeRegular} Tf`;
        
        // Set bold font size for specific fields
        if (field.getName() === 'date_field' || field.getName() === 'ref_field' || field.getName() === 'Intern_name' || field.getName() === 'destination_field') {
          newDefaultAppearance = defaultAppearance + `\n/${helveticaFont.name} ${fontSizeBold} Tf`;
        }

        field.acroField.setDefaultAppearance(newDefaultAppearance);
      }
    });

    const pdfBytes = await pdfDoc.save();
    await writeFile(output, pdfBytes);

    return output;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = createPDF;
