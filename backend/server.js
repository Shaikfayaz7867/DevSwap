const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');

const { connectDB } = require('./src/config/db');
const { initCloudinary } = require('./src/config/cloudinary');
const { setupSocket } = require('./src/services/socketService');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
initCloudinary();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'DevSwap API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/onboarding', require('./src/routes/onboardingRoutes'));
app.use('/api/swipes', require('./src/routes/swipeRoutes'));
app.use('/api/posts', require('./src/routes/postRoutes'));
app.use('/api/matches', require('./src/routes/matchRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/explore', require('./src/routes/exploreRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));

app.use(notFound);
app.use(errorHandler);

setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`DevSwap backend running on port ${PORT}`);
});
