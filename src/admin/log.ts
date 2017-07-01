import * as colors from "colors";

/* tslint:disable:no-console */
export const message = (input: string) => console.log(colors.blue.bold(input));
export const success = (input: string) => console.log(colors.green.bold(input));
export const failure = (input: string) =>
  console.log("\n" + colors.red.bold(input));
