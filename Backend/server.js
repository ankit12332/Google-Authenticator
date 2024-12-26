const express = require('express');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let userSecret = null; // For demo purposes; replace with database storage in production.

// Endpoint to generate secret and QR code
app.post('/generate-secret', (req, res) => {
    const secret = speakeasy.generateSecret({
        name: "Ankit's MFA",
    });
    userSecret = secret; // Save secret securely in a database in a real application.

    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if (err) return res.status(500).json({ error: "Error generating QR code" });
        res.json({ secret, qrCode: dataUrl });
    });
});

// Endpoint to verify the token
app.post('/verify', (req, res) => {
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
        secret: userSecret.base32, // Replace with the user's saved secret from the database
        encoding: 'base32',
        token,
    });

    res.json({ verified });
});

// Start the server
app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});
