const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc     Enregistrer un nouveau client pour le site e-commerce
// @route    POST /api/auth/register
// @access   Public
const registerClient = asyncHandler(async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    console.log('REGISTER - Requête reçue:', { nom, prenom, email, password });

    const clientExists = await Client.findOne({ email });
    console.log('REGISTER - Client exists:', clientExists);

    if (clientExists) {
        console.log('REGISTER - Client existe déjà, statut 400 envoyé.');
        return res.status(400).json({ message: 'Client avec cet email existe déjà' });
    }

    try {
        const client = await Client.create({
            nom,
            prenom,
            email,
            password,
            adresse: {}, // Adresse peut être ajoutée plus tard dans le profil
        });
        console.log('REGISTER - Client créé:', client);

        if (client) {
            const token = generateToken(client._id);
            const responseData = {
                _id: client._id,
                nom: client.nom,
                prenom: client.prenom,
                email: client.email,
                token: token,
            };
            console.log('REGISTER - Succès, statut 201 envoyé:', responseData);
            res.status(201).json(responseData);
        } else {
            console.log('REGISTER - Erreur lors de la création, statut 400 envoyé.');
            res.status(400).json({ message: 'Erreur lors de l\'enregistrement' });
        }
    } catch (error) {
        console.error('REGISTER - Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement' });
    }
});

// @desc     Authentifier un client et obtenir un token
// @route    POST /api/auth/login
// @access   Public
const loginClient = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('LOGIN - Requête reçue:', { email, password });

    const client = await Client.findOne({ email }).select('+password');
    console.log('LOGIN - Client trouvé:', client);

    if (client) {
        const isMatch = await client.matchPassword(password);
        console.log('LOGIN - Correspondance du mot de passe:', isMatch);
        if (isMatch) {
            const token = generateToken(client._id);
            const responseData = {
                _id: client._id,
                nom: client.nom,
                prenom: client.prenom,
                email: client.email,
                token: token,
            };
            console.log('LOGIN - Succès, statut 200 envoyé:', responseData);
            res.json(responseData);
        } else {
            console.log('LOGIN - Mot de passe invalide, statut 401 envoyé.');
            res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }
    } else {
        console.log('LOGIN - Email invalide, statut 401 envoyé.');
        res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
});

module.exports = {
    registerClient,
    loginClient,
};