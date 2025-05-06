const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware'); // Importez la fonction 'protect'

// Route pour récupérer le profil de l'utilisateur connecté (protégée par l'authentification)
router.get('/profile', protect, profileController.getProfile);

// Route pour mettre à jour le profil de l'utilisateur connecté (protégée par l'authentification)
router.put('/profile', protect, profileController.updateProfile); // Utilisez PUT pour une mise à jour complète ou PATCH pour une mise à jour partielle

module.exports = router;