// Importing required modules
const express = require('express');
const app = express();
const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`\n\x1b[36mApp running at http://localhost:${port}\x1b[0m\n`);
});

// Route for checking server health
app.get('/health', (req, res) => {
  // Sending a health status response
  res.status(200).send('\n\x1b[32mServer is healthy!\x1b[0m\n');
});

// Default route
app.get('/', (req, res) => {
  // Getting name from environment variables or using a default value
  const name = process.env.NAME || 'HMH World';
  // Sending a personalized greeting
  res.send(`\n\x1b[33mHello ${name}!\x1b[0m\n`);
}); 

