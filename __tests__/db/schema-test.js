import {GetSchemaDbUrl} from '../../build/db/schema';

describe('database schema string creator', () => {
  it("creates a simple url string", () => {
    expect(GetSchemaDbUrl("users", "1234")).toEqual("users/1234");
  })

  it("creates a complicated url string", () => {
    expect(GetSchemaDbUrl("purchasedBevegrams.firebaseId.list", {
      firebaseId: "1234"
    })).toEqual("purchasedBevegrams/1234/list");
  })

  it("throws on invalid schema query", () => {
    expect(() => {
      GetSchemaDbUrl("badUrl", {"test": "test"});
    }).toThrowError();
  })

  it("replaces invalid characters", () => {
    const testChars = [
      [".", "_"],
      ["#", "!"],
      ["$", "?"],
      ["[", "{"],
      ["]", "}"],
      ["]", "}"],
    ];

    for (const testChar of testChars) {
      expect(GetSchemaDbUrl(
        "locationsByDegree.latitudeInDegrees.longitudeInDegrees",
        {latitudeInDegrees: `54${testChar[0]}54`, longitudeInDegrees: `54${testChar[0]}54`},
      )).toEqual(`locationsByDegree/54${testChar[1]}54/54${testChar[1]}54`);
    }
  })

  it("does not replace valid characters", () => {
    const testChars = [
      ["x", "x"],
    ];

    for (const testChar of testChars) {
      expect(GetSchemaDbUrl(
        "locationsByDegree.latitudeInDegrees.longitudeInDegrees",
        {latitudeInDegrees: `54${testChar[0]}54`, longitudeInDegrees: `54${testChar[0]}54`},
      )).toEqual(`locationsByDegree/54${testChar[1]}54/54${testChar[1]}54`);
    }
  })
})
