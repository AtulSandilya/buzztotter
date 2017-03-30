var exec = require('child_process').execSync;
var semver = require('semver');
var inquirer = require('inquirer');
var jsonfile = require('jsonfile');

var versionIOS = require('./versionIOS');
var currentVersion = require('../package').version;

var incrementChoices = {}
incrementChoices["patch '" + semver.inc(currentVersion, "patch") + "'"] = "patch"
incrementChoices["minor '" + semver.inc(currentVersion, "minor") + "'"] = "minor"
incrementChoices["major '" + semver.inc(currentVersion, "major") + "'"] = "major"

var filesToCommit = ["package.json", versionIOS.infoPlistFilename];

function hasCleanGitStatus() {
  var status = exec("git status --porcelain", {encoding: 'utf8'}).trim();
  return status === "";
}

if(hasCleanGitStatus()){
  inquirer.prompt({
    type: "list",
    choices: Object.keys(incrementChoices),
    name: "versionIncrement",
    message: "Updating current version: " + currentVersion + "\nChoose the versioning increment",
  })
  .then(function(answer) {
    console.log(answer.versionIncrement);
    var newVersion = semver.inc(currentVersion, incrementChoices[answer.versionIncrement]);
    inquirer.prompt({
      type: 'input',
      name: 'commitNote',
      message: 'What features are included in version ' + newVersion + ':'
    })
    .then(function(nextAnswer) {
      console.log(nextAnswer.commitNote);
      console.log(newVersion);
      var currentPackage = require('../package');
      var packageWithUpdatedVersion = Object.assign({}, currentPackage, {
        version: newVersion
      });

      jsonfile.writeFileSync("package.json", packageWithUpdatedVersion, {spaces: 2});
      versionIOS.run(newVersion);

      console.log("git add " + filesToCommit.join(" "));
      exec("git add " + filesToCommit.split(" "), {encoding: 'utf8'});
      console.log("git tag -a " + "v" + newVersion + " -m " + nextAnswer.commitNote);
      exec("git tag -a " + "v" + newVersion + " -m " + nextAnswer.commitNote, {encoding: 'utf8'});
      console.log("Updated version to " + newVersion + " with message " + nextAnswer.commitNote);
    }).catch((error) => {
      console.log("Inner error", error);
    })

  }).catch((error) => {
    console.log("Unable to update version! Error: ", error);
  })
} else {
  console.log("This command needs a clean git status, please commit then try again!");
}
