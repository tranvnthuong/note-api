const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const connectDB = require('./config/db');
const limiter = require('./middlewares/limiter.middleware');
// const cors = require('cors');

require('dotenv').config();
const app = express();
// app.use(cors());
app.use(express.json());
// app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

connectDB();

app.use(limiter);
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
