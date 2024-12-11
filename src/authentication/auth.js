import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userSchema } from "../zod/type.js";
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

const saltRound = 10;
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const parsedUser = userSchema.parse({ email, password });

    if (!parsedUser) {
      return res.status(400).send("the data is incorrect");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json("User with given email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      return res.status(400).json({
        message: "failed to create new User",
      });
    }

    const token = jwt.sign(
      { id: newUser.id }, // Payload: An object with a key-value pair
      process.env.JWT_SECRET, // Secret key for signing
      { expiresIn: "1day" } // Optional: Token expiration time
    );
    // Set token in a secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return res
      .status(201)
      .json({ message: "Signup successful", user: { id: newUser.id, email } });
  } catch (error) {
    console.log("an error has been occur while signup", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("this is the ", req.body);
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const parsedUser = userSchema.parse({ email, password });

    if (!parsedUser) {
      return res.status(400).send("the data is incorrect");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log("this is the existing user", existingUser);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email" });
    }
    // console.log("I am here")
    console.log(password, existingUser?.password)
    const isPasswordValid = await bcrypt.compare(password, existingUser?.password);
    console.log("this is the password validattion",isPasswordValid)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: existingUser.id }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Expiration
    );

    // Set the token in a secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    // Return a success response
    return res.status(200).json({
      message: "Signin successful",
      user: { id: existingUser.id, email },
    });
  } catch (error) {
    console.log("an error has been occur while signin", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
