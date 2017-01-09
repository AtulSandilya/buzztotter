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
})
