import FirebaseDb from '../../build/api/firebase/FirebaseDb';

console.error = function() {};

describe("Firebase db handles objects with undefined values properly", () => {
  it("handles an undefined input", () => {
    expect(() => FirebaseDb.SanitizeDbInput(undefined)).toThrowError(/Firebase cannot directly write undefined values/);
  });

  it("handles a null input", () => {
    expect(() => FirebaseDb.SanitizeDbInput(null)).toThrowError(/Firebase cannot directly write undefined values/);
  });

  it("handles primitive inputs properly", () => {
    expect(FirebaseDb.SanitizeDbInput(true)).toEqual(true);
    expect(FirebaseDb.SanitizeDbInput(false)).toEqual(false);
    expect(FirebaseDb.SanitizeDbInput(5)).toEqual(5);
    expect(FirebaseDb.SanitizeDbInput(55.5)).toEqual(55.5);
    expect(FirebaseDb.SanitizeDbInput("Value")).toEqual("Value");
  })

  it("throws if an object has one value which is undefined", () => {
    const input = {val: undefined};
    expect(() => FirebaseDb.SanitizeDbInput(input)).toThrowError(/Firebase cannot write an object which stringifies to undefined/);
  });

  it("sanitizes an undefined value from an object", () => {
    const input = {
      name: "string",
      test: undefined,
    }

    const output = {
      name: "string",
    }

    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("throws when an object has all undefined values", () => {
    const input = {
      name: undefined,
      test: undefined,
    }

    expect(() => FirebaseDb.SanitizeDbInput(input)).toThrowError(/Firebase cannot write an object which stringifies to undefined/);
  });

  it("sanitizes an undefined inside a nested object", () => {
    const input = {
      name: "string",
      test: {
        thing: "test",
        obj: {
          val: 2,
          thing: undefined,
        }
      }
    }

    const output = {
      name: "string",
      test: {
        thing: "test",
        obj: {
          val: 2,
        }
      }
    }

    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("sanitizes an undefined inside a nested nested object", () => {
    const input = {
      name: "string",
      test: {
        thing: "test",
        obj: {
          val: 2,
          thing: {
            title: "thing",
            word: undefined,
          },
        }
      }
    }

    const output = {
      name: "string",
      test: {
        thing: "test",
        obj: {
          val: 2,
          thing: {
            title: "thing",
          },
        }
      }
    }

    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("passes with a valid nested object", () => {
    const input = {
      name: "string",
      test: {
        thing: "test",
        obj: {
          val: 2,
          thing: "string",
        }
      }
    }

    const output = {
      name: "string",
      test: {
        thing: "test",
        obj: {
          val: 2,
          thing: "string",
        }
      }
    }

    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("handles an valid array", () => {
    const input = [1, 1];
    const output = [1, 1];
    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("handles an array with an undefined value", () => {
    const input = [1, undefined];
    const output = [1];
    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("handles a nested array with an undefined value", () => {
    const input = [1, [1, 2, undefined]];
    const output = [1, [1, 2]];
    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("handles an object nested within an array with an undefined value", () => {
    const input = [{val: true}, {val: undefined}];
    const output = [{val: true}];
    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });

  it("handles null values like undefined values", () => {
    const input = [{val: true}, {val: null}];
    const output = [{val: true}];
    expect(FirebaseDb.SanitizeDbInput(input)).toEqual(output);
  });
})
