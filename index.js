const express = require('express');
const bodyParser = require('body-parser');
const JSONdb = require('simple-json-db');

const app = express();
const port = 3000;

const db = new JSONdb('notes.json');

app.use(bodyParser.json());

const formatIp = (ip) => {
    return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
};

const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
};

const apiRouter = express.Router();

apiRouter.get('/get/:id', (req, res) => {
    const note = db.get(`notes.${req.params.id}`);

    if (note) {
        res.json(note);
    } else {
        res.status(404).send('Note not found');
    }
});

apiRouter.post('/add', (req, res) => {
    const ip = formatIp(req.ip);
    const requestTime = new Date().toISOString();
    const userAgent = req.get('User-Agent');
    const { content } = req.body;
    const id = generateRandomId();

    db.set(`notes.${id}`, { id, content, ip, requestTime, userAgent });

    res.json({ id, requestTime });
});

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
