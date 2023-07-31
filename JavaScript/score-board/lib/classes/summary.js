const storage = require("../storage");
const Game = require("./game");
const Scoreboard = require("./scoreboard");

class Summary {
  static getAll() {
    const result = [];
    for (let i = 0; i <= Game.increment; i++) {
      const str = storage.get(i);
      if (str) {
        result.push(Scoreboard.fromString(str));
      }
    }
    result.sort((a, b) => {
      const keyA = a.homeScore + a.awayScore;
      const keyB = b.homeScore + b.awayScore;
      if (keyA === keyB) {
        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
      }
      return keyB - keyA;
    });
    return result;
  }

  static getActive() {
    return Summary.getAll().filter((board) => storage.get(board.key()));    
  }
}

module.exports = Summary;
