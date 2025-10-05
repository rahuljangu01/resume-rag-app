// backend/src/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db.js');
const { initPinecone } = require('./config/pinecone.js');
const { initializeModels } = require('./services/openai.service.js'); // 1. Import the new function

const { errorHandler } = require('./middlewares/error.middleware.js');
const apiLimiter = require('./middlewares/rateLimiter.middleware.js');
const idempotencyCheck = require('./middlewares/idempotency.middleware.js');

const authRoutes = require('./routes/auth.routes.js');
const resumeRoutes = require('./routes/resume.routes.js');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/', apiLimiter);
app.use(idempotencyCheck);

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// 2. Create a new async function to start the server
const startServer = async () => {
    try {
        await connectDB();
        initPinecone();
        await initializeModels(); // 3. Load the AI models BEFORE starting the server

        app.listen(PORT, () => {
            console.log(`--- SERVER IS LIVE AND READY on port ${PORT} ---`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

// 4. Call the function
startServer();