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

  const { nom, prenom, email, password } = JSON.parse(event.body);

  if (!nom || !prenom || !email || !password) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Veuillez remplir tous les champs.' }) };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const clientsCollection = db.collection('clients');

    const clientExists = await clientsCollection.findOne({ email });
    if (clientExists) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Client avec cet email existe déjà.' }) };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newClient = {
      nom,
      prenom,
      email,
      password: hashedPassword,
      adresse: {}
    };

    const result = await clientsCollection.insertOne(newClient);

    if (result.insertedId) {
      const token = jwt.sign({ id: result.insertedId }, jwtSecret, { expiresIn: '30d' });
      const responseData = {
        _id: result.insertedId,
        nom,
        prenom,
        email,
        token,
      };
      return {
        statusCode: 201,
        body: JSON.stringify(responseData),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://chezmia.netlify.app',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    } else {
      return { statusCode: 400, body: JSON.stringify({ message: 'Erreur lors de l\'enregistrement.' }) };
    }

  } catch (error) {
    console.error('REGISTER FUNCTION ERROR:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Erreur serveur lors de l\'enregistrement.' }) };
  } finally {
    await client.close();
  }
};