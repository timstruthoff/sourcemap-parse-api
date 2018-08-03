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

sourceMapRouter.get('/:id', (req, res) => {

  // TODO: Validate input
  let id = req.params.id;

  let object = store.getObject(id);

  res.status(200).json(object);
});

module.exports = sourceMapRouter;
