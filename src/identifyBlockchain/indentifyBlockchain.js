// Detect Blockchain Based on Address
export const IDENTIFYBLOCKCHAIN = (address) =>{
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return "Ethereum";
    } else if (/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address)) {
      return "Bitcoin";
    } else if (/^[A-Za-z0-9]{43,44}$/.test(address)) {
      return "Solana";
    } else if (/^addr1|stake1/.test(address)) {
      return "Cardano";
    } else {
      return "Unknown";
    }
  }
  
  // Example Usage
  // const address = "0xe760cb4876Ece39Ae861233CedA0C0Ea0D87F2d6"; // Replace with an actual address
  // console.log(`Blockchain: ${IDENTIFYBLOCKCHAIN(address)}`);
  