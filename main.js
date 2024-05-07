const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the path module
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/checkPassword', (req, res) => {
    const inputHash = req.body.inputHash;
    const selectedAlgorithm = req.body.algorithm;

    const wordlist = fs.readFileSync(path.join(__dirname, '10-million-password-list-top-1000000.txt'), 'utf8').split('\n');

    const hashedWordlist = wordlist.map(word => {
        const hash = crypto.createHash(selectedAlgorithm).update(word.trim()).digest('hex');
        return { password: word.trim(), hash: hash };
    });

    const matchedEntry = hashedWordlist.find(entry => entry.hash === inputHash);

    if (matchedEntry) {
        res.send(`Password found in wordlist: ${matchedEntry.password}`);
    } else {
        res.send('Password not found in wordlist.');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
