// Importing required modules
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const hostname = process.env.APP_HOSTNAME || 'localhost';

// Serve static files from the current directory
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`App running at http://${hostname}`);
});

// Route for the main page
app.get('/', (req, res) => {
  const name = process.env.NAME || 'TCS World';
  const version = process.env.APP_VERSION || 'v1';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name} - ${version}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
        body {
          background-color: #fff;
          color: #000;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .logo-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
        .logo {
          max-width: 80%;
          height: auto;
          max-height: 50vh;
          object-fit: contain;
        }
        .content-container {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
        }
        h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 1rem;
          text-shadow: 0 0 10px #ff6f00, 0 0 20px #ff6f00, 0 0 30px #ff6f00, 0 0 40px #ff6f00;
        }
        .version {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: #333;
          margin-bottom: 1rem;
        }
        p {
          font-size: clamp(1rem, 2vw, 1.2rem);
          margin: 0.5rem 0;
        }
        @media (max-width: 768px) {
          .logo-container {
            padding: 1rem;
          }
          .content-container {
            padding: 1rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="logo-container">
        <img src="/logo.png" alt="Logo" class="logo">
      </div>
      <div class="content-container">
        <h1>Hello ${name}</h1>
        <div class="version">Version - ${version}</div>
        <p>App running at http://${hostname}</p>
      </div>
    </body>
    </html>
  `);
});

// Route for checking server health
app.get('/health', (req, res) => {
  const version = process.env.APP_VERSION || 'v1';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Health - ${version}</title>
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
          color: #212420;
          text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00;
        }
        .version {
          font-size: 1.5rem;
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>Server is healthy!</h1>
      <div class="version">Version - ${version}</div>
    </body>
    </html>
  `);
});
