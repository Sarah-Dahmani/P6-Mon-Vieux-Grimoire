// Importation des modules nécessaires
const sharp = require('sharp'); // Module pour la manipulation d'images, ici utilisé pour compresser et convertir l'image en WebP
const fs = require('fs');       // Module pour gérer les fichiers (ici utilisé pour supprimer l'ancienne image)
const path = require('path');   // Module pour manipuler les chemins de fichiers

// Fonction de compression et de conversion d'image
const compressImage = (req, res, next) => {
    // Si aucune image n'est présente dans la requête, on passe à l'étape suivante sans rien faire
    if (!req.file) { 
        return next(); 
    }

    // Extraire les informations nécessaires du fichier téléchargé
    const originalName = req.file.filename.split('.')[0]; // Nom du fichier sans l'extension
    const fullOriginalName = req.file.filename; // Nom complet du fichier original
    const originalPath = req.file.path; // Chemin du fichier original
    const ext = req.file.filename.split('.')[1]; // Extension du fichier original (ex: jpg, png)

    // Crée un nouveau nom pour le fichier de sortie, en utilisant le nom original + timestamp + l'extension .webp
    const outputName = originalName + Date.now() + '.webp'; 
    const outputPath = originalPath.replace(req.file.filename, outputName); // Nouveau chemin pour le fichier compressé

    // Utilisation de sharp pour compresser et convertir l'image en format WebP avec une qualité de 20
    sharp(originalPath)
        .webp({ quality: 20 }) // Compression avec une qualité de 20 (sur une échelle de 0 à 100)
        .toFile('backend/images/' + outputName) // Enregistrement du fichier converti dans le dossier 'backend/images'
        .then(() => {
            // Une fois l'image convertie, on désactive le cache de sharp pour éviter des problèmes de mémoire
            sharp.cache(false);

            // Mise à jour du chemin et du nom du fichier dans la requête pour utiliser le fichier compressé
            req.file.path = outputPath; // Nouveau chemin
            req.file.filename = outputName; // Nouveau nom de fichier

            // Suppression de l'image originale (en dehors du processus sharp)
           fs.unlink(path.join('backend/images/', fullOriginalName), (error) => {
                if (error) { 
                    return console.log(error); // Si une erreur se produit lors de la suppression du fichier, on l'affiche dans la console
                }
            });

            // Passe à l'étape suivante dans le middleware (par exemple, la sauvegarde dans la base de données)
            next();
        })
        .catch((error) => {
            // Si une erreur se produit lors du traitement de l'image, on passe l'erreur au middleware suivant
            return next(error);
        });
};

// Export de la fonction de compression
module.exports = compressImage;
