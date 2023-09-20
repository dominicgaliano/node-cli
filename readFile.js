const path = require("path");
const fs = require("fs").promises;

function main() {
  // parse args
  const args = process.argv;

  // validate correct number of arguments
  if (args.length < 3) {
    displayError("No target specified");
    return;
  }

  // parse input
  const userInput = args[2];
  if (userInput === "-h" || userInput == "--help") {
    displayHelp();
    return;
  }

  readFileAsync(userInput);
}

async function readFileAsync(relativePath) {
  try {
    const data = await fs.readFile(relativePath, "utf-8");
    console.log(data);
  } catch (err) {
    displayError(err);
  }
}

function displayError(errorText) {
  console.log(errorText);
  displayHelp();
}

function displayHelp() {
  console.log(`Usage: node ${path.basename(__filename)} /file-path`);
}

main();
