// IMPORT
const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require("./routes/user")
const postRoutes = require("./routes/post")

// IMPORT CORS
const cors = require('cors');

// APP INITIALIZATION
const app = express();
dotenv.config()

// DATABASE
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
	origin: ['http://localhost:5173'],
	credentials: true,
	optionSuccessStatus: 200
}

app.use(cors(corsOptions));

// ROUTES
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// SERVER START
if (require.main === module) {
	app.listen(process.env.PORT || 3000, () => console.log(`Server running at post ${process.env.PORT || 3000}`));
}

// EXPORTS
module.exports = {app, mongoose}