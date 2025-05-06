// backend/app.js
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/order.routes');
const session = require('express-session'); // Importez express-session

connectDB(); // Se connecter à la base de données

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Autorise toutes les origines (À UTILISER AVEC PRUDENCE EN PRODUCTION !)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si vous gérez des cookies ou des en-têtes d'autorisation
})); // MODIFICATION ICI

app.use(express.json()); // Pour que l'application puisse lire le JSON dans les requêtes

// Configuration de express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-fallback-key', // Clé secrète, utilisez une vraie en production
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // `true` en production pour HTTPS
        httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
        maxAge: 30 * 24 * 60 * 60 * 1000 // Durée de vie du cookie (30 jours)
    }




})

)
app.get('/', (req, res) => {
    res.send('API Chez Mia ERP est opérationnelle !');
  });
;

// Ajout des nouvelles routes pour l'e-commerce
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const profileRoute = require('./routes/profileRoute'); // Importez le routeur de profil (correction du nom)
const contactRoutes = require('./routes/contactRoutes'); // Importez le routeur de contact

app.use('/api/clients', clientRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', profileRoute); // Montez le routeur de profil sous /api (correction du nom)
app.use('/api/contact', contactRoutes); // Utilisez les routes de contact sous /api/contact

app.listen(PORT, console.log(`🚀 Serveur lancé en mode ${process.env.NODE_ENV} sur le port ${PORT}`));