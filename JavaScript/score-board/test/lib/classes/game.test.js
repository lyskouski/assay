const { assert } = require("chai");
const sinon = require("sinon");
const storage = require("../../../lib/storage");
const Game = require("../../../lib/classes/game");

describe("Game", () => {
  const board = {
    id: 1,
    home: "Team A",
    homeScore: 1,
    away: "Team B",
    awayScore: 2,
    updatedAt: Date(),
  };

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
    const str = JSON.stringify(board);
    sinon.stub(storage, "get").returns(str);
    const game = new Game({ id: 1 });
    assert.equal(game.board.toString(), str);
  });

  it("Should fail to close missing game", () => {
    sinon.stub(storage, "get").returns(null);
    assert.throws(() => new Game({ id: 1 }).close(), "Game is missing!");
  });

  it("Should fail to update closed game", () => {
    const stub = sinon.stub(storage, "get");
    stub.withArgs(1).returns(JSON.stringify(board));
    stub.withArgs('Team A-Team B').returns(null);
    assert.throws(() => new Game({ id: 1 }).save(), "Game is already finished! Scores cannot be updated");
  });

  it("Should fail to close finished game", () => {
    const stub = sinon.stub(storage, "get");
    stub.withArgs(1).returns(JSON.stringify(board));
    stub.withArgs("Team A-Team B").returns(null);
    assert.throws(
      () => new Game({ id: 1 }).close(),
      "Game with ID#1 is already finished!"
    );
  });

  it("Should remove a game from an active scope", () => {
    const stub = sinon.stub(storage, "get");
    stub.withArgs(1).returns(JSON.stringify(board));
    stub.withArgs("Team A-Team B").returns(1);
    const spy = sinon.spy(storage, "delete");
    new Game({ id: 1 }).close();
    assert(spy.calledOnce);
  });
});
