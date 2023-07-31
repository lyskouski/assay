const {assert} = require("chai");
const Scoreboard = require("../../../lib/classes/scoreboard");

describe("Scoreboard", () => {
  it("Should restore state from stringified JSON", () => {
    const data = {
        id: 1,
        home: 'Team A',
        homeScore: 1,
        away: 'Team B',
        awayScore: 2,
        updatedAt: Date()
    };
    const str = JSON.stringify(data);
    const obj = Scoreboard.fromString(str);
    for (const key in Object.keys(data)) {
        assert.equal(data[key], obj[key]);
    }
    assert.equal(str, obj.toString());
  });
});
