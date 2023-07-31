const assert = require("assert");

class Scoreboard {
  id;
  home;
  homeScore = 0;
  away;
  awayScore = 0;
  updatedAt;

  constructor(id, home, away) {
    this.id = id;
    this.home = home;
    this.away = away;
    this.updatedAt = Date.now();
  }

  static fromString(str) {
    const obj = JSON.parse(str);
    assert.deepEqual(
      Object.keys(obj),
      ["id", "home", "homeScore", "away", "awayScore", "updatedAt"],
      "Failed to restore Scoreboard"
    );

    const board = new Scoreboard(obj.id, obj.home, obj.away);
    board.updatedAt = Date(obj.updatedAt);
    board.homeScore = parseInt(obj.homeScore, 10);
    board.awayScore = parseInt(obj.awayScore, 10);
    return board;
  }

  toString() {
    return JSON.stringify({ ...this });
  }
}

module.exports = Scoreboard;
