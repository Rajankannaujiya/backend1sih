
import { z } from "zod";

const userSchema = z.object({
    email: z.string()
    .email()
    .refine(email => email.length >= 10, {
        message: "Email must be at least 10 characters long",
      }),
    password: z.string().min(6,"Password is too short, at least 6 character is required")
});

const isSuspicioys = z.object({
  walletAddress: z.string().min(20,"wallet id is invalid please enter the valid wallet id")
});

const isWalletAddress = z.object({
  walletAddress: z.string().min(20,"wallet id is invalid please enter the valid wallet id")
})


const checkMultiChain = z.object({
  chain:z.string(),
  walletAddress: z.string().min(20,"wallet id is invalid please enter the valid wallet id")
})
export {userSchema,isSuspicioys, isWalletAddress, checkMultiChain}; 