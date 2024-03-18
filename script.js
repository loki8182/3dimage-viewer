// Importing necessary modules
const express = require('express');
const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');

// Create Express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to remove background from an image
app.post('/remove-background', async (req, res) => {
    try {
        // Get the image source from the request body
        const imgSource = req.body.imgSource;

        // Removing background
        const blob = await removeBackground(imgSource);

        // Converting Blob to buffer
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Generating data URL
        const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;

        // Sending the processed image data URL as response
        res.send({ imageURL: dataURL });
    } catch (error) {
        // Handling errors
        res.status(500).send({ error: 'Error removing background: ' + error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
