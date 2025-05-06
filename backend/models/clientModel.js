// backend/models/clientModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    prenom: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Veuillez entrer un email valide'],
    },
    telephone: {
      type: String,
      trim: true,
    },
    adresse: {
      rue: String,
      ville: String,
      codePostal: String,
      pays: String,
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: 6,
      select: false, // Ne pas retourner le mot de passe par défaut lors des requêtes
    },
  },
  {
    timestamps: true,
  }
);

// Middleware pour hasher le mot de passe avant de sauvegarder
clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer le mot de passe entré avec le mot de passe hashé
clientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;