
import "dotenv/config";
import { isSuspicioys } from "../zod/type.js";
import express from 'express';
import { PrismaClient } from "@prisma/client";
import axios from 'axios';

const prisma = new PrismaClient();

const router =  express.Router();




//  to check for the suspicious wallet address in db

router.get("/checkSuspicious", async(req, res)=>{
    try {
        const {walletAddress} = req.body;
    
        if(!walletAddress){
            return res.status(404).json("Please give wallet address");
        }
    
        const parseWalletAddress = isSuspicioys.parse({walletAddress});
    
        if(!parseWalletAddress){
            return res.status(400).send("the data is incorrect");   
        }

        const checkSuspicious = await axios.post("Url to check for suspicious");

        if(checkSuspicious){
            return true
        }
        else{
            return false
        }

    } catch (error) {
        console.log("An error occured while checking for the suspicious address", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
})

// to save suspicious wallet address in the db;
router.post("/suspiciousWalletAddress", async(req, res)=>{
    try {
        const {walletAddress} = req.body;
    
        if(!walletAddress){
            return res.status(404).json("Please give wallet address");
        }
    
        const parseWalletAddress = isSuspicioys.parse({walletAddress});
    
        if(!parseWalletAddress){
            return res.status(400).send("the data is incorrect");   
        }
    
        const existingSuspiciousAddress = await prisma.isSuspicious.findUnique({
            where:{
                walletAddress:walletAddress
            }
        })
    
    
        if(existingSuspiciousAddress){
            return res.status(409).json("User with given address marked as suspicious");
        }
        const suspiciousWalletAddress = await prisma.isSuspicious.create({
            data:{
                walletAddress:walletAddress,
                isSuspicious:true,
                reason:req.body?.reason
            }
        })
    
        return res.status(201).json({message: "save successfully", suspicious_id:suspiciousWalletAddress.id})
    
    } catch (error) {
        console.log("An error occured while saving suspicious account", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
})


// to get the suspicious wallet Adress from the db

router.get("/getOneSuspiciousAddress", async(req, res)=>{
    try {
        const {walletAddress} = req.body;
    
        if(!walletAddress){
            return res.status(404).json("Please give wallet address");
        }

        const parseWalletAddress = isSuspicioys.parse({walletAddress});
    
        if(!parseWalletAddress){
            return res.status(400).send("the data is incorrect");   
        }


        const existingSuspiciousAddress = await prisma.isSuspicious.findUnique({
            where:{
                walletAddress:walletAddress
            }
        })
        
        if(!existingSuspiciousAddress){
            return res.status(400).send("Address is not suspicious for us");
        }

        return res.status(201).json({message: "fetched successfully", data:existingSuspiciousAddress})


    } catch (error) {
        console.log("An error occured while getting a suspicious address", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
})


// to get all the suspicious wallet Address from the db

router.get("/getAllSuspiciousAddress", async(req, res)=>{
    try {
        const findAllWalletAddress = await prisma.isSuspicious.findMany()
        
        if(findAllWalletAddress.length === 0){
            return res.status(400).send("No address is found");
        }

        return res.status(201).json({message: "fetched successfully", data:findAllWalletAddress})


    } catch (error) {
        console.log("An error occured while getting all the suspicious transaction", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;

