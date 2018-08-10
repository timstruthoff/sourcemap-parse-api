const CRC32 = require('crc-32');
const SourceMap = require('./sourcemap');
const config = require('./../config');

module.exports = class {
  constructor() {
    this.store = {};
    this.storeOrder = [];

    // Checking for old source maps.
    setInterval(() => {
      this.deleteOldSourceMaps();
      console.log(this.storeOrder);
    }, config.SOURCE_MAP_DELETE_INTERVAL);
  }

  /**
   * Adds a source map to the store and returns the id in the store.
   * Also starts the parsing of the sourcemap.
   * @param {String} sourceMapJSON A sourcemap in JSON format
   * @return {String} The id of the source map in the store.
   */
  add(sourceMapJSON) {
    // Calculating checksum.
    let id = CRC32.str(sourceMapJSON).toString(32);

    // Checking if the same source map was already parsed.
    let existsIndex = this.storeOrder.indexOf(id);
    if (existsIndex === -1) {
      // Inserting source map into store and starting the parsing.
      this.store[id] = new SourceMap(sourceMapJSON);
    } else {
      // Removing the elements id from the order array.
      this.storeOrder.splice(existsIndex, 1);
    }

    // Inserting id of source map at the end of the order.
    this.storeOrder.push(id);

    // Deleting the oldest source map if the maximum number
    // of source maps on the server is exceeded.
    this.limitNumberOfSourceMaps();

    return id;
  }

  /**
   * Deletes the oldest source map if the maximum number
   * of source maps on the server is exceeded.
   */
  limitNumberOfSourceMaps() {
    let numberOfSourceMaps = this.storeOrder.length;

    if (numberOfSourceMaps >= config.MAX_NUMBER_OF_SOURCE_MAPS) {
      // Removing the oldest source map.
      let id = this.storeOrder[0];

      this.delete(id);
    }
  }

  /**
   * Deletes all source maps which are older than a certain number.
   */
  deleteOldSourceMaps() {
    // Calculating the timestamp from which on the source maps are deleted
    let deleteThreshold = Date.now() - config.SOURCE_MAP_DELETE_TIMEOUT;

    // Looping source maps
    this.storeOrder.forEach(id => {
      let sourceMapObject = this.store[id];

      // Checking if the source map is older than that.
      if (sourceMapObject.timestamp < deleteThreshold) {
        this.delete(id);
      }
    });
  }

  /**
   * Removes a source map from the store.
   * @param {String} id The id of a source map in the store.
   */
  delete(id) {
    let index = this.storeOrder.indexOf(id);
    if (index > -1) {
      this.storeOrder.splice(index, 1);
      this.store[id] = undefined;
    }
  }

  /**
   * Gets a source map in json format
   * @param {String} id The id of the sourcemap
   * @return {String} Source map in JSON format.
   */
  getJSON(id) {
    if (typeof this.store[id] !== 'object') {
      throw 'Source map not found!';
    } else {
      return this.store[id].sourceMapJSON;
    }
  }

  /**
   * Gets a source map as object format
   * @param {String} id The id of the sourcemap
   * @return {object} Source map as object.
   */
  getObject(id) {
    if (typeof this.store[id] !== 'object') {
      throw 'Source map not found!';
    } else {
      return this.store[id].sourceMapObject;
    }
  }

  /**
   * Returns the original source, line, and column information
   * for the generated source's source map id, line and
   * column positions provided.
   * @param {string} id The id of the source map.
   * @param {number} line The line number in the generated source.
   * @param {number} column The column number in the generated source.
   */
  originalPositionFor(id, line, column) {
    // Checking if the source map exists in the store
    if (typeof this.store[id] !== 'object') {
      throw 'Source map not found!';
    } else {
      let sourceMapObject = this.store[id];

      // Checking if the source map is already parsed.
      if (sourceMapObject.status === 'ready') {
        return sourceMapObject.originalPositionFor(line, column);
      } else {
        throw 'Source map not parsed yet';
      }
    }
  }
};
