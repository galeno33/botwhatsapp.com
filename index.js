const { Client, LocalAuth } = require('node_modules/whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
require('node_modules/dotenv').config();

const app = express();
app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body.toLowerCase() === 'ping') {
        msg.reply('pong');
    }
});

client.initialize();

app.post('/send-message', (req, res) => {
    const { number, message } = req.body;
    client.sendMessage(`whatsapp:${number}`, message).then(response => {
        res.send({ success: true, response });
    }).catch(err => {
        res.status(500).send({ success: false, error: err.message });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
