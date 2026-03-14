// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 連接 MongoDB 資料庫
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定義用戶資料模型
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// CORS 設定，允許前端跨域請求（附帶 cookie）
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));

// 使用 JSON 解析中介軟體
app.use(express.json());

// 設置 session，用來記住登入狀態
app.use(session({
  secret: 'secret_key', // 換成更安全的密鑰
  resave: false,
  saveUninitialized: true
}));

// 註冊路由
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // 檢查是否已經有這個使用者
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ message: '用戶名稱或電子郵件已被註冊' });
  }

  // 密碼加密
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = new User({ username, email, password: hashedPassword });
  
  try {
    await newUser.save();
    res.status(201).json({ message: '註冊成功' });
  } catch (error) {
    res.status(500).json({ message: '註冊失敗，請稍後再試' });
  }
});

// 登入路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ $or: [{ username }, { email: username }] });
  
  if (!user) {
    return res.status(400).json({ message: '用戶名稱或密碼錯誤' });
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (isMatch) {
    req.session.userId = user._id; // 記住用戶登入狀態
    res.status(200).json({ message: '登入成功' });
  } else {
    res.status(400).json({ message: '用戶名稱或密碼錯誤' });
  }
});

// 啟動伺服器
app.listen(3000, () => {
  console.log('伺服器已啟動，端口 3000');
});
