// Importation des modules nécessaires
const bcrypt = require('bcrypt'); // Module pour hacher et comparer les mots de passe
const jwt = require('jsonwebtoken'); // Module pour créer et vérifier des tokens JWT
const user = require('../models/Users'); // Modèle Mongoose pour la collection des utilisateurs

// Fonction pour l'inscription d'un utilisateur
exports.signupUser = (req, res) => {
    // Hachage du mot de passe reçu dans la requête avec un "salt" de 10 tours
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            // Création d'une nouvelle instance de l'utilisateur avec l'email et le mot de passe haché
            const userData = new user({
                email: req.body.email, // Email reçu dans la requête
                password: hash // Stockage du mot de passe sous forme hachée pour plus de sécurité
            });
            
            // Sauvegarde de l'utilisateur dans la base de données
            userData.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès' })) // Envoi d'une réponse de succès
                .catch(error => res.status(400).json({ error })); // Gestion des erreurs lors de la sauvegarde
        })
        .catch(error => res.status(500).json({ error })); // Gestion des erreurs lors du hachage du mot de passe
};

// Fonction pour la connexion d'un utilisateur
exports.loginUser = (req, res) => {
    // Recherche d'un utilisateur par son email dans la base de données
    user.findOne({ email: req.body.email })
        .then(userData => {
            if (userData === null) { // Si aucun utilisateur n'est trouvé
                res.status(401).json({ message: 'identifiant/mot de passe incorrect' });
            } else {
                // Comparaison du mot de passe saisi avec le mot de passe haché stocké
                bcrypt.compare(req.body.password, userData.password)
                    .then(valid => {
                        if (!valid) { // Si le mot de passe est incorrect
                            res.status(401).json({ message: 'identifiant/mot de passe incorrect' });
                        } else {
                            // Si le mot de passe est correct, génération d'un token JWT
                            res.status(200).json({
                                userId: userData._id, // ID de l'utilisateur pour référence future
                                token: jwt.sign(
                                    { userId: userData._id }, // Payload du token contenant l'ID de l'utilisateur
                                    'RANDOM_SECRET_TOKEN', // Clé secrète pour signer le token
                                    { expiresIn: '24h' } // Durée de validité du token (ici 24 heures)
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error })); // Gestion des erreurs lors de la comparaison des mots de passe
            }
        })
        .catch(error => res.status(500).json({ error })); // Gestion des erreurs lors de la recherche de l'utilisateur
};