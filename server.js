// Importation du module http de Node.js pour créer un serveur HTTP
const http = require('http');

// Importation de l'application Express définie dans 'app.js'
const app = require('./app');

// Fonction pour normaliser le port (convertir en nombre si nécessaire)
const normalizePort = val => {
  // Conversion de la valeur du port en entier (base 10)
  const port = parseInt(val, 10);

  // Si la conversion échoue, retourner la valeur d'origine
  if (isNaN(port)) {
    return val;
  }
  // Si le port est un nombre positif ou nul, on le retourne
  if (port >= 0) {
    return port;
  }
  // Si le port est un nombre négatif, on retourne false
  return false;
};

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestion des erreurs pour le serveur
const errorHandler = error => {
  // Si l'erreur n'est pas liée à une tentative d'écoute du serveur, on la relance
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  // Récupération de l'adresse du serveur (nom ou port)
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  // Gestion des différents types d'erreurs de serveur
  switch (error.code) {
    case 'EACCES':
      // Si l'erreur est un manque de privilèges, afficher un message d'erreur et quitter
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // Si l'adresse (port) est déjà utilisée, afficher un message d'erreur et quitter
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      // Autres erreurs : relancer l'erreur
      throw error;
  }
};

// Création d'un serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestion de l'événement 'error' pour traiter les erreurs du serveur
server.on('error', errorHandler);

// Gestion de l'événement 'listening' pour afficher un message lorsque le serveur commence à écouter
server.on('listening', () => {
  // Récupération de l'adresse du serveur et création d'un message de log
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Affiche le port ou le pipe utilisé pour écouter
});

// Démarrage du serveur HTTP pour écouter sur le port spécifié
server.listen(port, '0.0.0.0');


