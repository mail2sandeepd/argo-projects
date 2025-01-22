// Importing required modules
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hello World</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
        body {
          background-color: #bfcddb;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between; /* Position content at top and bottom */
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
        }
        .logo {
          max-width: 100%; /* Make logo responsive */
          height: auto;
          margin-top: 2rem; /* Add some spacing at the top */
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px #ff6f00, 0 0 20px #ff6f00, 0 0 30px #ff6f00, 0 0 40px #ff6f00;
        }
        p {
          font-size: 1.2rem;
          color: #ccc;
          margin-bottom: 4rem; /* Add some spacing at the bottom */
        }
      </style>
    </head>
    <body>
      <img class="logo" src="/logo.png" alt="TCS World Logo">
      <h1>Hello TCS World!</h1>
      <p>App running at http://localhost:${port}</p>
    </body>
    </html>
  `);
});

// Route for checking server health
app.get('/health', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Health</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
        body {
          background-color: #a8f0b3;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
        }
        .logo {
          max-width: 100%;
          height: auto;
          margin-top: 2rem;
        }
        h1 {
          font-size: 3rem;
          color: #00ff00;
          text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00;
        }
      </style>
    </head>
    <body>
      <img class="logo" src="/logo.png" alt="TCS World Logo">
      <h1>Server is healthy!</h1>
    </body>
    </html>
  `);
});

// Default route
app.get('/', (req, res) => {
  const name = process.env.NAME || 'TCS World';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
        body {
          background-color: #bfcddb;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
        }
        .logo {
          max-width: 100%;
          height: auto;
          margin-top: 2rem;
        }
        h1 {
          font-size: 3rem;
          color: #ff6f00;
          text-shadow: 0 0 10px #ff6f00, 0 0 20px #ff6f00, 0 0 30px #ff6f00, 0 0 40px #ff6f00;
        }
      </style>
    </head>
    <body>
      <img class="logo" src="/logo.png" alt="TCS World Logo">
      <h1>Hello ${name}!</h1>
    </body>
    </html>
  `);
});
