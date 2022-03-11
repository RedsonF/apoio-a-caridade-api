require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth.router');
const donorRouter = require('./routes/donor.router');
const institutionRouter = require('./routes/institution.router');
const publicationRouter = require('./routes/publication.router');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/donor', donorRouter);
app.use('/api/institution', institutionRouter);
app.use('/api/publication', publicationRouter);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const url = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.akixk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    app.listen(3333);
    console.log('conectou ao banco!');
  })
  .catch((err) => console.log(err));
