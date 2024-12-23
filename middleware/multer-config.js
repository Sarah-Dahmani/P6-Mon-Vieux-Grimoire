// Importation des modules nécessaires
const multer = require('multer'); // Multer est un middleware pour gérer les téléchargements de fichiers
const sharp = require('sharp');   // Sharp est un module pour la manipulation d'images (bien qu'il ne soit pas utilisé dans ce code, il pourrait être utilisé pour le redimensionnement ou la conversion d'images)

// Définition des types MIME autorisés et leurs extensions correspondantes
const MIMES_TYPES = {
    'image/jpg': 'jpg', // Type MIME pour l'image JPG
    'image/jpeg': 'jpg', // Type MIME pour l'image JPEG
    'image/png': 'png'   // Type MIME pour l'image PNG
}

// Configuration de l'emplacement et du nom du fichier pour le stockage des images
const storage = multer.diskStorage({
    // Spécifie le répertoire de destination pour les fichiers téléchargés
    destination: (req, file, callback) => {
        callback(null, 'backend/images/'); // L'image sera enregistrée dans le dossier 'backend/images/'
    },

    // Spécifie le nom du fichier à enregistrer
    filename: (req, file, callback) => {
        // On transforme le nom du fichier pour remplacer les espaces par des underscores et on enlève l'extension
        const name = (file.originalname.split(' ').join("_")).split('.')[0]; 
        
        // On obtient l'extension correspondant au type MIME du fichier
        const ext = MIMES_TYPES[file.mimetype]; 
        
        // On crée le nom final du fichier (nom + extension) et on le passe au callback
        callback(null, name + '.' + ext); // Exemple : "image_file.jpg"
    }
});

// Export du middleware Multer configuré
module.exports = multer({ storage: storage }).single('image'); 
// .single('image') spécifie que nous attendons un seul fichier avec le champ 'image' dans le formulaire
