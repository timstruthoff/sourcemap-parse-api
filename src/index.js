const express = require('express');
const path = require('path');
const routes = require('./routes');
const ApiError = require('./components/ApiError');

const CONFIG = require('./config');

const app = express();

app.get('/', (re, res) => {
  test.test();
  throw new Error('test');
  throw new ApiError({
    message: 'Source map not parsed yet!',
    statusCode: 400,
    code: 'E1282',
  });
});

//  Connect all routes to the application
app.use('/', routes);

// Middleware for handling all not found requests!
app.use('*', (req, res, next) => {
  throw new ApiError({
    message: `Could not ${req.method} ${req.originalUrl}!`,
    statusCode: 404,
    code: 'E7746',
  });
});

// Middleware for handling all errors.
app.use(function(error, req, res, next) {
  console.error(error);

  // If err has no specified error code, setting error code to 'Internal Server Error (500)'
  if (!error.statusCode) error.statusCode = 500;

  // Checking if the error should be sent.
  if (typeof error === 'string') {
    res.status(500).json({
      status: 500,
      message: error,
    });
  } else if (typeof error === 'object' && error instanceof ApiError) {
    const responseObject = {};

    // Destructuring error object into separate variables.
    const { message, developerMessage, statusCode, code } = error;

    // Validating each part of the error.
    if (typeof message === 'string' && message.length > 0) {
      responseObject.message = message;
    }

    if (typeof developerMessage === 'string' && developerMessage.length > 0) {
      responseObject.developerMessage = developerMessage;
    }

    if (typeof statusCode === 'number') {
      responseObject.statusCode = statusCode;
    }

    if (typeof code === 'string' && code.length === 5) {
      responseObject.code = code;
    }

    res.status(statusCode).json(responseObject);
  } else {
    res.status(500).json({
      message: 'Unknown error!',
      statusCode: 500,
      code: 'E1000',
    });
  }
});

app.listen(CONFIG.PORT, () => console.log(`App listening on port ${CONFIG.PORT}!`));
