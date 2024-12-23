// Importation d'Express pour la gestion des routes
const express = require('express');
// Création d'un routeur Express pour gérer les routes de l'application
const router = express.Router();

// Importation des contrôleurs pour chaque route associée aux livres
const {createBook, modifyBook, getBook, getAllBooks, deleteBook, mostratedBooks, addRate} = require('../controllers/Ctrl-Books');

// Importation du middleware d'authentification pour sécuriser certaines routes
const auth = require('../middleware/auth');

// Importation du middleware Multer pour la gestion des fichiers (téléchargement d'images)
const multer = require('../middleware/multer-config');

// Importation du middleware pour la compression des images avant de les sauvegarder
const compressImage = require('../middleware/sharp-config');

router.post('/upload', multer, compressImage, (req, res) => {
    res.status(200).json({ message: 'Image ajoutée avec succès', file: req.file });
});

// Route pour créer un livre dans la collection Books
// Utilise les middlewares auth (authentification), multer (gestion des fichiers), compressImage (compression des images)
router.post('/', auth, multer, compressImage, createBook);

// Route pour modifier un livre existant dans la collection Books avec un ID spécifique
// Utilise les middlewares auth, multer et compressImage pour vérifier l'authentification, gérer les fichiers et compresser les images
router.put('/:id', auth, multer, compressImage, modifyBook);

// Route pour récupérer les livres les mieux notés (triés selon la note moyenne)
router.get('/bestrating/', mostratedBooks);

// Route pour récupérer un livre spécifique par son ID
router.get('/:id', getBook);

// Route pour ajouter une note (rating) à un livre
// L'authentification est requise avant de pouvoir ajouter une note
router.post('/:id/rating', auth, addRate);

// Route pour récupérer tous les livres de la collection Books
router.get('/', getAllBooks);

// Route pour supprimer un livre de la collection Books par son ID
// L'authentification est requise avant de pouvoir supprimer un livre
router.delete('/:id', auth, deleteBook);

// Exportation du routeur pour l'utiliser dans l'application Express
module.exports = router;
