const blacklist = require('react-native/packager/blacklist');

// Don't include server related files in the app bundle.
// See https://github.com/facebook/react-native/issues/7271
module.exports = {
  getBlacklistRE: () => blacklist([
    /firebaseServer\/.*/,
    /firebaseServerSecrets.js/,
    /api\/notifications.js/,
  ]),
};
