
const Client = require('../models/clientModel');
const asyncHandler = require('express-async-handler');

// @desc    Récupérer tous les clients
// @route   GET /api/clients
// @access  Public (pour l'instant, nous ajusterons l'accès plus tard)
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({});
  res.status(200).json(clients);
});

// @desc    Récupérer un client par ID
// @route   GET /api/clients/:id
// @access  Public
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (client) {
    res.status(200).json(client);
  } else {
    res.status(404).json({ message: 'Client non trouvé' });
  }
});

// @desc    Créer un nouveau client
// @route   POST /api/clients
// @access  Public
const createClient = asyncHandler(async (req, res) => {
  const { nom, prenom, email, telephone, adresse } = req.body;

  const clientExists = await Client.findOne({ email });

  if (clientExists) {
    res.status(400).json({ message: 'Client avec cet email existe déjà' });
  }

  const client = await Client.create({
    nom,
    prenom,
    email,
    telephone,
    adresse,
  });

  if (client) {
    res.status(201).json({
      _id: client._id,
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
    });
  } else {
    res.status(400).json({ message: 'Erreur lors de la création du client' });
  }
});

// @desc    Mettre à jour un client
// @route   PUT /api/clients/:id
// @access  Public
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (client) {
    client.nom = req.body.nom || client.nom;
    client.prenom = req.body.prenom || client.prenom;
    client.email = req.body.email || client.email;
    client.telephone = req.body.telephone || client.telephone;
    client.adresse = req.body.adresse || client.adresse;

    const updatedClient = await client.save();
    res.status(200).json({
      _id: updatedClient._id,
      nom: updatedClient.nom,
      prenom: updatedClient.prenom,
      email: updatedClient.email,
      telephone: updatedClient.telephone,
      adresse: updatedClient.adresse,
    });
  } else {
    res.status(404).json({ message: 'Client non trouvé' });
  }
});

// @desc    Supprimer un client
// @route   DELETE /api/clients/:id
// @access  Private
// @desc    Supprimer un client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = asyncHandler(async (req, res) => {
    const client = await Client.findById(req.params.id);
  
    if (!client) {
      res.status(404);
      throw new Error('Client non trouvé');
    }
  
    await Client.deleteOne({ _id: req.params.id }); // Utiliser deleteOne pour supprimer
  
    res.status(200).json({ message: 'Client supprimé avec succès' });
  });

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};