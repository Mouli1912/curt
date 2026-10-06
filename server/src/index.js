const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables from root .env or default
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (non-blocking fallback)
connectDB();

const { requestLoggerMiddleware } = require('./middleware/requestLogger');
const { verifyAuthToken } = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);
app.use('/api', verifyAuthToken);

// Routes
const graphRoutes = require('./routes/graph.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const reportRoutes = require('./routes/report.routes');
const credentialRoutes = require('./routes/credential.routes');
const adminRoutes = require('./routes/admin.routes');
const recruiterRoutes = require('./routes/recruiter.routes');
const userRoutes = require('./routes/user.routes');

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Graph API Endpoint
app.use('/api/graph', graphRoutes);

// Assessment API Endpoints
app.use('/api/assessment', assessmentRoutes);

// Gap Report API Endpoints
app.use('/api/report', reportRoutes);

// Credential API Endpoints
app.use('/api/credential', credentialRoutes);

// Admin API Endpoints
app.use('/api/admin', adminRoutes);

// Recruiter API Endpoints
app.use('/api/recruiters', recruiterRoutes);

// User Profile API Endpoints
app.use('/api/profile', userRoutes);

// Serve static React frontend files if public folder exists (Docker single-port container)
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// Start Server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SkillPath Server] Running on http://localhost:${PORT}`);
    console.log(`[SkillPath Server] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[SkillPath Server] Skill graph API: http://localhost:${PORT}/api/graph/frontend-developer`);
    console.log(`[SkillPath Server] Assessment API: http://localhost:${PORT}/api/assessment/start`);
    console.log(`[SkillPath Server] Gap Report API: http://localhost:${PORT}/api/report/pro-user`);
    console.log(`[SkillPath Server] Credential API: http://localhost:${PORT}/api/credential/public-key`);
  });
}

module.exports = app;
