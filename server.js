const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/generate-deed', (req, res) => {
    res.render('generate-deed');
});

app.post('/generate-deed', (req, res) => {
    const { name, father_name, property_size, sale_amount, date } = req.body;
    // Process the data and generate PDF
    res.render('preview-deed', {
        name,
        father_name,
        property_size,
        sale_amount,
        date
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});