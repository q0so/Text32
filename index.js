const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();
const port = 3000;

// إعداد قاعدة البيانات
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE links (code TEXT, url TEXT)");
});

app.use(bodyParser.json());
app.use(express.static('public')); // تحميل ملفات HTML و JS و CSS
app.use(helmet());

// توليد أحرف عشوائية
function generateRandomString(minLength, maxLength) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
}

// استقبال الرابط
app.post('/generate', (req, res) => {
    const { url } = req.body;
    const code = generateRandomString(4, 25);
    db.run("INSERT INTO links (code, url) VALUES (?, ?)", [code, url], function(err) {
        if (err) {
            return res.status(500).send("Error saving data");
        }
        res.json({ code });
    });
});

// البحث باستخدام الكود
app.get('/lookup/:code', (req, res) => {
    const { code } = req.params;
    db.get("SELECT url FROM links WHERE code = ?", [code], (err, row) => {
        if (err) {
            return res.status(500).send("Error fetching data");
        }
        if (row) {
            res.json({ url: row.url });
        } else {
            res.status(404).send("Code not found");
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
