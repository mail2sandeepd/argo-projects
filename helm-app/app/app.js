// Importing required modules
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const hostname = process.env.APP_HOSTNAME || 'localhost';

// Serve static files from the current directory
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start the server
app.listen(port, () => {
  console.log(`App running at http://${hostname}:${port}`);
});

// Route for the main page
app.get('/', (req, res) => {
  const name = process.env.NAME || 'TCS World';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name} - v1</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
        body {
          background-color: #fff;
          color: #000;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center; /* Center the content vertically */
          align-items: center; /* Center the content horizontally */
          min-height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px #ff6f00, 0 0 20px #ff6f00, 0 0 30px #ff6f00, 0 0 40px #ff6f00;
        }
        .version {
          font-size: 1.5rem;
          color: #333;
        }
        p {
          font-size: 1.2rem;
          color: #333;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <h1>Hello ${name}</h1>
      <div class="version">Version 1</div>
      <p>App running at http://${hostname}:${port}</p>
    </body>
    </html>
  `);
});
