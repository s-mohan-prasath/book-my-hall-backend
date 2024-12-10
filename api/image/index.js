import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const Router = express.Router();

// Emulating __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

Router.get('/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads/images/venues/', filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ status: "failed", error: "Image not found!" });
        }
    });
});

export default Router;
