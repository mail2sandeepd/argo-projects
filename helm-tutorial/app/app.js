// Importing required modules
const express = require('express');
const app = express();
const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`\n\n\x1b[1m\x1b[35m
  ┏━┓┏━╸╺┳╸┏━╸╺┳╸   ┏━┓┏━┓┏━╸╻ ╻
  ┣┳┛┣╸  ┃ ┣╸  ┃    ┗━┓┣━┫┃  ┃┏┛
  ╹┗╸┗━╸ ╹ ┗━╸ ╹    ┗━┛╹ ╹┗━╸┗┛ 
  \x1b[0m\n\x1b[36mApp running at http://localhost:${port}\x1b[0m\n\n`);
});

// Route for checking server health
app.get('/health', (req, res) => {
  // Sending a health status response
  res.send('<h1 style="color:green;">Server is healthy!</h1>');
});

// Default route
app.get('/', (req, res) => {
  // Getting name from environment variables or using a default value
  const name = process.env.NAME || 'HMH World';
  // Sending a personalized greeting
  res.send(`<h1 style="color:orange;">Hello ${name}!</h1>`);
}); 
