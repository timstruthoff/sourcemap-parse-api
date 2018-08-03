const express = require('express');
const sourceMapRouter = express.Router();

const SourceMapStore = require('./../../components/sourcemap-store');

const store = new SourceMapStore();

// Midlleware for parsing the POST body into an object
sourceMapRouter.use(express.json());

sourceMapRouter.post('/', (req, res) => {

  // TODO: validate that map is valid JSON
  let sourceMapJSON = req.body.map


  let id = store.add(sourceMapJSON);
  res.status(201).json({
    id
  });
});

// QUESTION: URL format with code location in path (e.g. /:id/:line/:column) 
// or in GET parameter (e.g. /:id?line=1&column=2) ?
sourceMapRouter.get('/:id', (req, res) => {

  // TODO: Validate and sanitize input

  let id = req.params.id;

  // Checking if both line and column number are provided in the request
  let parametersPresent = (req.query.line !== undefined && req.query.column !== undefined);
  
  // Parsing the parameters
  let line = parseInt(req.query.line);
  let column = parseInt(req.query.column);
  
  if (parametersPresent) {
    res.status(200).json(store.originalPositionFor(id, line, column));
  } else {
    res.status(404).json({error: 'No line and column provied!'});
  }

});

module.exports = sourceMapRouter;
