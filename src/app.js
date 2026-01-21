require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const { transformLeadData } = require('./services/transformer');
const { VALID_ZIP_PREFIX } = require('./config/mapping');
const { validateLead } = require('./middleware/validator');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Primest Integration Server is Online.');
});

app.post('/webhook/primest-leads', validateLead, async (req, res) => {
    console.log('--- NEW LEAD ---');
    
    const rawData = req.body;

    const zip = rawData.lead?.zipcode?.toString() || "";
    const isOwner = rawData.questions?.["Sind Sie Eigentümer der Immobilie?"] === "Ja";

    if (!zip.startsWith(VALID_ZIP_PREFIX) || !isOwner) {
        console.log(`Lead filtered.. ZIP: ${zip}, Owner: ${isOwner}`);
        return res.status(200).json({ status: 'filtered', reason: 'Criteria not met' });
    }

    const cleanedPayload = transformLeadData(rawData);

    try {
        const response = await axios.post(process.env.ENDPOINT_2_URL, cleanedPayload, {
            headers: {
                'Authorization': `Bearer ${process.env.ENDPOINT_2_TOKEN}`,
                'Content-Type': 'application/json',

                /* 'Referer': 'https://contactapi.static.fyi/',
                'Origin': 'https://contactapi.static.fyi/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' */
            }
        });

        console.log('Lead successfully sent to client. ID:', response.data.id);
        res.status(201).json({
            status: 'success',
            customer_response: response.data
        });

    } catch (error) {
        console.error('Error sending to Endpoint 2:', error.response?.data || error.message);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to forward lead to customer API' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});