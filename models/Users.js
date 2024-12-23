// Importation de mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');

// Importation du plugin uniqueValidator pour assurer l'unicité des valeurs dans la base de données
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma pour les utilisateurs
const schemaUser = mongoose.Schema({
    email: { 
        type: String,  // Le type de données est une chaîne de caractères
        required: true, // Ce champ est obligatoire
        unique: true    // Ce champ doit être unique dans la base de données (pas de doublons pour l'email)
    },
    password: { 
        type: String,  // Le type de données est une chaîne de caractères
        required: true  // Ce champ est obligatoire
    }
});

// Application du plugin uniqueValidator au schéma
// Ce plugin permet de garantir l'unicité des valeurs pour les champs ayant l'option 'unique' définie
schemaUser.plugin(uniqueValidator);

// Exportation du modèle 'user' basé sur le schéma 'schemaUser'.
// Le modèle permet d'interagir avec la collection 'user' dans MongoDB.
module.exports = mongoose.model('user', schemaUser);
