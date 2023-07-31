const { assert } = require("chai");
const sinon = require("sinon");
const storage = require("../../../lib/storage");
const Summary = require("../../../lib/classes/summary");
const Game = require("../../../lib/classes/game");

describe("Summary", () => {
  let stub;

  afterEach(() => {
    sinon.restore();
    Game.increment = 0;
  });

  beforeEach(() => {
    stub = sinon.stub(storage, "get");
    stub.withArgs(1).returns(
      JSON.stringify({
        id: 0,
        home: "Team A",
        homeScore: 1,
        away: "Team B",
        awayScore: 2,
        updatedAt: '2023-07-29',
      })
    );
    stub.withArgs(2).returns(
      JSON.stringify({
        id: 1,
        home: "Team C",
        homeScore: 3,
        away: "Team B",
        awayScore: 2,
        updatedAt: Date(),
      })
    );
    stub.withArgs(3).returns(
      JSON.stringify({
        id: 2,
        home: "Team A",
        homeScore: 1,
        away: "Team C",
        awayScore: 2,
        updatedAt: '2023-07-30',
      })
    );
  });

  it("Should return all games, ordered by total score, or by the most recently added if equal", () => {
    Game.increment = 3;
    const scope = Summary.getAll();
    assert.equal(scope.length, 3);
    assert.equal(scope[0].id, 1);
    assert.equal(scope[1].id, 2);
    assert.equal(scope[2].id, 0);
  });

  it("Should return active games, ordered by total score, or by the most recently added if equal", () => {
    Game.increment = 3;
    stub.withArgs('Team A-Team B').returns(1);
    stub.withArgs('Team C-Team B').returns(1);
    stub.withArgs('Team A-Team C').returns(null);
    const scope = Summary.getActive();
    assert.equal(scope.length, 2);
    assert.equal(scope[0].id, 1);
    assert.equal(scope[1].id, 0);
  });
});
