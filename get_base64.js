import fs from 'fs';
import path from 'path';

const imagePath = 'C:/Users/LocDesk/.gemini/antigravity/brain/f98bd621-ad07-4a7e-9c0a-42dc8b4b0153/uploaded_image_1_1763999154449.png';
const outputPath = './base64_image.txt';

try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    fs.writeFileSync(outputPath, base64String);
    console.log('Base64 string saved to', outputPath);
} catch (error) {
    console.error('Error:', error);
}
