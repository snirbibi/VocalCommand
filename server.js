const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const command = req.body.queryResult.intent.displayName;

  if (command === 'Allume_LED') {
    // Appeler Adafruit IO pour envoyer la commande "ON" à l'ESP
    sendCommandToAdafruitIO('ON');
    res.json({ fulfillmentText: 'La LED est allumée.' });
  } else if (command === 'Eteins_LED') {
    sendCommandToAdafruitIO('OFF');
    res.json({ fulfillmentText: 'La LED est éteinte.' });
  }
});

function sendCommandToAdafruitIO(command) {
  // Envoyer la commande à Adafruit IO via HTTP ou MQTT
  // Utilisez les APIs ou le MQTT d'Adafruit IO
}

app.listen(3000, () => {
  console.log('Serveur webhook démarré sur le port 3000');
});
