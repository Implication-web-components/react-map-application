import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for setting up sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

// Middleware for processing JSON
app.use(express.json());

// Endpoint to set API key
app.post('/api/setApiKey', (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) {
        return res.status(400).send('API Key is required.');
    }
    req.session.apiKey = apiKey;
    res.send('API Key set successfully.');
});

// Endpoint to check the API key in the session when the application starts
app.get('/api/checkApiKey', (req, res) => {
    if (req.session.apiKey) {
        return res.status(200).send({ apiKeyExists: true });
    } else {
        return res.status(200).send({ apiKeyExists: false });
    }
});

// Proxy endpoint to fetch map script
app.get('/api/map-script', async (req, res) => {
    const apiKey = req.session.apiKey;

    if (!apiKey) {
        console.error('API Key is not set in the session.');
        return res.status(400).send('API Key is not set.');
    }

    const targetUrl = `https://js.api.mappable.world/v3/?lang=en_US`;

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'Content-Type': 'application/javascript',
            },
            params: {
                apikey: apiKey,
            },
        });

        res.set('Content-Type', 'application/javascript');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching map script:', error.message);
        res.status(500).send('Error fetching map script');
    }
});

// Proxy endpoint for map resources (such as tiles) without revealing the key
app.get('/api/map-proxy/*', async (req, res) => {
    const apiKey = req.session.apiKey;

    if (!apiKey) {
        console.error('API Key is not set in the session.');
        return res.status(400).send('API Key is not set.');
    }

    const targetUrl = `https://tiles.mappable.world${req.originalUrl.replace('/api/map-proxy', '')}`;

    try {
        const response = await axios.get(targetUrl, {
            params: {
                apikey: apiKey,
                ...req.query,
            },
            responseType: 'arraybuffer',
        });

        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching map resource:', error.message);
        res.status(500).send('Error fetching map resource');
    }
});

// Endpoint for Suggest requests
app.post('/api/suggest', async (req, res) => {
    const { query } = req.body;
    const apiKey = req.session.apiKey;

    if (!apiKey) {
        return res.status(400).send('API Key is not set.');
    }

    if (!query) {
        return res.status(400).send('Query is required.');
    }

    try {
        const response = await axios.get(`https://suggest.api.mappable.world/v1/suggest`, {
            params: {
                lang: 'en_US',
                apikey: apiKey,
                text: query,
                print_address: 1,
                attrs: 'uri',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching suggestions:', error.message);
        res.status(500).send('Error fetching suggestions');
    }
});

// Endpoint for Geocode requests
app.post('/api/geocode', async (req, res) => {
    const { uri } = req.body;
    const apiKey = req.session.apiKey;

    if (!apiKey) {
        return res.status(400).send('API Key is not set.');
    }

    if (!uri) {
        return res.status(400).send('URI is required.');
    }

    try {
        const response = await axios.get(`https://geocoder.api.mappable.world/v1`, {
            params: {
                lang: 'en_US',
                format: 'json',
                apikey: apiKey,
                uri: uri,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching geocode data:', error.message);
        res.status(500).send('Error fetching geocode data');
    }
});

// Serve static files from the correct dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Redirect all other requests to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
