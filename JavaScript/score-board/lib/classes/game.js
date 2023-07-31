const assert = require("assert");
const storage = require("../storage");

class Game {
  static increment = 0;

  constructor({id, home, away}) {
    this._id = id ? this.get(id) : this.create(home, away);
  }

  get(id) {
    const game = storage.get(id);
    assert(game, "Game is missing!");
    return game;
  }

  create(home, away) {
    const key = `${home}-${away}`;
    const check = storage.get(key);
    assert(!check, `Game is already started! Its ID: ${check}`);
    storage.set(key, ++Game.increment);
    // storage.set(increment, new Scoreboard(increment, home, away));
    return Game.increment;
  }

  get id() {
    return this._id;
  }
}

module.exports = Game;
