// Setup empty JS object to act as an endpoint for all routes
projectData = {};

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

app.post("/add", async function (req, res) {
    const body = await req.body;
    projectData = body;
    res.status(200).send(projectData);
});

app.get("/all", async (req, res) => {
    console.log(projectData);
    res.send(projectData);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
