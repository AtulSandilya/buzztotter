var inquirer = require('inquirer');
var Promise = require('bluebird');
var envUtils = require('./envUtils');

inquirer.prompt([{
  type: 'input',
  name: 'jsonFile',
  message: "Input the json file you want add to your environment vars",
}, {
  type: 'input',
  name: 'prefix',
  message: 'Input the prefix you want for these config variables (will be converted to uppercase)',
}]).then(function(answers) {
  var startingInputObject = require('../' + answers.jsonFile);
  var keys = Object.keys(startingInputObject);

  // Format the input json object with `createEnvKey` into inputObject
  var inputObject = {}
  for(var i = 0; i < keys.length; i++){
      var key = keys[i];
      inputObject[envUtils.createEnvKey(key, answers.prefix)] = startingInputObject[key];
  }

  var currentEnv = envUtils.getCurrentEnv();

  if(currentEnv === undefined) {
    currentEnv = {};
  }

  console.log("Writing env variables to " + envUtils.envVarFile + "...");

  var inputKeys = Object.keys(inputObject)

  Promise.map(inputKeys, function(key) {
    if(currentEnv[key] !== undefined){
      return inquirer.prompt({
        type: 'confirm',
        name: 'overwriteVal',
        message: "Key '" + key + "' already exists in " + envUtils.envVarFile + "! Would you like to overwrite it?"
      })
      .then(function(result){
        if(result.overwriteVal){
          delete inputObject[key];
        }
    });
  }
  }, {concurrency: 1})
  .then(function(res){
    var newEnv = Object.assign({}, currentEnv, inputObject);
    var newEnvList = Object.keys(newEnv).map(function(key) {
      return envUtils.createEnvLine(key, newEnv[key]);
    })
    envUtils.writeListToFile(envUtils.envVarFile, newEnvList);
    console.log("Successfully updated '" + envUtils.envVarFile + "'!");
  });
})
.catch(function(error) {
    console.log(error);
})

