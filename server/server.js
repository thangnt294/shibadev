import express from 'express';
import cors from 'cors';
import {readdirSync} from 'fs';
import mongoose from 'mongoose';
const morgan = require('morgan');
require('dotenv').config({ path: `.env.local` });

// create express app
const app = express();

// connect to db
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('DB connection error => ', err));

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
readdirSync('./routes').map(r => app.use('/api', require(`./routes/${r}`)));

// app boot
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));