import * as dotenv from "dotenv";

interface Env {
  dev: object;
  production: object;
}

const parseEnv = (): Env => {
  // Keys starting with "PRODUCTION_" should be excluded from the heroku
  // dev/test deploy, and vice versa
  const productionPrefix = "PRODUCTION_";
  const env = dotenv.config().parsed;

  const dev = {};
  const production = {};

  Object.keys(env).map((envKey) => {
    const sanitizedVal = env[envKey].replace(/\n/g, "\\n");
    if (envKey.indexOf(productionPrefix) !== -1) {
      production[envKey.replace(productionPrefix, "")] = sanitizedVal;
    } else {
      dev[envKey] = sanitizedVal;
    }
  });
  return {
    dev,
    production,
  };
};

export default parseEnv;
