const assert = require("assert");
const Game = require("./classes/game");

function handler(args) {
  switch (true) {
    case "start" in args:
      return createGame(args);
    case "finish" in args:
      return closeGame(args.finish);
    case "summary" in args:
      break;
    case "scoreboard" in args:
      break;
    case "id" in args:
      break;
    default:
      return "Command is not recognized, check `README.md` file";
  }
}

function createGame(args) {
  let game;
  try {
    assert("home" in args, "`home`-argument is not set");
    assert("away" in args, "`away`-argument is not set");
    game = new Game(args);
  } catch (e) {
    console.log(e.message);
    return "Error! Check `README.md` file";
  }
  return `Game between "${args.home}" (home) and "${args.away}" (away) is started! Game ID: ${game.id}`;
}

function closeGame(id) {
  try {
    assert(id > 0, '`finish`-argument is not set');
    const game = new Game({ id });
    game.close();
  } catch (e) {
    console.log(e.message);
    return "Error! Check `README.md` file";
  }
  return `Game (#${id}) is finished!`;
}

module.exports = handler;
