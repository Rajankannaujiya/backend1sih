import { Router } from "express";
// import getTransactionMetadata from "./tranxADay.js"
import Web3 from 'web3';

const apiKey = process.env.ETHERSCAN_API;

const router = Router();

router.get("/getTranxADay", async(req, res)=>{
    const provider = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
    const web3 = new Web3(provider);
    const {walletAddress} = req.body;
    if(!walletAddress){
        return res.status(400).send("wallet Address is required");
    }
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400; // One day ago timestamp

  // Sepolia testnet base URL
  const sepoliaUrl = "https://api-sepolia.etherscan.io/api";

  try {
    const response = await axios.get(
      `${sepoliaUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    );


    // console.log("one day:", oneDayAgo)

    // Filter transactions for the last 24 hours
    const transactions = response.data.result.filter(
      (tx) => tx.timeStamp >= oneDayAgo

    );

    console.log("response:", transactions)
    const transactionDetails = response.data.result.map((tx) => {
      const txTimestamp = new Date(tx.timeStamp * 1000); // Convert timestamp to human-readable format
      const txAmountInETH = parseFloat(web3.utils.fromWei(tx.value, "ether"));
      const txFeeInETH = parseFloat(web3.utils.fromWei(tx.gasUsed * tx.gasPrice, "ether"));

      return {
        timestamp: txTimestamp,
        sender: tx.from,
        receiver: tx.to,
        amount: txAmountInETH,
        fee: txFeeInETH,
      };
    });

    return res.status(200).json(transactionDetails);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }
});

export default router;