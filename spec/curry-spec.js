var buster = require("buster")
  , expect = buster.expect;

buster.spec.expose();

describe("A module", function () {
  it("states the obvious", function () {
    expect(true).toEqual(true);
  });
});