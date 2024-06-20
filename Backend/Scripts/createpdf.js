const { PDFDocument, StandardFonts } = require('pdf-lib');
const { readFile, writeFile } = require('fs/promises');

const createPDF = async (input, output, formData) => {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    const form = pdfDoc.getForm();

    // Embedding Helvetica font for consistency
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Font sizes and styles for fields
    const fieldStyles = {
      date_field: { size: 10, bold: true },
      ref_field: { size: 11, bold: true },
      Intern_name: { size: 12, bold: true },
      destination_field: { size: 10, bold: true },
      role_field: { size: 10, bold: false },
      period_field: { size: 10, bold: false }
    };

    // // Log all text field names for debugging purposes
    // console.log('All text fields:');
    // form.getFields().forEach(field => {
    //   if (field.constructor.name === 'PDFTextField') {
    //     console.log(field.getName());
    //   }
    // });

    // Function to truncate text to first two words
    const truncateToTwoWords = (text) => {
      const words = text.trim().split(/\s+/);
      if (words.length <= 2) {
        fieldStyles.destination_field.size=15
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
      if (fieldStyles.Intern_name.bold) {
        internNameField.defaultUpdateAppearances(helveticaFont);
        internNameField.defaultUpdateAppearances(helveticaFont, fieldStyles.Intern_name.size);
      } else {
        internNameField.defaultUpdateAppearances(helveticaFont, fieldStyles.Intern_name.size);
      }
    }

    // Truncate destination_field to first two words if exceeds 12 characters
    let truncatedDesignation = formData.designation;
    if (truncatedDesignation.length > 10) {
      truncatedDesignation = truncateToTwoWords(formData.designation);
    }
    form.getTextField('destination_field').setText(truncatedDesignation);

    // Set role_field with designation and adjust font size
    form.getTextField('role_field').setText(truncatedDesignation);
    if (fieldStyles.role_field.bold) {
      const roleField = form.getTextField('role_field');
      roleField.defaultUpdateAppearances(helveticaFont);
      roleField.defaultUpdateAppearances(helveticaFont, fieldStyles.role_field.size);
    } else {
      form.getTextField('role_field').defaultUpdateAppearances(helveticaFont, fieldStyles.role_field.size);
    }

    // Set period_field with date range
    form.getTextField('period_field').setText(`${formData.from.toDateString()} to ${formData.to.toDateString()}`);

    // Setting default appearance for all fields
    form.getFields().forEach(field => {
      if (field.constructor.name === 'PDFTextField') {
        const defaultAppearance = field.acroField.getDefaultAppearance() ?? '';
        const fieldStyle = fieldStyles[field.getName()];
        let newDefaultAppearance = defaultAppearance + `\n/${helveticaFont.name} ${fieldStyle.size} Tf`;
        
        if (fieldStyle.bold) {
          newDefaultAppearance = defaultAppearance + `\n/${helveticaFont.name} ${fieldStyle.size} Tf`;
        }

        field.acroField.setDefaultAppearance(newDefaultAppearance);
      }
    });

    const pdfBytes = await pdfDoc.save();
    await writeFile(output, pdfBytes);

    console.log('PDF created successfully.');
    return output;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = createPDF;
