require('dotenv').config({ encoding: 'utf8' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
MONGO_URI="mongodb+srv://ogiralarajeswari08_db_user:RajiReddy@cluster0.68omnlq.mongodb.net/?appName=Cluster0"
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', carRoutes);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// if (MONGO_URI) {
//   console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
//   process.exit(1);
// }

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
