const express = require('express');
const sourceMapRouter = express.Router();

const ApiError = require('./../../components/ApiError');

const SourceMapStore = require('./../../components/sourcemap-store');

const store = new SourceMapStore();

// Setting up json schema validators
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const validateSourceMapParse = ajv.compile(require('./../../../schemas/sourceMapParse.json'));
const validateSourceMapPost = ajv.compile(require('./../../../schemas/sourceMapPost.json'));

// Middleware for parsing the POST body into an object
sourceMapRouter.use(express.json({ limit: '100mb' }));

sourceMapRouter.post('/', (req, res, next) => {
  // Validating the request using a JSON Schema
  let sourceMapPostValid = validateSourceMapPost(req.body);
  if (!sourceMapPostValid) {
    throw new ApiError({
      message: 'Request invalid!',
      developerMessage: `The request is invalid: ${ajv.errorsText(validateSourceMapPost.errors)}`,
      statusCode: 400,
      code: 'E6059',
    });
  }

  let sourceMapJSON = req.body.map;

  let id = store.add(sourceMapJSON);

  // Returning the id of the source map after successful parse and error when unsuccessful
  store
    .getParsePromise(id)
    .then(() => {
      res.status(201).json({
        status: 201,
        id,
      });
    })
    .catch(error => {
      let responseError = new ApiError({
        message: `Could not parse source map: ${error.message}`,
        statusCode: 400,
        code: 'E8849',
      });

      next(responseError);
    });
});

/**
 * Endpoint for parsing an array of location.
 */
sourceMapRouter.post('/:id', (req, res, next) => {
  let id = req.params.id;

  // Validating the request using a JSON Schema
  let valid = validateSourceMapParse(req.body);
  if (!valid) {
    throw new ApiError({
      message: 'Request invalid!',
      developerMessage: `The request is invalid: ${ajv.errorsText(validateSourceMapParse.errors)}`,
      statusCode: 400,
      code: 'E6059',
    });
  }

  let locationsArray = req.body.errors;

  let returnArray = [];

  // Looping over locations in request and getting original
  // location for each.
  locationsArray.forEach(locationElement => {
    // Parsing the parameters
    let line = parseInt(locationElement.line);
    let column = parseInt(locationElement.column);

    returnArray.push(store.originalPositionFor(id, line, column));
  });

  // Returning all parsed locations
  res.status(200).json(returnArray);
});

module.exports = sourceMapRouter;
