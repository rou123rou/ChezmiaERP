const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/order.routes');

connectDB(); // Se connecter à la base de données

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Activer CORS pour les requêtes frontend
app.use(express.json()); // Pour que l'application puisse lire le JSON dans les requêtes

app.use('/api/clients', clientRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, console.log(`🚀 Serveur lancé sur le port ${process.env.NODE_ENV} mode on port ${PORT}`));