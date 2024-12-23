// Importation de mongoose pour travailler avec MongoDB
const mongoose = require('mongoose');

// Définition du schéma pour les évaluations des livres (les notes données par les utilisateurs)
const schemaRating = mongoose.Schema({
    userId: { type: String, required: true }, // ID de l'utilisateur qui a attribué la note
    grade: { type: Number, required: true }   // Note (grade) donnée par l'utilisateur (attendue en nombre)
});

// Définition du schéma principal pour les livres
const schemaBooks = mongoose.Schema({
    userId: { type: String, required: true }, // ID de l'utilisateur ayant créé ou ajouté le livre
    title: { type: String, required: true },  // Titre du livre
    author: { type: String, required: true }, // Auteur du livre
    year: { type: Number, required: true },   // Année de publication du livre
    imageUrl: { type: String, required: true }, // URL de l'image associée au livre (ex: couverture du livre)
    genre: { type: String, required: true },  // Genre du livre (ex: fiction, non-fiction, etc.)
    ratings: [schemaRating], // Tableau contenant toutes les évaluations du livre, utilisant le sous-schéma 'schemaRating'
    averageRating: { type: Number, required: false } // Moyenne des notes du livre, non obligatoire (peut être calculée après que des évaluations aient été ajoutées)
});

// Exportation du modèle 'books', associé au schéma 'schemaBooks', pour pouvoir interagir avec la collection "books" dans la base de données MongoDB
module.exports = mongoose.model('books', schemaBooks);
