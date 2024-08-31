const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'https://malshe-infrastructure-admin-panel.vercel.app'
  }));  
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define schema and model
const itemSchema = new mongoose.Schema({
    title: String,
    link: String,
    imageUrl: String,
});

const Item = mongoose.model('Item', itemSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Route to upload an item
app.post('/upload', upload.single('image'), async (req, res) => {
    const { title, link } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newItem = new Item({
        title,
        link,
        imageUrl,
    });

    try {
        await newItem.save();
        res.status(201).json({ message: 'Upload successful!', item: newItem });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading item', error });
    }
});

// Route to get all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// Route to delete an item by ID
app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
