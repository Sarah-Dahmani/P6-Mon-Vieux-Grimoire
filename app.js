// Importation d'Express pour la création de l'application et la gestion des routes
const express = require('express');
// Création d'une instance de l'application Express
const app = express();

// Importation de Mongoose pour la gestion de la connexion à la base de données MongoDB
const mongoose = require('mongoose');

// Importation des routes liées aux livres et à l'authentification des utilisateurs
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

// Importation du module path pour gérer les chemins de fichiers
const path = require('path');

// Connexion à la base de données MongoDB avec Mongoose
// La chaîne de connexion contient les informations nécessaires pour accéder à la base de données.
mongoose.connect("mongodb+srv://saaraahdahmani:Fvz_86dzuRPdXF7@cluster0.wplqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('Connexion à MongoDB réussie !')) // Message de succès si la connexion est réussie
  .catch((error) => console.log('Connexion à MongoDB échouée ! ' + error)); // Message d'erreur si la connexion échoue

// Middleware pour analyser les corps des requêtes JSON et les rendre accessibles dans req.body
app.use(express.json());

// Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing)
// Ceci permet à l'application d'accepter des requêtes depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // Permet l'accès depuis toutes les origines
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization') // Permet certains en-têtes dans les requêtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS') // Permet certains types de requêtes HTTP
    next(); // Passe à la prochaine fonction middleware
});

// Définition des routes pour les livres et les utilisateurs
// Les routes pour les livres sont gérées par le fichier booksRoutes
app.use('/api/books', booksRoutes); // Toutes les requêtes sous "/api/books" seront gérées par booksRoutes
app.use('/api/auth', userRoutes); // Toutes les requêtes sous "/api/auth" seront gérées par userRoutes

// Configuration pour servir des fichiers statiques dans le dossier '/images'
// Par exemple, les images téléchargées seront accessibles via '/images/nom-de-l-image'
app.use('/images', express.static(path.join(__dirname,'/images')));

// Exportation de l'application Express pour l'utiliser dans d'autres fichiers, comme le serveur principal
module.exports = app;