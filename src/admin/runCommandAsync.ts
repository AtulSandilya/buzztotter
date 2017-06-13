import * as child_process from "child_process";

import {message} from "./log";

const spawn = child_process.spawn;

const runCommandAsync = async (fullCommand: string, dir?: string): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    // Splitting the command on spaces fails when their are spaces inside of
    // quoted strings, but for the admin simplicity trumps correctness. If you
    // have a command with spaces within quotes uses spawn directly.
    const splitCommand = fullCommand.split(" ");
    const command = splitCommand[0];
    let args: string[];

    if (splitCommand.length > 1) {
      args = splitCommand.slice(1);
    }

    message(`Running ${fullCommand}...`);

    const thisProcess = spawn(command, args, {
      cwd: dir ? dir : __dirname,
      stdio: "inherit",
    });

    thisProcess.on("close", (exitStatus) => {
      if (exitStatus === 0) {
        resolve(exitStatus);
      } else {
        reject(`Command '${fullCommand}' returned with exit status ${exitStatus}!`);
      }
    });
  });
};

export default runCommandAsync;
