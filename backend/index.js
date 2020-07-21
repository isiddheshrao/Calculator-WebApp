const express = require('express');
const WebSocket = require('ws');
const app = express();
app.use(express.static("public"));
const { Server } = require('ws');
const path = require('path');
const { func } = require('prop-types');
const PORT = process.env.PORT || 5000;
const INDEX = path.join('./public/');
let data = []

const server = app.use((req,res) => res.sendFile(INDEX, {root: __dirname})).listen(PORT, () => console.log("Listening on PORT: " + PORT));
const wss = new Server({ server });

wss.on('connection', function connection(ws) {
    console.log("User Connected");
    ws.on('message', function incoming(data) {
        data.push(data);
        wss.clients.forEach(function each(client) {
            if(client !== ws && client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
});