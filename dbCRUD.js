const CLIApp = require("./CLIApp");

// desired functionality
// --new to add a new todo item
// --list [all|pending|done] to list the todo items
// --done [id] to update a todo item
// --delete [id] to delete a todo item
// --help to list all the available options
// --version to print the version of the application

class MyCLIApp extends CLIApp {
  constructor() {
    super();
    this.expectedArgs = ["COMMAND", "[id|all|pending|done]"];
  }

  parseArgs(args) {
    // check if help was requested
    if (args[0] === "-h" || args[0] === "--help") {
      throw new Error();
    }

    // check if correct number of args were passed
    if (args.length >= 1) {
      this.command = args[0];
    }
  }

  async execute() {}

  displayHelp() {
    super.displayHelp();

    console.log(
      "--new to add a new todo item\n--list [all|pending|done] to list the todo items\n--done [id] to update a todo item\n--delete [id] to delete a todo item\n--help to list all the available options\n--version to print the version of the application"
    );
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
