const Client = require('../models/clientModel'); // Ajustez le chemin vers votre modèle Client si nécessaire
const asyncHandler = require('express-async-handler');
const getProfile = async (req, res) => {
    try {
        // L'ID de l'utilisateur connecté est stocké dans req.session.user.id par votre middleware
        const clientId = req.session.user.id;

        const client = await Client.findById(clientId).select('-password');

        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil.' });
    }
};

const updateProfile = asyncHandler(async (req, res) => {
    try {
        const clientId = req.session.user.id;
        const { nom, prenom, email } = req.body; // Récupérez les champs à mettre à jour depuis le corps de la requête

        const client = await Client.findByIdAndUpdate(
            clientId,
            { nom, prenom, email }, // Ajoutez d'autres champs que l'utilisateur peut modifier
            { new: true, runValidators: true } // `new: true` retourne le document mis à jour, `runValidators` exécute les validations du schéma
        ).select('-password');

        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil.' });
    }
});

module.exports = {
    getProfile,
    updateProfile, // N'oubliez pas d'exporter la nouvelle fonction
};