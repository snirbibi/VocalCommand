const express = require('express');
const axios = require('axios');
require('dotenv').config();  // Si vous souhaitez utiliser des variables d'environnement

const app = express();
app.use(express.json());

// URL de votre webhook sur Adafruit IO
const AIO_KEY     = process.env.AIO_KEY;  // Utilisation de la clé d'API depuis les variables d'environnement
const WEBHOOK_URL = 'https://io.adafruit.com/api/v2/webhooks/feed/6F41S2DuMD2xh93q1oN37xbHioU7/raw'; 
const AIO_USERNAME= 'snir';
const TOPIC       = '${AIO_USERNAME}/feeds/alarmeincendie';

// Connexion au serveur MQTT d'Adafruit IO
const client = mqtt.connect(`mqtts://${AIO_USERNAME}:${AIO_KEY}@io.adafruit.com`);


app.post('/webhook', (req, res) => {
  const command = req.body.queryResult.intent.displayName;

  if (command === 'incendie') {
    sendCommandToAdafruitIO('ON');
    res.json({ fulfillmentText: 'La LED est allumée.' });
  } else if (command === 'arret incendie') {
    sendCommandToAdafruitIO('OFF');
    res.json({ fulfillmentText: 'La LED est éteinte.' });
  }
});

// Envoyer des commandes "ON" ou "OFF" via MQTT
function sendCommandToAdafruitIO(value) {
  client.publish(TOPIC, value, (error) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de la commande:', error);
    } else {
      console.log('Commande envoyée avec succès:', value);
    }
  });
}

/*
async function sendCommandToAdafruitIO(value) {
  try {
    const response = await axios.post(WEBHOOK_URL, value, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    console.log('Commande envoyée avec succès:', response.data);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la commande:', error.response?.data || error.message);
  }
}*/

// envoi "ON" ou "OFF"
/*async function sendCommandToAdafruitIO(value) {
  try {
    const response = await axios.post(WEBHOOK_URL, `value=${value}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Commande envoyée avec succès:', response.data);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la commande:', error.response?.data || error.message);
  }
}*/


app.listen(3000, () => {
  console.log('Serveur webhook démarré sur le port 3000');
});
