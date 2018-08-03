const routes = require('express').Router();
const sourceMapRouter = require('./source-map');

routes.use('/source-map', sourceMapRouter);

routes.get('/', (req, res) => {
  res.status(200).send('ok');
});

module.exports = routes;
