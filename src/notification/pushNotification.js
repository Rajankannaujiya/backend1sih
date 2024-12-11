
import 'dotenv/config'
import { ethers } from 'ethers';
import { WebSocket, WebSocketServer } from 'ws';

const provider = new ethers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`);


const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.end("hi there");
});


const wss = new WebSocketServer({ server });
