const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const app = express();

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.json());

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate PDF endpoint
app.post('/generate-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Generate HTML content
    const htmlContent = generateHTML(req.body);
    await page.setContent(htmlContent);
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'Letter',
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' }
    });
    
    await browser.close();
    
    // Send PDF
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

function generateHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h2 { color: red; text-align: center; }
        .content { padding-left: 20%; }
      </style>
    </head>
    <body>
      <h2>Sale Deed</h2>
      <div class="content">
        <p>
          This Sale Deed is made on ${data.date} between<br/>
          Full name: <strong>${data.name}</strong>,<br/>
          Father name: <strong>${data.father_name}</strong>,<br/>
          Property Size: <strong>${data.property_size}</strong> sq.ft.,<br/>
          Date of sale: <strong>${data.date}</strong>,<br/>
          Sale Amount: ₹<strong>${data.sale_amount}</strong>.
        </p>
      </div>
    </body>
    </html>
  `;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhosts:${PORT}`);
});