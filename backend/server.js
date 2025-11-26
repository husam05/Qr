const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*' // Allow all in dev, restrict in prod
}));
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/admin', require('./routes/admin'));
app.use('/', require('./routes/public')); // Root for public redirects and profile API

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
