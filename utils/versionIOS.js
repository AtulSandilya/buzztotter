var exec = require('child_process').execSync;

var infoPlistFilename = "ios/Bevegram/Info.plist";
exports.infoPlistFilename = infoPlistFilename;
var plistBuddy = "/usr/libexec/PlistBuddy -c "

function execPlistBuddy(args) {
  return exec(plistBuddy + '"' + args + '" ' + infoPlistFilename, {encoding: 'utf8'});
}

exports.run  = function(newVersion) {
  var buildNumber = parseInt(execPlistBuddy("Print CFBundleVersion").trim()) + 1;

  execPlistBuddy("Set :CFBundleShortVersionString " + newVersion);
  execPlistBuddy("Set :CFBundleVersion " + buildNumber);
}
