import express from 'express';
import cors from 'cors';
import sampleRoutes from './api/sample/sample.routes';

// Create the Express application
const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// A simple root route to check if the server is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Sample Tracking API is running!' });
});

// API Routes
// All routes related to samples will be prefixed with /api/samples
app.use('/api/samples', sampleRoutes);

export default app;