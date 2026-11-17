const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint: returns friendly HTML if opened in a browser, or JSON if called by an API client
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>CollabCode API Status</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: #1e293b;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            max-width: 520px;
            text-align: center;
            border: 1px solid #334155;
          }
          .badge {
            display: inline-block;
            background: #10b981;
            color: #fff;
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          h1 { margin: 0 0 0.5rem 0; font-size: 1.6rem; color: #38bdf8; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }
          .btn {
            display: inline-block;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
          }
          .btn:hover { background: #2563eb; }
          .endpoints {
            text-align: left;
            background: #0f172a;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1.5rem;
            font-family: monospace;
            font-size: 0.85rem;
            color: #a5f3fc;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">● API Online</span>
          <h1>CollabCode Backend Server</h1>
          <p>The Express.js REST API and MongoDB connection are running normally. To view the user interface (Login, Dashboard, Rooms), launch the frontend app:</p>
          <a class="btn" href="http://localhost:5173" target="_blank">Launch React Frontend (localhost:5173) →</a>
          <div class="endpoints">
            <strong>Endpoints:</strong><br/>
            • GET /api/health<br/>
            • POST /api/auth/login<br/>
            • POST /api/auth/signup<br/>
            • GET /api/rooms
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    status: 'online',
    message: 'CollabCode Express Backend API is running successfully!',
    frontendApp: 'http://localhost:5173',
    healthCheck: '/api/health'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
