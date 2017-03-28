var inquirer = require('inquirer');
var exec = require('child_process').execSync;

var envUtils = require('./envUtils');

inquirer.prompt({
  type: "confirm",
  name: "herokuStatus",
  message: "Are you logged in to heroku?",
  default: true,
})
.then(function(answer){
  if(answer.herokuStatus){
    var env = envUtils.getCurrentEnv();

    // Heroku can set multiple config variables separated by spaces
    var config = Object.keys(env).map(function(key) {
      return key + '="' + env[key].replace(/\n/g, "\\n") + '"';
    }).join(" ");

    console.log("Preparing to set:\n" + config.replace(/\s/g, "\n"))

    var command = "heroku config:set " + config

    inquirer.prompt({
      type: 'confirm',
      name: 'doIt',
      message: "Are you sure you want to set these?"
    })
    .then(function(result){
      if(result.doIt){
        exec("heroku config:set " + config, function(err, stdout, stderr){
          console.log(stdout);
          console.log(stderr);
        })
      } else {
        console.log("Aborted setting env variables!")
      }
    })

  } else {
    console.log("Log in to heroku and run this again.");
  }
})
