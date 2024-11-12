const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // للسماح بتحميل الملفات الثابتة مثل `index.html` و `script.js`

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// تعريف مخطط المستخدمين
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    notes: [String]
});

const User = mongoose.model('User', userSchema);

// مسار إنشاء الحساب
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, notes: [] });
    await newUser.save();
    res.send("تم إنشاء الحساب بنجاح");
});

// مسار تسجيل الدخول
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        res.json({ message: "تم تسجيل الدخول بنجاح", notes: user.notes });
    } else {
        res.status(400).send("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
});

// مسار حفظ النص
app.post('/save-note', async (req, res) => {
    const { email, note } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        user.notes.push(note);
        await user.save();
        res.send("تم حفظ النص");
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
