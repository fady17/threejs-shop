import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import dalleRoutes from './routes/dalle.routes.js';

dotenv.config();

const app = express();

// Proper CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parsing setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Use the dalle routes
app.use("/api/v1/dalle", dalleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from DALL.E" })
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));