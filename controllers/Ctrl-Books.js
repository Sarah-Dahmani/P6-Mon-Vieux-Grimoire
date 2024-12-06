const Book = require('../models/Books');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); //package pour optimiser les images

//renvoie un tableau de tous les éléments du modèle Books
exports.getAllBook = (req, res, next) => {
    Book.find()
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(400).json({ error }));
  };

  //renvoie un élément avec l'id fourni
  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(400).json({ error }));
  };

  //suppression de _id dans le req.body car l'id des éléments sera généré par MongoDB
//suppresion de _userId pour le remplacer par celui extrait du token et éviter les les actes malveillants
//création d'une const book qui reprend le modèle Books en lui passant les infos requises dans le body
//utilisation de SPREAD "..." pour faire une copie de tous les éléments de req.body
//complétion de l'URL : utilisation de req.protocol > obtention du premier segment de l'URL
//la méthode .save renvoie une promise
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    if (req.file) { 

        const inputPath = path.join(__dirname, "../tmp/", req.file.filename);
        const outputPath = path.join(__dirname, "../images/", req.file.filename);

        sharp(inputPath)
        .toFormat('webp')
        .webp({quality: 80})
        .toFile(outputPath)
        .then( (outputInfo) => {
            fs.unlink(inputPath, (error) => {
                console.log(error);
            })
        });
    }

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
   book.save()
    .then(() => {
        res.status(201).json({ message: 'Livre enregistré' });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de l\'optimisation de l\'image :', error);
            res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'optimisation de l\'image.' });
        });
    };

/*  exports.ratingBook = (req, res, next) => {
            Book.findOne({_id: req.params.id})
            .then( book => {
                if (book.userId != req.auth.userId) {
                    res.status(401).json({message: 'Not authorized'});
                } else {
                }
            })
        }*/

  //vérification que c'est le créateur qui souhaite supprimer l'objet
//récupération de l'url du fichier grâce à un split autour du répertoire image
//méthode unlink de fs importé plus haut avec le chemin
//gestion du callback pour créer une méthode qui sera appelée après la suppression (asynchrone)
//route de suppression avec l'id dans le path
//méthode .deleteOne qui prend l'id en paramètres
    exports.deleteBook = (req, res, next) => {
        Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
    };
    
  //vérification qu'il existe un champ file, si c'est le cas on récupère en parsant la chaîne de caractère
  //recréation de l'URL de l'image
  //s'il n'y a pas d'objet transmis > récup directement dans le corps de la requête
  //suppression de l'userId par mesure de sécurité
  //recherche dans la base de données pour vérifier que c'est le créateur de l'objet qui souhaite le modifier
  //recherche par id
  //méthode updateOne pour mettre à jour/modifier
  //1er argument c'est l'objet que l'on modifie : id dans les paramètres de requête
  //2eme argument c'est la nouvelle version de l'objet en faisant correspondre les id
  exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });  
    };