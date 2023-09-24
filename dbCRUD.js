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
    this.version = "v0.0.0";
    this.validCommands = {
      "--new": "create",
      "--list": "read",
      "--done": "update",
      "--delete": "delete",
      "--help": "help",
      "-h": "help",
      "--version": "version",
    };
  }

  parseArgs(args) {
    // check if correct number of args were passed
    if (args.length >= 1) {
      this.command = this.validCommands[args[0]];
    }
  }

  async execute() {
    if (this.command) {
      // run requested command
      switch (this.command) {
        case "create":
          throw new Error("Not implemented");
        case "read":
          throw new Error("Not implemented");
        case "update":
          throw new Error("Not implemented");
        case "delete":
          throw new Error("Not implemented");
        case "help":
          throw new Error("Not implemented");
        case "version":
          console.log(this.version);
        default:
          throw new Error("Invalid command");
      }

      return;
    }

    // invalid command
    throw new Error();
  }

  displayHelp() {
    super.displayHelp();

    console.log(
      "\n--new to add a new todo item\n--list [all|pending|done] to list the todo items\n--done [id] to update a todo item\n--delete [id] to delete a todo item\n--help to list all the available options\n--version to print the version of the application"
    );
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
