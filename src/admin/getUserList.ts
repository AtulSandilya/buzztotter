import * as fs from "fs";

import { User } from "../db/tables";
import * as log from "./log";
import { SelectAdminDatabase } from "./SetupMultipleAdminDatabases";

interface Users {
  [firebaseUserId: string]: User;
}

export interface BriefUser {
  firebaseUserId: string;
  name: string;
  email: string;
  gcmId: string;
}

export const userJsonFile = "users.json";

const main = async () => {
  const { db, dbChoice } = await SelectAdminDatabase();
  log.message("Fetching all users...");
  const users: Users = await db.getAllUsers();
  const briefUsers: BriefUser[] = Object.keys(users).map(firebaseUserId => {
    return {
      email: users[firebaseUserId].email,
      firebaseUserId,
      gcmId: users[firebaseUserId].fcmToken,
      name: users[firebaseUserId].fullName,
    };
  });
  log.success("User fetch successful!");
  log.message(`Writing users to ${userJsonFile}`);

  const jsonSpaces = 2;
  fs.writeFileSync(
    userJsonFile,
    JSON.stringify({ users: briefUsers, dbChoice }, null, jsonSpaces),
  );
};

(async () => {
  await main();
  process.exit(0);
})();
