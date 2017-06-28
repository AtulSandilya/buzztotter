import SetupAdminDb from "../firebaseServer/SetupAdminDb";
import FirebaseAdminDb from "./FirebaseAdminDb";
import * as log from "./log";
import parseEnv from "./parseEnv";
import * as prompt from "./prompt";

const SetupMultipleAdminDatabases = async (
  preselectedChoice?: "dev" | "production" | "both",
): Promise<any[]> => {
  const dbs = [];

  const dbChoice = preselectedChoice
    ? preselectedChoice
    : await prompt.getChoice("What database are we changing", [
        "dev",
        "production",
        "both",
      ]);

  const env = parseEnv();
  switch (dbChoice) {
    case "dev":
      dbs.push(new FirebaseAdminDb(SetupAdminDb(env.dev)));
      break;
    case "production":
      dbs.push(new FirebaseAdminDb(SetupAdminDb(env.production)));
      break;
    case "both":
      dbs.push(new FirebaseAdminDb(SetupAdminDb(env.dev)));
      // The second argument gives a name to the db after the default db has
      // been created. This is a requirement imposed by firebase.
      dbs.push(new FirebaseAdminDb(SetupAdminDb(env.production, "production")));
      break;
    default:
      log.failure(`Admin database choice '${dbChoice}' does not exist!`);
  }
  return dbs;
};

export default SetupMultipleAdminDatabases;
