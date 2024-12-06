const multer = require('multer'); //package pour la gestion des fichiers entrants

const MIME_TYPES ={
'image/jpg': 'jpg',
'image/jpeg': 'jpg',
'image/png': 'png',
'image/webp' : 'webp'
}

//objet de configuration de multer
//diskStorage : enregistrement sur le disque
//besoin de 2 éléments
//destination : dans quel dossier enregistrer les fichiers > 3 arguments (null = pas d'erreur/ images = nom du dossier)
//filename pour transformer les noms de fichiers et éviter les erreurs dans la base de données
//const extension pour générer un mimetype
//callback pour créer le filename en entier > name créé plus tôt + timestamp + '.' + extension du fichier
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'tmp')
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        let name = Buffer.from(file.originalname, 'latin1').toString('utf8').split(' ').join('_').toLowerCase();
        name = name.replace("." + extension, '');
        callback(null, name + Date.now() + '.' + extension)

    }
});

//appel de multer dans lequel on passe l'objet storage
//méthode .single car c'est un fichier unique
//fichier image uniquement

module.exports = multer({storage}).single('image');