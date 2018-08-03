const shortid = require('shortid');
const SourceMap = require('./sourcemap');

module.exports = class {
  constructor() {
    this.store = {};
  }

  /**
   * Adds a source map to the store and returns the id in the store.
   * Also starts the parsing of the sourcemap.
   * @param {String} sourceMapJSON A sourcemap in JSON format
   * @return {String} The id of the source map in the store.
   */
  add(sourceMapJSON) {
    let id = shortid.generate();
    this.store[id] = new SourceMap(sourceMapJSON);
    return id;
  }

  /**
   * Removes a source map from the store.
   * @param {String} id The id of a source map in the store.
   */
  delete(id) {
    this.store[id] = undefined;
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
        throw 'Source map not parsed yet'
      }
      
    }
  }
};
