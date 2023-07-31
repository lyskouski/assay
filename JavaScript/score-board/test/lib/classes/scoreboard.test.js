const {assert} = require("chai");
const Scoreboard = require("../../../lib/classes/scoreboard");

describe("Scoreboard", () => {
  it("Should restore state from stringified JSON", () => {
    const data = {
      id: 1,
      home: "Team A",
      homeScore: 1,
      away: "Team B",
      awayScore: 2,
      updatedAt: Date(),
    };
    const str = JSON.stringify(data);
    const obj = Scoreboard.fromString(str);
    for (const key in Object.keys(data)) {
      assert.equal(data[key], obj[key]);
    }
    assert.equal(str, obj.toString());
  });

  it("Should fail to update scores on corrupted data", () => {
    const obj = new Scoreboard(1, "Team A", "Team B");
    assert.throws(
      () => obj.set('null', 'null'),
      "`home`-attribute is not recognized as a positive number"
    );
    assert.throws(
      () => obj.set(1, -1),
      "`away`-attribute is not recognized as a positive number"
    );
  });

  it("Should assert nullable values but convert them to zeros", () => {
    const obj = new Scoreboard(1, "Team A", "Team B");
    obj.set(null, null);
    assert.equal(obj.homeScore, 0);
    assert.equal(obj.awayScore, 0);
  });
  
  it("Should assert nullable values but convert them to zeros", () => {
    const obj = new Scoreboard(1, "Team A", "Team B");
    obj.set(2, 1);
    assert.equal(obj.homeScore, 2);
    assert.equal(obj.awayScore, 1);
    assert.equal(obj.updatedAt, Date());
  });

  it("Should return scoreboard", () => {
    const obj = new Scoreboard(1, "Team A", "Team B");
    obj.set(2, 1);
    assert.equal(obj.scores(), 'Team A - Team B: 2 - 1');
  });
});
