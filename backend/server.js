require('dotenv').config();
// console.log(process.env);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//MiddleWare
app.use(cors());
app.use(express.json());

//Database Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('MongoDB URI:', mongoURI.replace(/<password>.*@/, '***@')); // Hide password in logs
});

// Routes
// const reserveRoutes = require('./routes/reserveRoutes');
// const expenseRoutes = require('./routes/expenseRoutes');

// app.use('/api/reserves', reserveRoutes);
// app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));