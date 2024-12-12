
import 'dotenv/config'
import express from 'express';
import {WebSocket, WebSocketServer } from "ws";
import axios from 'axios';

const app = express();
const PORT = 8080;

// HTTP Server
const httpServer = app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ server: httpServer });
console.log("WebSocket server started...");

// Replace with your Etherscan API key and monitored Ethereum address
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API;
const ETH_ADDRESS ='0xe760cb4876Ece39Ae861233CedA0C0Ea0D87F2d6  '; // Address to monitor

let lastTransactionHash = ""; // Keep track of the last transaction hash

// Function to fetch transactions from Etherscan
async function fetchLatestTransactions(address) {
  const url = `https://api-sepolia.etherscan.io/api
?module=account
&action=txlist
&address=${address}
&startblock=0
&endblock=99999999
&page=1
&offset=5
&sort=desc
&apikey=${ETHERSCAN_API_KEY}`.replace(/\s+/g, "");

  try {
    const response = await axios.get(url);
    if (response.data.status === "1" && response.data.result.length > 0) {
      return response.data.result; // Return the latest transactions
    }
    return [];
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

// Broadcast new transactions
async function broadcastNewTransactions() {
  const transactions = await fetchLatestTransactions(ETH_ADDRESS);

  if (transactions.length > 0) {
    const latestTx = transactions[0]; // Get the most recent transaction

    // Check if it's a new transaction
    if (latestTx.hash !== lastTransactionHash) {
      lastTransactionHash = latestTx.hash; // Update the last hash

      // Broadcast to all connected clients
      const newTransaction = {
        hash: latestTx.hash,
        from: latestTx.from,
        to: latestTx.to,
        value: `${(latestTx.value / 1e18).toFixed(6)} ETH`,
        timeStamp: new Date(latestTx.timeStamp * 1000).toLocaleString(),
      };

      console.log("Broadcasting new transaction:", newTransaction);

      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(newTransaction));
        }
      });
    }
  }
}

// WebSocket Connection
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({ message: "Connected to Ethereum transaction updates!" }));

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Poll for transactions every 10 seconds
setInterval(broadcastNewTransactions, 500);

// HTTP Test Endpoint
app.get("/", (req, res) => {
  res.send("Ethereum Transaction Broadcast Server is running...");
});
