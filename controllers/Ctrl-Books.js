// Importation du modèle Mongoose pour la collection des livres
const Books = require('../models/Books');
// Importation du module fs pour manipuler les fichiers (ex. suppression des images)
const fs = require('fs');
// Importation du module path pour gérer les chemins de fichiers
const path = require('path');

// Création d'un nouveau livre
exports.createBook = (req, res) => {
    // Conversion de la chaîne JSON contenant les informations du livre
    const bookObject = JSON.parse(req.body.book);

    // Suppression des champs `_id` et `_userId` pour éviter des modifications non autorisées
    delete bookObject._id;
    delete bookObject._userId;

    // Création d'un nouvel objet `Books` avec les données reçues et des informations supplémentaires
    const book = new Books({
        ...bookObject, // Fusionne les propriétés de `bookObject`
        userId: req.auth.userId, // Ajoute l'ID de l'utilisateur authentifié
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Génère l'URL de l'image
    });

    // Sauvegarde du livre dans la base de données
    book.save()
        .then(() => res.status(201).json({ message: 'Livre créé avec succès' }))
        .catch(error => res.status(400).json({ error })); // Gestion des erreurs
};


// Modification d'un livre existant
exports.modifyBook = (req, res) => {
    // Si une nouvelle image est envoyée, met à jour l'URL de l'image
    const bookData = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body // Sinon, utilise uniquement les données envoyées
    };

    // Suppression des champs `_id` et `_userId` pour éviter des modifications non autorisées
    delete bookData._id;
    delete bookData._userId;

    // Recherche du livre à modifier
    Books.findOne({ _id: req.params.id })
        .then(book => {
            // Vérifie que l'utilisateur authentifié est le propriétaire du livre
            if (book.userId !== req.auth.userId) {
                res.status(401).json({ message: "Vous n'êtes pas autorisé à faire cela!" });
            } else {
                // Supprime l'ancienne image si elle existe
                const oldImage = book.imageUrl.split('images/')[1];
                fs.unlink(path.join(__dirname, '..', 'images', oldImage), () => {});

                // Met à jour le livre avec les nouvelles données
                Books.updateOne({ _id: req.params.id }, { ...bookData, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié avec succès' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error })); // Livre introuvable
};

// Récupération d'un livre spécifique par son ID
exports.getBook = (req, res) => {
    Books.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book)) // Renvoie le livre trouvé
        .catch(error => res.status(404).json({ error })); // Livre introuvable
};

// Récupération de tous les livres
exports.getAllBooks = (req, res) => {
    Books.find()
        .then(book => res.status(200).json(book)) // Renvoie la liste des livres
        .catch(error => res.status(404).json({ error })); // Gestion des erreurs
};

// Suppression d'un livre
exports.deleteBook = (req, res) => {
    Books.findOne({ _id: req.params.id })
        .then(book => {
            // Vérifie que l'utilisateur est autorisé à supprimer le livre
            if (book.userId !== req.auth.userId) {
                res.status(401).json({ message: "Vous n'êtes pas autorisé à faire cela!" });
            } else {
                // Récupère le nom de l'image associée au livre
                const filename = book.imageUrl.split('/images/')[1];
                // Supprime l'image du système de fichiers
                fs.unlink(path.join(__dirname, '..', 'images', filename), () => {
                    // Supprime le livre de la base de données
                    Books.deleteOne({ _id: req.params.id })
                        .then(() => res.status(204).json({ message: 'Livre supprimé avec succès !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(404).json({ error })); // Livre introuvable
};

// Récupération des 3 livres les mieux notés
exports.mostratedBooks = (req, res) => {
    Books.find().limit(3).sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Ajout d'une note à un livre
exports.addRate = (req, res, next) => {
    const userId = req.body.userId || null; // Récupère l'ID de l'utilisateur
    const rate = req.body.rating; // Note donnée

    Books.findOne({ _id: req.params.id })
        .then(book => {
            // Vérifie que l'utilisateur est authentifié
            if (!req.auth.userId) {
                res.status(401).json({ message: "Vous n'êtes pas autorisé à faire cela!" });
            } else {
                // Vérifie si l'utilisateur a déjà noté le livre
                const alreadyRated = book.ratings.find(data => data.userId === userId);
                if (alreadyRated) {
                    return res.status(400).json({ error: 'Vous avez déjà noté ce livre' });
                }

                // Ajoute la note à la liste des notes
                book.ratings.push({ userId, grade: rate });

                // Calcule la nouvelle moyenne des notes
                const sumGrade = book.ratings.reduce((sum, data) => sum + data.grade, 0);
                book.averageRating = sumGrade / book.ratings.length;

                // Sauvegarde le livre mis à jour
                return book.save()
                    .then(updatedBook => res.status(200).json(updatedBook))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error })); // Livre introuvable
};