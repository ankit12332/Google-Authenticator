import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [qrCode, setQrCode] = useState('');
    const [token, setToken] = useState('');
    const [isVerified, setIsVerified] = useState(null);

    // Generate the secret and QR code
    const generateSecret = async () => {
        try {
            const response = await axios.post('http://localhost:3000/generate-secret');
            setQrCode(response.data.qrCode);
            console.log('Generated Secret:', response.data.secret);
        } catch (error) {
            console.error('Error generating secret:', error);
        }
    };

    // Verify the token
    const verifyToken = async () => {
        try {
            const response = await axios.post('http://localhost:3000/verify', { token });
            setIsVerified(response.data.verified);
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Google Authenticator MFA</h1>
            <button onClick={generateSecret} style={{ padding: '10px 20px', margin: '10px' }}>
                Generate QR Code
            </button>
            {qrCode && (
                <div>
                    <p>Scan this QR code with Google Authenticator:</p>
                    <img src={qrCode} alt="QR Code" />
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={{ padding: '10px', marginRight: '10px' }}
                />
                <button onClick={verifyToken} style={{ padding: '10px 20px' }}>
                    Verify Token
                </button>
            </div>
            {isVerified !== null && (
                <p style={{ marginTop: '20px', fontSize: '18px', color: isVerified ? 'green' : 'red' }}>
                    {isVerified ? 'Token Verified!' : 'Invalid Token'}
                </p>
            )}
        </div>
    );
}

export default App;
