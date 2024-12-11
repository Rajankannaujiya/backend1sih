import "dotenv/config";
import { Router } from "express";
import axios from "axios";
import Web3 from 'web3';
import { JSONTOCSV } from '../jsonToCsv/jsonToCsv.js'
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { IDENTIFYBLOCKCHAIN } from "../identifyBlockchain/indentifyBlockchain.js";
import { checkMultiChain, isWalletAddress } from "../zod/type.js";

const router = Router();


// const walletAddress = '0xc436eb8aed128275c8f224de2f1dd202c0ab5830';

// const provider = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;

// const web3 = new Web3(provider)
async function getHistoryOfEthereum(address) {
  const apiKey = process.env.ETHERSCAN_API;
  try {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    const response = await axios.get(url);

    if (response.data.status === '1') {
        return response.data.result; // Array of transactions
    } else {
        console.error('Error fetching transaction history:', response.data.message);
        return [];
    }
}
catch(error){
    console.log(error.message);
    return [];
}
}

async function getHistoryOfBitcoin(address) {
  const response = await axios.get(
    `https://blockchain.info/rawaddr/${address}`
  );
  console.log("Bitcoin Transaction History:", response.data);
  return response.data;
}

async function getHistoryOfCardano(address) {
  const response = await axios.get(
    `https://api.cardano.org/addresses/${address}`
  );
  console.log("Cardano Transaction History:", response.data);
  return response.data;
}

async function getHistoryOfSolana(address) {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  const history = await connection.getSignaturesForAddress(address);
  console.log("Solana Transaction History:", history);
  return history;
}

async function getHistoryThroughBlockCypher(address) {
  const response = await axios.get(
    `https://api.blockcypher.com/v1/btc/main/addrs/${address}`
  );
  if (response.data && response.data.txrefs) {
    console.log("BlockCypher Transaction History:", response.data.txrefs);
    return response.data.txrefs;
  } else {
    return [];
  }
}

router.get("/historyOfTrax", async (req, res) => {

  try {
    const walletAddress = req.body.walletAddress;

    if (!walletAddress) {
      return res.status(404).json("Please give wallet address");
    }

    const parseWalletAddress = isWalletAddress.parse({ walletAddress });

    if (!parseWalletAddress) {
      return res.status(400).send("the data is incorrect");
    }

    const identifyAddress = IDENTIFYBLOCKCHAIN(walletAddress);

    if (!identifyAddress) {
      return res.status(400).send("Address is unidentifiable");
    }

    if (identifyAddress === "Ethereum") {
      // code to fetch the history of the transactions
      const result = getHistoryOfEthereum(walletAddress);

      const jsonTocsv = await JSONTOCSV(result);
      return result;
    } else if (identifyAddress === "Bitcoin") {
      // code to fetch the history of the transactions
      const result = getHistoryOfBitcoin(walletAddress);

      return result;
    } else if (identifyAddress === "Cardano") {
      // code to fetch the history of the transactions
      const result = getHistoryOfCardano(walletAddress);

      return result;
    } else if (identifyAddress === "Solana") {
      // code to fetch the history of the transactions
      const result = getHistoryOfSolana(walletAddress);

      return result;
    } else {
      // call the blockCypher for identification if the blockCypher return something show that otherwise show valid enter valid address

      const result = getHistoryThroughBlockCypher(walletAddress);
      if (result.length > 0) {
        return result;
      } else {
        res.status(401).send("Address might be invalid");
        return [];
      }
    }
  } catch (error) {
    console.log("an error has been occured in fetching history", error.message);
  }

});


router.get("getMultiChainTraxHistory", async(req,res)=>{
  try { 
    const {chain, walletAddress} = req.body;
    if(!chain || !walletAddress){
      return res.status(404).json("chain wallet address is required");
    }

    const parseCheck = checkMultiChain({chain,walletAddress});

    if(!parseCheck){
      return res.status(404).json("data is incorrect");
    }

    const url = `https://api.blockcypher.com/v1/${chain}/main/addrs/${walletAddress}/full`;
        const response = await axios.get(url);
        console.log("this is the response",response.data)

        const jsonToCsv = await JSONTOCSV(response.data.txs)

        return jsonToCsv; // List of transactions


    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        return [];
    }
})