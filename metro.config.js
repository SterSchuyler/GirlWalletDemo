const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for resolving from the root directory
config.resolver.extraNodeModules = {
  '@': __dirname,
};

module.exports = config; 