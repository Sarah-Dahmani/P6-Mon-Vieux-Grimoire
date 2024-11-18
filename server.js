//import du package http de Node
const http = require('http');


//fonction appelée à chaque requête avec 2 paramètres
//req = requete et res = response
//utilisation de la méthode end pour renvoyer une réponse string
const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur');
});

//le serveur doit écouter/attendre les requêtes 
//méthode listen avec le numéro du port
//process.env.PORT est utilisé si le port 3000 n'est pas disponible
server.listen(process.env.PORT || 3000);