import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Make request to Hugging Face Inference API
    const response = await fetch('https://api-inference.huggingface.co/models/fady17/flux', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();

    // Assuming the output is a URL to the image
    if (!data || !data.generated_image) {
      throw new Error('No image generated');
    }

    const imageUrl = data.generated_image;
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error('Failed to fetch generated image');
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: "Something went wrong",
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

export default router;
