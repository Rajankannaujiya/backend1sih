
import 'dotenv/config'
import Moralis from "moralis"; // Moralis SDK
import { EvmChain } from "@moralisweb3/common-evm-utils"; // EvmChain utility
import { exchangeAddress } from "./exchangeAddress.js";


export const runApp = async (exAddress) => {
//   await Moralis.start({ apiKey: process.env.Moralis_APIKEY });
if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.Moralis_APIKEY,
    });
  }

  const address = exAddress;
  const chain = EvmChain.ETHEREUM;
  console.log("this is the address",address)

  const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    address,
    chain,
  });

  const transactions = response.toJSON().result;
console.log(transactions.length)
console.log(exchangeAddress.length)

const transactionsWithExchanges = [];

  transactions.forEach((tx) => {
    //   console.log(tx.from_address);
    //   console.log(exchangeAddress[1].toLowerCase());
    //   console.log(tx.to_address ===exchangeAddress[1].toLowerCase());
    for(let i=0; i<exchangeAddress.length; i++) {
        if(tx.to_address === exchangeAddress[i].toLowerCase() || tx.from_address === exchangeAddress[i].toLowerCase()) {
            // console.log(true);
            // console.log(`Transaction with exchange: ${tx.hash}`);
            // console.log(`From: ${tx.from_address_label || tx.from_address}`);
            // console.log(`To: ${tx.to_address_label || tx.to_address}`);

            transactionsWithExchanges.push({
                hash: tx.hash,
                from: tx.from_address_label || tx.from_address,
                to: tx.to_address_label || tx.to_address,
                matchedExchange: exchangeAddress[i]
            });
        }
    }
    // if (tx.to_address_label || tx.from_address_label) {
    //   console.log(`Transaction with exchange: ${tx.hash}`);
    //   console.log(`From: ${tx.from_address_label || tx.from_address}`);
    //   console.log(`To: ${tx.to_address_label || tx.to_address}`);
    // }
  });

  console.log(transactionsWithExchanges)

  return transactionsWithExchanges
};
