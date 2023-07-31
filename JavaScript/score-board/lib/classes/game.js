const assert = require("assert");
const storage = require("../storage");
const Scoreboard = require("./scoreboard");

class Game {
  static increment = 0;
  board = null;

  constructor({id, home, away}) {
    this._id = id ? this._get(id) : this._create(home, away);
  }

  _get(id) {
    const json = storage.get(id);
    assert(json, "Game is missing!");
    this.board = Scoreboard.fromString(json);
    return this.board.id;
  }

  _create(home, away) {
    this.board = new Scoreboard(0, home, away);
    const key = this.board.key();
    const check = storage.get(key);
    assert(!check, `Game is already started! Its ID: ${check}`);
    storage.set(key, ++Game.increment);
    this.board.id = Game.increment;
    storage.set(Game.increment, this.board.toString());
    return Game.increment;
  }

  save() {
    storage.set(this.board.id, this.board.toString());
  }

  close() {
    const key = this.board.key();
    const check = storage.get(key);
    assert(check, `Game with ID#${this.board.id} is already finished!`);
    storage.delete(key);
  }

  get id() {
    return this._id;
  }
}

module.exports = Game;
