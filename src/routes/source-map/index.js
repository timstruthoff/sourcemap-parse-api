const sourceMapRouter = require('express').Router();

sourceMapRouter.get('/', (req, res) => {
  res.send('ok');
});

module.exports = sourceMapRouter;
