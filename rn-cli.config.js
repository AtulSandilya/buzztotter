// const blacklist = require('metro-bundler/src/blacklist');

// Don't include server related files in the app bundle.
// See https://github.com/facebook/react-native/issues/7271
module.exports = {
  getBlacklistRE: () => blacklist([
    /firebaseServer\/.*/,
    /admin\/.*/,
  ]),
};
