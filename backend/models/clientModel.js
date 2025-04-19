const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du client est obligatoire'],
      trim: true,
    },
    prenom: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email du client est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Veuillez entrer une adresse email valide'],
    },
    telephone: {
      type: String,
      trim: true,
    },
    adresse: {
      rue: { type: String, trim: true },
      ville: { type: String, trim: true },
      codePostal: { type: String, trim: true },
      pays: { type: String, trim: true },
    },
    dateCreation: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
  }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;