import fs from 'fs';
import path from 'path';

const base64Path = './base64_image.txt';
const targetPath = './src/utils/ProtocolGenerator.js';

try {
    const base64String = fs.readFileSync(base64Path, 'utf8').trim();
    let content = fs.readFileSync(targetPath, 'utf8');

    // Regex to find the brasaoBase64 line
    const regex = /const brasaoBase64 = 'data:image\/png;base64,[^']+';/;

    if (regex.test(content)) {
        const newLine = `const brasaoBase64 = 'data:image/png;base64,${base64String}';`;
        content = content.replace(regex, newLine);
        fs.writeFileSync(targetPath, content);
        console.log('Successfully updated brasaoBase64 in ProtocolGenerator.js');
    } else {
        console.error('Could not find brasaoBase64 definition in ProtocolGenerator.js');
    }
} catch (error) {
    console.error('Error:', error);
}
