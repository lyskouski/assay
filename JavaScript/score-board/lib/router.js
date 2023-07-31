function handler(args) {
  switch (true) {
    case "start" in args:
      break;
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

module.exports = handler;
