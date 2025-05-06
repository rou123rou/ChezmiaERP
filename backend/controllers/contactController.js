// backend/controllers/contactController.js
const nodemailer = require('nodemailer');

// Configuration de Nodemailer (à adapter avec vos informations)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Utilisez des variables d'environnement
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.CONTACT_EMAIL, // Utilisez une variable d'environnement pour l'e-mail de contact
        subject: `Nouveau message de contact: ${subject || 'Sans sujet'}`,
        html: `<p>Nom: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'E-mail envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail' });
    }
};