'use strict';

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { db } = require('./db');
const auth = require('./auth');
const api = require('./api');

const PORT = process.env.PORT || 8080;
const app = express();

module.exports = app;

if (process.env.NODE_ENV !== 'production')require('../secrets');

const createApp = () => {
  //logging middleware
  app.use(morgan('dev'));

  //body parsing middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //routes
  // app.use('/auth', auth);
  // app.use('api', api);

  //static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')));

  //sends index.html
  app.use('*', (req, res) => {
    rest.sendFile(path.join(__dirname, '..', 'public/index.html'));
  });

  //error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error');
  });
};

const startListening = () => {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

const syncDb = () => db.sync();

if (require.main === module) {
  syncDb()
    .then(createApp)
    .then(startListening);
} else {
  createApp();
}
