import PurchasePackages from "../staticDbContent/PurchasePackages";
import * as log from "./log";
import SetupMultipleAdminDatabases from "./SetupMultipleAdminDatabases";

(async () => {
  const argv = process.argv;

  const argvArgPosition = 2;
  const dbs =
    argv.length >= argvArgPosition
      ? await SetupMultipleAdminDatabases(argv[argvArgPosition].replace(
          /-/g,
          "",
        ) as any)
      : await SetupMultipleAdminDatabases();

  for (const db of dbs) {
    await db.writePurchasePackage(PurchasePackages);
  }

  log.success("Completed purchase package update");
  process.exit(0);
})();
