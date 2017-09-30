import FirebaseServerDb from "../firebaseServer/FirebaseServerDb";
import SetupAdminDb from "../firebaseServer/SetupAdminDb";
import FirebaseAdminDb from "./FirebaseAdminDb";
import * as log from "./log";
import parseEnv from "./parseEnv";
import * as prompt from "./prompt";

type DbType = "dev" | "devServer" | "production" | "productionServer" | "both";

const getDbChoice = async (): Promise<DbType> => {
  // Specifically dont include server databases, they are used for specific
  // purposes and are not a user selectable choice
  return (await prompt.getChoice("Select database", [
    "dev",
    "production",
    "both",
  ])) as DbType;
};

const SetupMultipleAdminDatabases = async (
  preselectedChoice?: DbType,
): Promise<any[]> => {
  const dbs = [];

  const dbChoice = preselectedChoice ? preselectedChoice : await getDbChoice();

  const env = parseEnv();
  switch (dbChoice) {
    case "dev":
      dbs.push(new FirebaseAdminDb(SetupAdminDb(env.dev)));
      break;
    case "devServer":
      dbs.push(new FirebaseServerDb(SetupAdminDb(env.dev)));
      break;
    case "production":
      dbs.push(new FirebaseAdminDb(SetupAdminDb(env.production)));
      break;
    case "productionServer":
      dbs.push(new FirebaseServerDb(SetupAdminDb(env.production)));
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

export const SelectAdminDatabase = async () => {
  const dbChoice = await getDbChoice();
  const dbs = await SetupMultipleAdminDatabases(dbChoice);
  return {
    db: dbs[0],
    dbChoice,
  };
};

export default SetupMultipleAdminDatabases;
