import * as inquirer from "inquirer";

export const getString = async (message): Promise<string> => {
  const result = await inquirer.prompt({
    message: `${message}:`,
    name: "answer",
    type: "input",
  });
  return result.answer;
};

export const getInteger = async (message): Promise<number> => {
  const result = await inquirer.prompt({
    message: `${message}:`,
    name: "answer",
    type: "input",
    validate: input => {
      if (isNaN(input as any)) {
        return `'${message}' requires a number for the answer!`;
      } else {
        return true;
      }
    },
  });
  const base10 = 10;
  return parseInt(result.answer, base10);
};

export const confirm = async (message: string) => {
  const result = await inquirer.prompt({
    message: `${message}?`,
    name: "answer",
    type: "confirm",
  });
  return result.answer;
};

export const getChoice = async (
  message: string,
  choices: string[],
): Promise<string> => {
  const result = await inquirer.prompt({
    choices,
    message: `${message}?`,
    name: "answer",
    type: "list",
  });
  return result.answer;
};

const untilCorrect = async (
  promptFunc: () => any,
  isCorrectMessage?: string,
) => {
  while (true) {
    const answer = await promptFunc();
    const shouldExit = await confirm(
      isCorrectMessage ? isCorrectMessage : `Is "${answer}" correct`,
    );
    if (shouldExit) {
      return answer;
    }
  }
};

export const getStringUntilCorrect = async (
  message: string,
  isCorrectMessage?: string,
) => {
  return await untilCorrect(async () => {
    return await getString(message);
  }, isCorrectMessage);
};

export const getIntegerUntilCorrect = async (message: string) => {
  return await untilCorrect(async () => {
    return await getInteger(message);
  });
};
