const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

// Import JSON data
const apartments = require("./apartament.json");
const house = require("./house.json");
const lot = require('./lot.json');
const realtor = require('./realtor.json');

const app = express();

// Dynamic port for hosting services (like Render or Railway)
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serving static images
// Note: Ensure your images are in a 'public/images' folder within the backend directory
const imagesPath = path.join(__dirname, 'public/images');
app.use('/images', express.static(imagesPath));

// --- API Routes ---

app.get('/apartments', (req, res) => {
    const { rooms, building, furnishing, repair, type } = req.query;

    let filtered = apartments.filter(a => {
        return (!rooms || String(a.rooms) === String(rooms)) &&
               (!building || a.building === building) &&
               (!furnishing || a.furnishing === furnishing) &&
               (!repair || a.repair === repair) &&
               (!type || a.type === type);
    });

    res.json(filtered);
});

app.get('/houses', (req, res) => {
    const { rooms, type, propertyType, building, furnishing, repair } = req.query;
    
    let filtered = house.filter(a => {
        return (!rooms || String(a.rooms) === String(rooms)) &&
               (!propertyType || a.propertyType === propertyType) &&
               (!building || a.building === building) &&
               (!furnishing || a.furnishing === furnishing) &&
               (!repair || a.repair === repair) &&
               (!type || a.type === type);
    });
    res.json(filtered);
});

app.get('/lot', (req, res) => {
    res.json(lot);
});

app.get('/realtor', (req, res) => {
    res.json(realtor);
});

// --- Telegram Bot Integration ---
const TOKEN = "8756676669:AAHkKwSpy5NQLLoL03Slt9D_nlRgH6KVOoo";
const CHAT_ID = '939294728';

app.post('/li', async (req, res) => {
    const { message } = req.body;
    
    try {
        await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
        console.log('Message sent to Telegram successfully');
        res.status(200).send('Success');
    } catch (error) {
        console.error('Telegram API Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});