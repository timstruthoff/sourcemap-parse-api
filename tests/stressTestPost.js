const send = require('./send');
const makeSourceMap = require('./makeSourceMap');

const URL = 'http://127.0.0.1:3000/source-map';

console.log(makeSourceMap());

send(makeSourceMap(), URL).catch(error => {
  console.error(error);
});
