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

var filesToCommit = ["package.json", "package-lock.json", versionIOS.infoPlistFilename];

const updatePackageVersionInFile = (fname, versionNumber) => {
  var currentPackage = require(`../${fname}`);
  var packageWithUpdatedVersion = Object.assign({}, currentPackage, {
    version: versionNumber
  });

  jsonfile.writeFileSync(fname, packageWithUpdatedVersion, {spaces: 2});
}

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
      updatePackageVersionInFile("package.json", newVersion);
      updatePackageVersionInFile("package-lock.json", newVersion);

      versionIOS.run(newVersion);

      exec("git add " + filesToCommit.join(" "), {encoding: 'utf8'});
      exec(`git commit -m "v${newVersion}: ${nextAnswer.commitNote}"`);
      exec("git tag " + "v" + newVersion);
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
