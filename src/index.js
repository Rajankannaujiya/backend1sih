import 'dotenv/config'
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
  origin: "*",
  credentials:true
 }
  ));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // 10MB limit for JSON
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // 10MB limit for URL-encoded



app.get('/', (req, res) => {
    res.send('Hello! you are on the index page of sih!')
  })


import userRouter from "./authentication/auth.js";
import suspiciousRouter from "./suspicious/suspicious.js";
app.use('/api/v1/user', userRouter); 
app.use('api/v1/suspicious',suspiciousRouter);

const port =process.env.PORT || 5000;
app.listen(port,()=>{    
    console.log(`server is listening on the http://localhost:${port}`);
})