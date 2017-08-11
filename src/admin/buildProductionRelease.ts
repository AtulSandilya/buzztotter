import * as child_process from "child_process";
import * as fs from "fs-extra";
import * as path from "path";

import * as moment from "moment";

import * as prompt from "./prompt";

import BuzzBuilder from "./BuzzBuilder";
import BuzzPath from "./BuzzPath";

import { failure, message, success } from "./log";
import parseEnv from "./parseEnv";
import runCommandAsync from "./runCommandAsync";

// Things this script needs to do
// Verify this a new release (build number is incremented)
// Run all the tests
// Rename publicApiKeys.ts to use production keys in app js
// Build android dev and release versions
// Build ios dev and release versions
// GREP the bundles (where is the ios one) for server keys / verify the
// correct keys were used in the app
// Deploy firebase rules to all dbs
// Push .env-production to heroku
// Deploy to heroku production

const testJS = async () => {
  await runCommandAsync("npm test");
};

const testAndroid = async (androidPath: string) => {
  try {
    await runCommandAsync("adb uninstall com.buzzotter");
  } catch (e) {
    // continue
  }

  await runCommandAsync("./gradlew connectedAndroidTest", androidPath);
};

const updateFirebaseRules = async () => {
  const firebaseAppNames = ["buzzotter-test", "buzzotter-beta"];
  for (const firebaseApp of firebaseAppNames) {
    await runCommandAsync(`firebase use ${firebaseApp}`);
    await runCommandAsync(`firebase deploy`);
  }
  await runCommandAsync(`firebase use ${firebaseAppNames[0]}`);
};

interface Env {
  dev: object;
  production: object;
}

const checkAndroidBundleForEnvKeys = async (buzzPath: BuzzPath) => {
  const env: Env = parseEnv();
  const unzipFolder = "unzippedAPK";
  const releaseTypes = ["dev", "production"];

  try {
    for (const releaseType of releaseTypes) {
      const androidReleaseFName = buzzPath.buildReleaseName(
        "android",
        releaseType as any,
      );

      await runCommandAsync(
        `unzip ${androidReleaseFName} -d ${unzipFolder}`,
        buzzPath.dir.androidRelease,
      );

      const bundlePath = path.join(
        buzzPath.dir.androidRelease,
        unzipFolder,
        "assets",
        "index.android.bundle",
      );
      const firebaseEnvKeyPrefix = "FIREBASE_ADMIN_KEY_";
      const keysToSkip = [
        `${firebaseEnvKeyPrefix}project_id`,
        `${firebaseEnvKeyPrefix}firebaseDatabaseURL`,
      ];

      fs.readFile(bundlePath, (err, data) => {
        Object.keys(env[releaseType]).map(key => {
          if (keysToSkip.indexOf(key) !== -1) {
            return;
          }

          const val = env[releaseType][key];
          if (data.indexOf(val) !== -1) {
            throw new Error(
              `Env var '${key}' value '${val}' exists in android bundle file`,
            );
          }
        });
      });

      await runCommandAsync(
        `rm -rf ${unzipFolder}`,
        buzzPath.dir.androidRelease,
      );
    }
  } catch (e) {
    throw e;
  } finally {
    await runCommandAsync(`rm -rf ${unzipFolder}`, buzzPath.dir.androidRelease);
  }
};

const deployHeroku = async () => {
  const stringifyEnv = (inputEnv: { [key: string]: string }): string => {
    const result = [];
    Object.keys(inputEnv).map(key =>
      result.push(`${key}="${inputEnv[key.replace(/\n/g, "\\n")]}"`),
    );
    return result.join(" ");
  };

  const env = parseEnv();

  const herokuAppNames = {
    "buzzotter-firebase-queue-beta": env.production,
    "buzzotter-firebase-queue-test": env.dev,
  };

  for (const appKey of Object.keys(herokuAppNames)) {
    // execSync avoids any problems with env keys with spaces
    child_process.execSync(
      `heroku config:set ${stringifyEnv(
        herokuAppNames[appKey],
      )} --app ${appKey}`,
    );
  }

  const gitRemoteBranches = ["heroku", "heroku-production"];

  for (const gitRemoteBranch of gitRemoteBranches) {
    await runCommandAsync(`git push ${gitRemoteBranch} master`);
  }
};

const writePurchasePackages = async () => {
  await runCommandAsync("npm run-script writePurchasePackages -- --both");
};

const formatDuration = (startInUnixMs: number): string => {
  const timeUnits = ["hours", "minutes", "seconds"];
  const dur = moment.duration(Date.now() - startInUnixMs);
  const result = [];
  timeUnits.map(unit => {
    const time = dur.get(unit as any);
    if (isNaN(time) || time === 0) {
      return;
    } else if (unit === "seconds") {
      result.push(`${time}.${dur.get("ms")} ${unit}`);
    } else if (time === 1) {
      result.push(`${time} ${unit.slice(0, -1)}`);
    } else {
      result.push(`${time} ${unit}`);
    }
  });
  return result.join(" ");
};

(async () => {
  const start = Date.now();
  try {
    /* tslint:disable:no-var-requires */
    const version = require("../../package.json").version;
    message(`Starting version ${version} production build...`);

    const cont = await prompt.confirm(
      "Is the android emulator running with gps turned on",
    );
    if (!cont) {
      throw new Error(`User exited production build!`);
    }

    const buzzPath = new BuzzPath(version);
    await buzzPath.setup();
    message(buzzPath.filename.androidProductionRelease);
    const buzzBuilder = new BuzzBuilder(buzzPath.dir, buzzPath.filename);

    await testJS();
    await testAndroid(buzzPath.dir.android);

    await buzzBuilder.buildAndroidDev();
    await buzzBuilder.buildAndroidProduction();

    await checkAndroidBundleForEnvKeys(buzzPath);

    await writePurchasePackages();
    await updateFirebaseRules();
    await deployHeroku();

    success(`Production build completed in ${formatDuration(start)}!`);
  } catch (e) {
    failure(
      `Production build failed in ${formatDuration(
        start,
      )}!\n\n${e}\n\nSee above for details.`,
    );
  }
  process.exit(0);
})();
