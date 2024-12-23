// Importation d'Express pour la gestion des routes
const express = require('express');
// Création d'un routeur Express pour gérer les routes liées à l'authentification des utilisateurs
const router = express.Router();

// Importation des contrôleurs pour l'authentification des utilisateurs (inscription et connexion)
const ctrlAuth = require('../controllers/Ctrl-Users');

// Route pour l'inscription d'un nouvel utilisateur
// Cette route utilise la méthode signupUser du contrôleur Ctrl-Users pour gérer la création d'un nouvel utilisateur
router.post('/signup', ctrlAuth.signupUser);

// Route pour la connexion d'un utilisateur existant
// Cette route utilise la méthode loginUser du contrôleur Ctrl-Users pour gérer la connexion d'un utilisateur
router.post('/login', ctrlAuth.loginUser);

// Exportation du routeur pour l'utiliser dans l'application principale Express
module.exports = router;
