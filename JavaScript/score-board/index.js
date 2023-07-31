const readline = require("readline");
const cache = require("memory-cache");

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
    console.log(args);
    promptUser();
  });
}

console.log("Node.js Console App (Press Ctrl+C to exit)");
promptUser();
