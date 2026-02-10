import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const dataFile = path.join(__dirname, 'variables.txt');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Read girlName from variables.txt
app.get('/api/name', (req, res) => {
    try {
        const data = fs.readFileSync(dataFile, 'utf8').trim();
        res.json({ name: data || 'My Love' });
    } catch (error) {
        res.json({ name: 'My Love' });
    }
});

// Write girlName to variables.txt
app.post('/api/name', (req, res) => {
    try {
        const { name } = req.body;
        if (name && name.trim()) {
            fs.writeFileSync(dataFile, name.trim());
            res.json({ success: true, name: name.trim() });
        } else {
            res.status(400).json({ success: false, error: 'Name cannot be empty' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Serving Valentine Website...');
});
