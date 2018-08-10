const send = require('./send');
const makeSourceMap = require('./makeSourceMap');

const URL = 'http://localhost:3000/source-map/';

setInterval(() => {
  send(makeSourceMap(), URL)
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error(error);
    });
}, 5);
