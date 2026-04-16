const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.static('public'));
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});