require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
})
.catch(err => console.error('DB Error:', err));