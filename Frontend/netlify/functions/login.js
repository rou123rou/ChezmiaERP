const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Assurez-vous d'avoir bcryptjs dans les dépendances de votre frontend

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;
const jwtSecret = process.env.JWT_SECRET;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }), headers: { 'Allow': 'POST' } };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Veuillez fournir l\'email et le mot de passe.' }) };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const clientsCollection = db.collection('clients');

    const clientData = await clientsCollection.findOne({ email });

    if (clientData && await bcrypt.compare(password, clientData.password)) {
      const token = jwt.sign({ id: clientData._id }, jwtSecret, { expiresIn: '30d' });
      const responseData = {
        _id: clientData._id,
        nom: clientData.nom,
        prenom: clientData.prenom,
        email: clientData.email,
        token,
      };
      return {
        statusCode: 200,
        body: JSON.stringify(responseData),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://chezmia.netlify.app',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    } else {
      return { statusCode: 401, body: JSON.stringify({ message: 'Email ou mot de passe invalide.' }) };
    }

  } catch (error) {
    console.error('LOGIN FUNCTION ERROR:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Erreur serveur lors de la connexion.' }) };
  } finally {
    await client.close();
  }
};