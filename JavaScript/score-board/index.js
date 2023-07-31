const readline = require("readline");
const cache = require("memory-cache");
const router = require("./lib/router");

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  terminal.question("Enter command: ", (input) => {
    const args = input
      .split(' ')
      .map((v) => v.split("="))
      .reduce((obj, [key, value]) => {
        obj[key] = value || null;
        return obj;
      }, {});
    console.log(router(args));
    promptUser();
  });
}

console.log("Node.js Console App (Press Ctrl+C to exit)");
promptUser();
