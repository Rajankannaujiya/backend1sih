import fs from 'fs';  // Import fs module for reading and writing files

// Function to convert Wei to Ether
const convertWeiToEther = (weiValue) => {
  return weiValue / 1e18;
};

// Function to process transactions for all addresses
const processTransactions = (data) => {
  // Get all unique addresses from both 'from' and 'to' fields
  const allAddresses = new Set();
  data.forEach(tx => {
    allAddresses.add(tx.from.toLowerCase());
    allAddresses.add(tx.to.toLowerCase());
  });

  // Store the results for all addresses
  const results = [];

  // Process each address
  allAddresses.forEach(address => {
    const receivedTransactions = data.filter(tx => tx.to.toLowerCase() === address.toLowerCase());

    // If the address received transactions, calculate the metrics
    if (receivedTransactions.length > 0) {
      const timestamps = receivedTransactions.map(tx => new Date(tx.timeStamp).getTime());
      const valuesInWei = receivedTransactions.map(tx => parseInt(tx.value));

      // Convert Wei to Ether
      const valuesInEther = valuesInWei.map(value => convertWeiToEther(value));

      const totalTransactions = receivedTransactions.length;
      const totalReceived = valuesInEther.reduce((acc, val) => acc + val, 0);
      const minValueReceived = Math.min(...valuesInEther);
      const maxValueReceived = Math.max(...valuesInEther);
      const avgValueReceived = totalReceived / totalTransactions;

      // Calculate Time Span and Avg Time Between Transactions
      const timeSpan = (Math.max(...timestamps) - Math.min(...timestamps)) / (1000 * 60); // in minutes
      const avgTimeBetween = (totalTransactions > 1) ? (timeSpan / (totalTransactions - 1)) : 0;

      // Get unique senders for this address
      const uniqueSenders = new Set(receivedTransactions.map(tx => tx.from.toLowerCase()));

      // Store the result for this address
      results.push({
        Address: address,
        "Avg Time Between Received Transactions (mins)": avgTimeBetween.toFixed(2),
        "Time Span of Transactions (mins)": timeSpan.toFixed(2),
        "Unique Senders to Receiver": uniqueSenders.size,
        "Min Value Received": minValueReceived.toFixed(18),  // Showing 18 decimal places
        "Max Value Received": maxValueReceived.toFixed(18),
        "Avg Value Received": avgValueReceived.toFixed(18),
        "Total Transactions": totalTransactions,
        "Total Cryptocurrency Received": totalReceived.toFixed(18),
        "Remaining Cryptocurrency Balance": totalReceived.toFixed(18) // Assuming balance is the total received
      });
    }
  });

  return results;
};

// Function to convert result to CSV format
const convertToCSV = (data) => {
  const header = Object.keys(data[0]);
  const rows = data.map(row => Object.values(row));
  const csv = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  return csv;
};

// Read input JSON file (replace 'input.json' with the path to your file)
// console.log(fs.readFile('./transactions_with_local_time.json'))
fs.readFile('./transactions_with_local_time.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  const transactionData = JSON.parse(data);

  // Process the transactions to get results
  const processedData = processTransactions(transactionData);

  // Convert processed data to CSV format
  const csvData = convertToCSV(processedData);

  // Save the CSV data to output.csv
  fs.writeFileSync('output.csv', csvData);

  console.log('CSV file has been saved as output.csv');
});