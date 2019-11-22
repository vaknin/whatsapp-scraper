// Consts
const express = require('express');
const cors = require('cors');
const upload = require('multer')();
const parser = new (require('./parser/ChatParser').ChatParser)();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// On POST
app.post('/upload', upload.single('file'), (req, res) => {
    let chatFile = req.file.buffer.toString('utf8');
    let analyzedChat = parser.read(chatFile);
    res.send(analyzedChat);
});

// Listen
app.listen(port);