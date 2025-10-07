import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { CredentialStore } from './store/credentialStore';

const app = express();
const PORT = process.env.PORT || 3001;
const store = CredentialStore.getInstance();

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Issuance endpoint
app.post('/api/issue', async (req, res) => {
    try {
        const credentialData = req.body;
        const workerId = process.env.POD_NAME || 'worker-local';

        if (store.hasCredential(credentialData)) {
            return res.status(409).json({
                message: 'Credential already exists',
                issuedBy: workerId
            });
        }

        const credential = {
            id: uuidv4(),
            data: credentialData,
            issuedBy: workerId,
            issuedAt: new Date()
        };

        store.addCredential(credential);

        res.status(201).json({
            message: 'Credential issued successfully',
            credential,
            issuedBy: workerId
        });
    } catch (error) {
        console.error('Error issuing credential:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Verification endpoint
app.post('/api/verify', async (req, res) => {
    try {
        const credentialData = req.body;
        const workerId = process.env.POD_NAME || 'worker-local';

        const credential = store.findCredential(credentialData);

        if (!credential) {
            return res.status(404).json({
                message: 'Credential not found',
                verifiedBy: workerId
            });
        }

        return res.json({
            message: 'Credential verified successfully',
            isValid: true,
            credential,
            verifiedBy: workerId
        });
    } catch (error) {
        console.error('Error verifying credential:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Credential service running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;