const asyncHandler = require('express-async-handler');
const fetch = require('node-fetch');

// Remplacez par votre clé d'API Konnect et l'URL de base de l'API
const KONNECT_API_KEY = process.env.KONNECT_API_KEY;
const KONNECT_BASE_URL = 'https://api.konnect.network/v2'; // Exemple d'URL

// @desc    Initier une session de paiement avec Konnect
// @route   POST /api/payment/initiate
// @access  Private (nécessite l'authentification du client)
const initiatePayment = asyncHandler(async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
    return;
  }

  const { amount, currency = 'EUR', description = 'Paiement de commande' } = req.body;

  if (!amount || amount <= 0) {
    res.status(400).json({ message: 'Montant de paiement invalide.' });
    return;
  }

  try {
    const response = await fetch(`${KONNECT_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KONNECT_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        // Ajouter d'autres détails nécessaires à l'API Konnect (référence de commande, URL de retour, etc.)
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data); // Renvoyer la réponse de Konnect (ID de paiement, URL de redirection, etc.)
    } else {
      console.error('Erreur lors de l\'initiation du paiement avec Konnect:', data);
      res.status(400).json({ message: 'Erreur lors de l\'initiation du paiement.' });
    }
  } catch (error) {
    console.error('Erreur de communication avec l\'API Konnect:', error);
    res.status(500).json({ message: 'Erreur de communication avec le service de paiement.' });
  }
});

// @desc    Gérer le callback/webhook de Konnect après le paiement
// @route   POST /api/payment/callback
// @access  Public (Konnect appellera cette URL)
const handlePaymentCallback = asyncHandler(async (req, res) => {
  // Vérifier la signature de la requête pour s'assurer qu'elle provient bien de Konnect
  // (Consultez la documentation de Konnect pour savoir comment faire cela)

  const paymentData = req.body;
  console.log('Callback de paiement reçu de Konnect:', paymentData);

  // Mettre à jour le statut de la commande dans votre base de données en fonction des informations reçues
  // Vous devrez probablement vérifier le statut du paiement et potentiellement enregistrer l'ID de transaction Konnect.

  // Répondre à Konnect pour indiquer que la réception a réussi (code 2xx)
  res.status(200).send('Callback de paiement reçu');
});

module.exports = {
  initiatePayment,
  handlePaymentCallback,
};