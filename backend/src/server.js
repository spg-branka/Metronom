import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Route imports
import weatherRoutes from './routes/weather.js';

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js';
import { corsMiddleware } from './middleware/cors.js';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware);

// Routes
app.use('/api/weather', weatherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler (must be last)
app.use(errorHandler);

export const startServer = (port = PORT, host = HOST) => {
  return app.listen(port, host, () => {
    console.log(`\nMetronom Backend running on http://${host}:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Documentation: http://${host}:${port}/api/weather\n`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer(PORT, HOST);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  process.exit(0);
});
