const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const readline = require('readline');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/checkPassword', (req, res) => {
    const inputHash = req.body.inputHash;
    const selectedAlgorithm = req.body.algorithm;

    const wordlistStream = fs.createReadStream(path.join(__dirname, 'xato-net-10-million-passwords.txt'), 'utf8');

    const rl = readline.createInterface({
        input: wordlistStream,
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        const hash = crypto.createHash(selectedAlgorithm).update(line.trim()).digest('hex');
        if (hash === inputHash) {
            res.send(`Password found in wordlist: ${line.trim()}`);
            rl.close(); // Stop further processing once the password is found
        }
    });

    rl.on('close', () => {
        if (!res.headersSent) { // Check if response has already been sent
            res.send('Password not found in wordlist.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
