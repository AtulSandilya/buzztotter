export class FirebaseDb {
  // Always returns a number
  public static SafeAdd(num1: number, num2: number) {
    return (!num1 ? 0 : num1) + (!num2 ? 0 : num2);
  }

  // Always returns a number
  public static SafeSubtract(num1: number, num2: number) {
    return (!num1 ? 0 : num1) - (!num2 ? 0 : num2);
  }

  public static RemoveUndefinedValues(input: any) {
    let result;
    const isUndefined = (val): boolean => {
      return !val && val !== false && val !== 0;
    };

    try {
      if (isUndefined(input)) {
        throw new FirebaseInvalidInputError(
          `Firebase cannot directly write undefined values`,
        );
      }

      let throwWhenFinished = false;
      const undefinedKeys = [];
      result = JSON.parse(
        JSON.stringify(input, (jsonKey, value) => {
          if (isUndefined(value)) {
            throwWhenFinished = true;
            undefinedKeys.push(jsonKey);
            return undefined;
          }
          return value;
        }),
        (jsonKey, value) => {
          if (value instanceof Array) {
            return value.filter(x => {
              if (isUndefined(x)) {
                throwWhenFinished = true;
                undefinedKeys.push(`Array: ${jsonKey}`);
                return;
              }
              return x;
            });
          } else if (
            typeof value === "object" &&
            value !== null &&
            Object.keys(value).length === 0
          ) {
            return;
          } else {
            return value;
          }
        },
      );

      if (throwWhenFinished) {
        throw new FirebaseUndefinedInObjectError(
          `Input has undefined value for key(s) '${undefinedKeys.join(", ")}'`,
        );
      }

      return input;
    } catch (e) {
      if (e.name === "FirebaseUndefinedInObjectError") {
        if ((!result && result !== false) || Object.keys(result).length === 0) {
          throw new FirebaseInvalidInputError(
            `Firebase cannot write an object which stringifies to undefined`,
          );
        } else {
          console.error(e);
          return result;
        }
      } else {
        throw e;
      }
    }
  }

  public static SanitizeDbInput(input: any) {
    try {
      return FirebaseDb.RemoveUndefinedValues(input);
    } catch (e) {
      throw e;
    }
  }

  // Using any as this could be the client side db or the admin db
  protected db: any;

  constructor(db) {
    this.db = db;
  }

  public pushNode(url: string, pushObject: any): string {
    try {
      const sanitizedPushInput = FirebaseDb.SanitizeDbInput(pushObject);
      const ref = this.db.ref(url);
      const newNode = ref.push();
      newNode.set(sanitizedPushInput);
      return newNode
        .toString()
        .split("/")
        .slice(-1)[0];
    } catch (e) {
      console.error(e);
    }
  }

  public writeNode(url: string, data: any): any {
    try {
      const sanitizedData = FirebaseDb.SanitizeDbInput(data);
      return this.db.ref(url).set(sanitizedData);
    } catch (e) {
      console.error(e);
    }
  }

  public async readNode(url: string): Promise<any> {
    try {
      const ref = this.getRef(url);
      const response = await this.db.ref(url).once("value");
      return response.val();
    } catch (e) {
      console.warn(e.message);
      return;
    }
  }

  public updateNode(url: string, updateFunction: (Object) => any) {
    this.db.ref(url).transaction(currentData => {
      return updateFunction(currentData ? currentData : {});
    });
  }

  public getRef(url: string): any {
    const ref = this.db.ref(url);
    if (!ref) {
      throw new FirebaseUndefinedReferenceError(
        `Cannot read from '${url}' because it is undefined`,
      );
    } else {
      return ref;
    }
  }

  public async queryInList(
    url: string,
    key: any,
    query: string | number | boolean,
  ): Promise<any> {
    const result = await this.db
      .ref(url)
      .orderByChild(key)
      .equalTo(query)
      .once("value");
    return result.val();
  }
}

/* tslint:disable:max-classes-per-file */
class FirebaseInvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "FirebaseInvalidInputError";
  }
}

class FirebaseUndefinedInObjectError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "FirebaseUndefinedInObjectError";
  }
}

class FirebaseUndefinedReferenceError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "FirebaseUndefinedReferenceError";
  }
}

export default FirebaseDb;
