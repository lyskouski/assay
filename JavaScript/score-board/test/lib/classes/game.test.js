const { assert } = require("chai");
const sinon = require("sinon");
const storage = require("../../../lib/storage");
const Game = require("../../../lib/classes/game");

describe("Game", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should create a new game instance", () => {
    sinon.stub(storage, "get").returns(undefined);
    const game = new Game({ home: "TeamA", away: "TeamB" });
    assert.strictEqual(game.id, 1);
  });

  it("Should fail with a notification by trying to create existing game", () => {
    sinon.stub(storage, "get").returns(2);
    assert.throws(
      () => new Game({ home: "TeamA", away: "TeamB" }),
      "Game is already started! Its ID: 2"
    );
  });

  it("Should return a board for existing game", () => {
    const str = JSON.stringify({
      id: 1,
        home: 'Team A',
        homeScore: 1,
        away: 'Team B',
        awayScore: 2,
        updatedAt: Date()
    });
    sinon.stub(storage, "get").returns(str);
    const game = new Game({ id: 1 });
    assert.equal(game.board.toString(), str);
  });
});
