const express = require('express');
const mongoose = require('mongoose');
const indexRouter = require('./Routes/indexRoutes');
const userRouter = require('./Routes/userRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let dotenv = require('dotenv').config();

const app = express();

//Handling MongoDB Connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsInsecure: true,
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB Connection Error:', err);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

//MiddleWares to hanlde CORS, Routes, Request Body Parsing
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', userRouter);

//Initiating Server
app.listen(process.env.PORT || 5000, () => console.log('Server Runnig on PORT : 5000'));

module.exports = app;