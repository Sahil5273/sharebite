require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// 1. Middleware
app.use(cors()); // This stops the "CORS Policy" error in React
app.use(express.json());

// 2. Setup Multer (Keeps image in server RAM temporarily)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// 3. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// A simple GET route so the browser has something to display
app.get('/', (req, res) => {
  res.send('✅ ShareBite Backend is alive and waiting for React!');
});

// 4. The AI Auto-Fill Route
app.post('/api/analyze-food', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("Image received, analyzing with Gemini...");

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype
      }
    };

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = `
      Look at this food image. Return a raw JSON object with NO markdown formatting, NO backticks, and NO extra text.
      Use exactly these keys:
      - "title": A short 3-4 word title of the food.
      - "category": Choose strictly from "Fresh Produce", "Cooked Meal", "Packaged Food", or "Beverages".
      - "quantity": A short guess at the amount (e.g., "2 plates", "1 box", "5 kg").
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();
    
    // Clean up markdown block if Gemini adds it
    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '');
    const foodData = JSON.parse(cleanJsonString);

    console.log("Analysis complete:", foodData);
    res.json(foodData);

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// 5. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ ShareBite AI Backend is running on http://localhost:${PORT}`);
});