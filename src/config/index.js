module.exports = {
  PORT: process.env.PORT || 3000,
  SOURCE_MAP_DELETE_TIMEOUT: 1000 * 60 * 60 * 24, // One day
  MAX_NUMBER_OF_SOURCE_MAPS: 5000,
  SOURCE_MAP_DELETE_INTERVAL: 1000 * 60, // One minute
};
