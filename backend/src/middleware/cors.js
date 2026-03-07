import cors from 'cors';

const isDevelopment = process.env.NODE_ENV === 'development';
const frontendUrl = isDevelopment 
  ? process.env.FRONTEND_URL || 'http://localhost:5173'
  : process.env.FRONTEND_URL_PROD || 'https://your-domain.com';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests, etc)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      frontendUrl,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

    if (allowedOrigins.includes(origin) || isDevelopment) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
});
