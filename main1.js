const express = require('express');
const cors = require('cors');
const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' }));

// POST endpoint to receive base64 image data and remove background
app.post('/remove-background', async (req, res) => {
    try {
        const base64Data = req.body.image;

        if (!base64Data) {
            return res.status(400).send({ error: 'No base64 image data provided.' });
        }
        const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 data format');
        }
        const imageData = matches[2];
        const buffer = Buffer.from(imageData, 'base64');

// Write binary buffer to a temporary file
const tempFilePath = 'temp-image.png'; // Adjust the file path and extension as needed
fs.writeFileSync(tempFilePath, buffer);
        // Process the base64 image data to remove background
        const resultBuffer = await removeBackground(tempFilePath);
       const buffer1 = Buffer.from(await resultBuffer.arrayBuffer());

        // Generating data URL
        const dataURL = `data:image/png;base64,${buffer1.toString("base64")}`;
       // console.log(dataURL);
        // Send the processed image as response
        res.status(200).send(dataURL);
        //console.log(res.send(dataURL));
    } catch (error) {
        console.error('Error removing background:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// const express = require('express');
// const multer = require('multer');
// const cors= require('cors')
// const { removeBackground } = require('@imgly/background-removal-node');

// const app = express();
// const port = 3000;
// app.use(cors()); // Enable CORS for all routes
// app.use(express.static('public'));
// app.use(express.json());
// // Multer configuration to handle file uploads
// const upload = multer({ dest: 'uploads/' });

// // Initialize BackgroundRemoval
// // const bgRemoval = new removeBackground();

// // POST endpoint to receive image and remove background
// app.post('/remove-background', upload.single('image'), async (req, res) => {
//     try {
//         if (!req.file) {
//             console.log(req.file)
//             return res.status(400).send({ error: 'No file uploaded.' });
//         }

//         // Process the uploaded image to remove background
//         const resultBuffer = await removeBackground(req.file.path);
//         const buffer = Buffer.from(await resultBuffer.arrayBuffer());

//         // Generating data URL
//         const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
//         // Send the processed image as response
//        // res.set('Content-Type', 'image/png');
//        console.log(dataURL);
//         res.send(dataURL);
//     } catch (error) {
//         console.error('Error removing background:', error);
//         res.status(500).send({ error: 'Internal server error.' });
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
