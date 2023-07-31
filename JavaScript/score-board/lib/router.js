const assert = require('assert');

function handler(args) {
  switch (true) {
    case "start" in args:
      return createGame(args);
    case "finish" in args:
      break;
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
  try {
    assert("home" in args, "`home`-argument is not set");
    assert("away" in args, "`away`-argument is not set");
  } catch (e) {
    console.log(e.message);
    return 'Error! Check `README.md` file';
  }
  return `Game between "${args.home}" (home) and "${args.away}" (away) is started!`;
}

module.exports = handler;
