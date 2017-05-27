import * as child_process from "child_process";
import * as fs from "fs";

import firebaseDbRules from "./firebaseDbRules";

const exec = child_process.spawnSync;

const firebaseDbRulesFilename = "firebaseDbRules.json";
const firebaseConfigFilename = "firebase.json";

const firebaseConfig = {
  database: {
    rules: firebaseDbRulesFilename,
  },
};

const jsonWhitespace = 2;
/* tslint:disable:no-console */
console.log(`Writing firebase db rules to ${firebaseDbRulesFilename}...`);
fs.writeFileSync(firebaseDbRulesFilename, JSON.stringify(firebaseDbRules, null, jsonWhitespace));
console.log(`Updating ${firebaseConfigFilename}...`);
fs.writeFileSync(firebaseConfigFilename, JSON.stringify(firebaseConfig, null, jsonWhitespace));

console.log("Deploying rules to firebase...");
console.log("This can take up to a minute...");
const firebaseDeploy = exec("firebase", ["deploy"]);

console.log(firebaseDeploy.output.toString());

if (firebaseDeploy.status !== 0) {
  /* tslint:disable:max-line-length */
  console.log(
    `"firebase deploy" failed! This is most likely due to a syntax error within a db rules string. Check the rules and try again.`,
  );
} else {
  console.log("Firebase db rule deploy complete!");
}
