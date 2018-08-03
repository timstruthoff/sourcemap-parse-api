const convertSourceMap = require('convert-source-map');
const sourceMap = require('source-map');

// TODO: Prevent dublicate stores
module.exports = class {
  constructor(sourceMapJSON) {
    this.status = 'storing';

    // Converting sourcemap into JSON and object format
    let convertObject = convertSourceMap.fromJSON(sourceMapJSON);
    this.sourceMapObject = convertObject.toObject();
    this.sourceMapJSON = convertObject.toJSON();

    // Garbage collection
    convertObject = null;

    // Starting the parsing of the sourcemap.
    this.parsePromise = this.parse();

    // When parsing is complete the consumer is made available in the class.
    this.parsePromise.then(consumer => {
      this.status = 'ready';
      this.consumer = consumer;
    });
  }

  /**
   * Parses the source map.
   */
  parse() {
    if (typeof this.sourceMapObject !== 'object') {
      throw 'No sourcemap found in sourcemap object!';
    } else {
      this.status = 'parsing';

      // Returning a promise which gets resolved when the parsing is complete
      return new Promise((resolve, reject) => {
        let resolveObject = {};

        // TODO: Handle invalid sourcemap
        // TODO: May not work because consumer will be destroyed (see doku)
        sourceMap.SourceMapConsumer.with(this.sourceMapObject, null, consumer => {
          resolveObject.originalPositionFor = consumer.originalPositionFor;

          resolve(resolveObject);
        });
      });
    }
  }

  /**
   * Calculates the original position.
   * @param {number} line
   * @param {number} column
   * @returns {object}
   */
  originalPositionFor(line, column) {
    if (this.status !== 'ready') {
      throw 'Parser not ready yet!';
    } else {
      this.consumer.originalPositionFor(line, column);
    }
  }
};
