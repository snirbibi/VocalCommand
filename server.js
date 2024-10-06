const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route pour gérer le webhook de Google Assistant
app.post('/webhook', (req, res) => {
  const command = req.body.queryResult.intent.displayName;

  if (command === 'incendie') {
    // Appeler Adafruit IO pour envoyer la commande "ON" à l'ESP
    sendCommandToAdafruitIO('ON');
    res.json({ fulfillmentText: 'La LED est allumée.' });
  } else if (command === 'arret incendie') {
    // Appeler Adafruit IO pour envoyer la commande "OFF" à l'ESP
    sendCommandToAdafruitIO('OFF');
    res.json({ fulfillmentText: 'La LED est éteinte.' });
  } else {
    res.json({ fulfillmentText: 'Commande non reconnue.' });
  }
});

// Fonction pour envoyer la commande à Adafruit IO
function sendCommandToAdafruitIO(command) {
  const url = 'https://io.adafruit.com/api/v2/snir/feeds/:alarmeincendie'; // Remplacer YOUR_USERNAME
  //const key = 'aio_XFME63XWrOyvXCLr09ooiFScugVk'; // Remplacer YOUR_AIO_KEY
  const key = process.env.AIO_KEY; // Récupération de la clé à partir de l'environnement

  axios.post(url, {
    value: command,
  }, {
    headers: { 'X-AIO-Key': key }
  })
  .then(response => {
    console.log(`Commande envoyée à Adafruit IO: ${command}`);
  })
  .catch(error => {
    console.error('Erreur lors de l\'envoi à Adafruit IO:', error);
  });
}

// Lancer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur webhook démarré sur le port 3000');
});
