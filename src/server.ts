import app from './app';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Determine the port to run the server on.
// Use the PORT from .env file or default to 5001.
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});