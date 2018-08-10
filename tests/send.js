const needle = require('needle');

/**
 * Sends the source map to the API. The server then parses the source map and returns the location.
 * @param {String} rawSourceMap A valid source map in JSON format.
 * @param {String} postURL The full address of the parse POST endpoint on the API server.
 */
module.exports = async (rawSourceMap, postURL) => {
  let data = { map: rawSourceMap };
  let options = { json: true };

  let response = await needle('post', postURL, data, options);
  if (response.body) {
    return response.body;
  } else {
    throw 'Invalid JSON in response!';
  }
};
