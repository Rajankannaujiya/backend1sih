import axios from 'axios';
import express from 'express';

const router = express.Router();

router.post("/getInBulk", async(req, res)=>{
    const {currency } = req.body;
    const transaction = await axios.post(`https://api.ikna.io/${currency}}/bulk.json/get_block?num_pages=1`);
    console.log("this is the transaction", transaction.data);
    return res.status(200).json(transaction.data)
})

export default router;