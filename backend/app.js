// backend/app.js
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/order.routes');
const session = require('express-session');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://chezmia.netlify.app', // URL EXACTE de votre frontend Netlify
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-fallback-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const profileRoute = require('./routes/profileRoute');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/clients', clientRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', profileRoute);
app.use('/api/contact', contactRoutes);

// AJOUTEZ CETTE ROUTE DE TEST
app.get('/', (req, res) => {
    res.send('Le backend Chez Mia est en ligne !');
});

app.listen(PORT, console.log(`🚀 Serveur lancé en mode ${process.env.NODE_ENV} sur le port ${PORT}`));