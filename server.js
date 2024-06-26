const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

let sessions = {};

// Create a new session
app.post('/session', (req, res) => {
    const sessionId = uuidv4();
    sessions[sessionId] = { options: [] };
    console.log(`New session created: ${sessionId}`);
    res.json({ sessionId });
});

// Get options for a session
app.get('/options/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = sessions[sessionId];
    if (session) {
        res.json(session.options);
    } else {
        res.status(404).json({ message: 'Session not found' });
    }
});

// Add a new option to a session
app.post('/options/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = sessions[sessionId];
    if (session) {
        const newOption = {
            id: uuidv4(),
            text: req.body.text,
            votes: 0
        };
        session.options.push(newOption);
        console.log(`New option added to session ${sessionId}: ${newOption.text}`);
        res.json(newOption);
    } else {
        res.status(404).json({ message: 'Session not found' });
    }
});

// Vote for an option in a session
app.post('/vote/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = sessions[sessionId];
    if (session) {
        const { id } = req.body;
        const option = session.options.find(opt => opt.id === id);
        if (option) {
            option.votes += 1;
            console.log(`Vote added to option ${id} in session ${sessionId}`);
            res.json(option);
        } else {
            res.status(404).json({ message: 'Option not found' });
        }
    } else {
        res.status(404).json({ message: 'Session not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});