import { Router } from "express";
import { runApp } from "./functionexport.js";

const router = Router();


router.get("/", (req,res)=>{
    return res.send("hii from exchange");
})

router.get("/getExchnge",async(req, res)=>{
    const { exchangeAddress } = req.body;
    console.log(exchangeAddress)

    if(!exchangeAddress){
        return res.status(401).send("all inputs must be required");
    }

    if(exchangeAddress){
        const tranxWithExchanges = await runApp(exchangeAddress);
        return res.status(200).json({tranxWithExchanges});
    }
})



export default router;