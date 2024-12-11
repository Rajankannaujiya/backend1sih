

export async function JSONTOCSV(jsonArray) {
    if (!jsonArray || !jsonArray.length) {
      console.error("Input JSON array is empty or invalid.");
      return "";
    }
  
    // Get the keys for headers from the first object
    const headers = Object.keys(jsonArray[0]);
  
    // Prepare CSV content as an array of strings
    const csvRows = [];
    
    // Add headers as the first row
    csvRows.push(headers.join(","));
  
    // Add data rows
    for (const obj of jsonArray) {
      const row = headers.map(header => {
        const value = obj[header] !== undefined ? obj[header] : ""; // Handle missing fields
        return JSON.stringify(value).replace(/"/g, '""'); // Escape double quotes
      });
      csvRows.push(row.join(","));
    }
  
    // Join all rows with newline character
    return csvRows.join("\n");
}
