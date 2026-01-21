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

app.use(express.static('public'));

let activityLogs = [];

const logger = (msg) => {
    const entry = `${new Date().toISOString()} - ${msg}`;
    activityLogs.unshift(entry);
    if (activityLogs.length > 20) activityLogs.pop();
    console.log(entry);
};

app.get('/system/logs', (req, res) => {
    res.send(`
        <html>
            <body style="background: #1a1a1a; color: #00ff00; font-family: monospace; padding: 20px;">
                <h1>System Activity Logs</h1>
                <pre>${activityLogs.join('\n')}</pre>
                <script>setTimeout(() => location.reload(), 5000);</script>
            </body>
        </html>
    `);
});

app.post('/webhook/primest-leads', validateLead, async (req, res) => {
    
    const rawData = req.body;

    const rawZip = rawData.zipcode;
    const zipStr = String(rawZip || "");
    const isOwner = rawData.questions?.["Sind Sie Eigentümer der Immobilie?"] === "Ja";

    logger(`--- NEW LEAD RECEIVED ---`);
    logger(`Incoming ZIP: "${rawZip}" | Owner: ${isOwner}`);

    if (!zipStr.startsWith(VALID_ZIP_PREFIX) || !isOwner) {
        logger(`[FILTER] Lead REJECTED. ZIP: ${zipStr}, Owner: ${isOwner}`);
        return res.status(200).json({ status: 'filtered', reason: 'Criteria not met (ZIP 66 or Owner status)' });
    }

    const cleanedPayload = transformLeadData(rawData);

    try {
        const response = await axios.post(process.env.ENDPOINT_2_URL, cleanedPayload, {
            headers: {
                'Authorization': `Bearer ${process.env.ENDPOINT_2_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        logger('Lead successfully sent to client. ID:', response.data.id);
        res.status(201).json({
            status: 'success',
            customer_response: response.data
        });

    } catch (error) {
        logger('[SERVER ERROR]', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Internal processing error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger(`Server running on port ${PORT}`);
});