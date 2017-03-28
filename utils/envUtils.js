var fs = require('fs');

exports.createEnvKey = function(key, prefix) {
  if(key.indexOf(prefix.toUpperCase()) !== -1){
    return key;
  }

  return prefix.toUpperCase() + "_" + key;
}

exports.createEnvLine = function(key, value) {
  // dotenv needs env var to be one line so conversion from newline to a
  // literal "\n" is necessary
  var newlineConvertedValue = value.replace(/\n/g, "\\n");
  return key + '="' + newlineConvertedValue + '"';
}

exports.getCurrentEnv = function() {
  // Use dot env to get the current `.env` as an object
  return require('dotenv').config().parsed;
}

exports.writeListToFile = function(filename, list) {
  var fileString = list.join("\n");
  return fs.writeFileSync(filename, fileString);
}

exports.envVarFile = ".env";
