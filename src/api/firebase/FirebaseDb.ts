export class FirebaseDb {

  // Always returns a number
  public static SafeAdd = (num1: number, num2: number) => {
    return (!num1 ? 0 : num1) + (!num2 ? 0 : num2);
  }

  // Always returns a number
  public static SafeSubtract = (num1: number, num2: number) => {
    return (!num1 ? 0 : num1) - (!num2 ? 0 : num2);
  }

  // Using any as this could be the client side db or the admin db
  private db: any;

  constructor(db) {
    this.db = db;
  }

  public pushNode = (url: string, pushObject: any): string => {
    const ref = this.db.ref(url);
    const newNode = ref.push();
    newNode.set(pushObject);
    return newNode.toString().split("/").slice(-1)[0];
  }

  public writeNode = (url: string, data: any): any => {
    return this.db.ref(url).set(data);
  }

  public readNode = (url: string): any => {
    return this.db.ref(url).once("value").then((snapshot) => {
      return snapshot.val();
    }).catch((error) => {
      console.error(error);
      return undefined;
    });
  }

  public updateNode = (url: string, updateFunction: (Object) => any) => {
    this.db.ref(url).transaction((currentData) => {
      return updateFunction(currentData ? currentData : {});
    });
  }

  public getRef = (url: string): any => {
    return this.db.ref(url);
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

export default FirebaseDb;
