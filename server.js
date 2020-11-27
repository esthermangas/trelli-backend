const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const passport = require('passport');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true});
mongoose.promise = global.Promise;
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));

app.use(passport.initialize());
require("./middlewares/jwt")(passport);
require('./routes/index')(app);

app.listen(3001, () => console.log('server started'));

