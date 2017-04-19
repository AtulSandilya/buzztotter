const inquirer = require('inquirer');
const updateFirebaseWithJson = require('./updateFirebaseWithJson');
const purchasePackages = require('../serverBuild/staticDbContent/PurchasePackages').default;

const purchasePackagesUrl = "purchasePackages";

inquirer.prompt({
  type: 'confirm',
  name: "shouldUpdate",
  message: `Are you sure you want to write: ${JSON.stringify(purchasePackages, null, 2)} to url '${purchasePackagesUrl}'?`
}).then((answers) => {
  if(answers.shouldUpdate) {
    updateFirebaseWithJson.writeJsonToFirebase(purchasePackagesUrl, purchasePackages);
    console.log("Press <C-c> to quit!");
  }
});
