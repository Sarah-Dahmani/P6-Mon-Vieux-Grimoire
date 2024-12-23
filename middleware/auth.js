// Importation de la bibliothèque jsonwebtoken pour manipuler les JSON Web Tokens (JWT).
const jwt = require("jsonwebtoken");

// Exportation d'un middleware pour valider les tokens JWT sur les requêtes entrantes.
module.exports = (req, res, next) => {
    try {
        // Extraction du token depuis l'en-tête Authorization.
        // L'en-tête est souvent sous la forme : "Bearer <TOKEN>".
        const token = req.headers.authorization.split(' ')[1];

        // Vérification de la validité du token avec la clé secrète utilisée pour le signer.
        // Si le token est invalide ou expiré, une exception sera levée.
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');

        // Extraction de l'ID utilisateur (userId) contenu dans le payload du token.
        const userId = decodedToken.userId;

        // Ajout des informations d'authentification à l'objet de la requête (`req`).
        // Cela permet de rendre le userId accessible aux middlewares ou contrôleurs suivants.
        req.auth = {
            userId: userId
        };

        // Appel de la fonction next() pour passer au middleware ou contrôleur suivant.
        next();
    } catch (error) {
        // En cas d'erreur (token manquant, invalide, ou problème de décodage), 
        // renvoi d'une réponse avec le statut 401 (Unauthorized).
        res.status(401).json({ error });
    }
};
