const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json({ limit: '10mb' }));

// Function to ensure a folder exists, create it if not
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Serve static files from the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Endpoint for authorizing a candidate and saving base image
app.post('/authorize', (req, res) => {
  try {
    const { candidateId, baseImage } = req.body;
    const candidateFolder = path.join(__dirname, `images/${candidateId}/base_image`);
    
    // Ensure the candidate folder exists
    ensureFolderExists(candidateFolder);

    // Save base image
    const baseImageBuffer = Buffer.from(baseImage.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
    const baseImagePath = path.join(candidateFolder, `${candidateId}_base_image.jpg`);

    fs.writeFileSync(baseImagePath, baseImageBuffer);

    res.status(200).json({ message: 'Authorization successful', imagePath: `/images/${candidateId}/base_image/${candidateId}_base_image.jpg` });
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ error: 'Internal server error during authorization' });
  }
});

// Endpoint for receiving periodic images during the exam
app.post('/capture', (req, res) => {
  try {
    const { candidateId, timestamp, candidateImage, laptopScreenshot } = req.body;
    const candidateFolder = path.join(__dirname, `images/${candidateId}`);
    const screenshotFolder = path.join(candidateFolder, 'screenshots');
    const webcamcapturesFolder = path.join(candidateFolder, 'webcamcaptures');

    // Ensure the candidate folder exists
    ensureFolderExists(candidateFolder);
    ensureFolderExists(screenshotFolder);
    ensureFolderExists(webcamcapturesFolder);

    // Save candidate image and laptop screenshot
    const candidateImagePath = path.join(webcamcapturesFolder, `${timestamp}_webcam_${candidateId}.jpg`);
    const screenshotImagePath = path.join(screenshotFolder, `${timestamp}_screenshot_${candidateId}.png`);

    fs.writeFileSync(candidateImagePath, candidateImage, 'base64');
    fs.writeFileSync(screenshotImagePath, laptopScreenshot, 'base64');

    res.status(200).json({
      message: 'Images captured successfully',
      candidateImagePath: `/images/${candidateId}/webcamcaptures/${timestamp}_webcam_${candidateId}.jpg`,
      screenshotImagePath: `/images/${candidateId}/screenshots/${timestamp}_screenshot_${candidateId}.png`
    });
  } catch (error) {
    console.error('Capture error:', error);
    res.status(500).json({ error: 'Internal server error during image capture' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
