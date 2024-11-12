const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const db = new sqlite3.Database(':memory:'); // يمكن استبدالها بملف قاعدة بيانات مثل 'database.db'

// إعداد قاعدة البيانات
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)");
    db.run("CREATE TABLE texts (id INTEGER PRIMARY KEY, user_id INTEGER, text TEXT)");
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// تسجيل حساب جديد
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], function(err) {
            if (err) res.json({ success: false, message: "اسم المستخدم موجود بالفعل" });
            else res.json({ success: true });
        });
    });
});

// تسجيل الدخول
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.userId = user.id;
                    res.json({ success: true, username: user.username });
                } else res.json({ success: false, message: "كلمة المرور غير صحيحة" });
            });
        } else res.json({ success: false, message: "اسم المستخدم غير موجود" });
    });
});

// حفظ النص
app.post('/save-text', (req, res) => {
    if (!req.session.userId) return res.json({ success: false });
    const { text } = req.body;
    db.run("INSERT INTO texts (user_id, text) VALUES (?, ?)", [req.session.userId, text], () => {
        res.json({ success: true });
    });
});

// جلب النصوص المحفوظة
app.get('/texts', (req, res) => {
    if (!req.session.userId) return res.json([]);
    db.all("SELECT text FROM texts WHERE user_id = ?", [req.session.userId], (err, rows) => {
        res.json(rows.map(row => row.text));
    });
});

// تسجيل الخروج
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// بدء الخادم
app.listen(3000, () => console.log("الخادم يعمل على http://localhost:3000"));
