require("dotenv").config();
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
    this.expectedArgs = ["COMMAND", "[id|all|pending|done|note_text]"];
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
    this.command = this.validCommands[args[0]];
    this.commandArg = args[1];

    // verify at least one valid command passed
    if (!this.command) {
      throw new Error();
    }
  }

  async execute() {
    let data;

    // run requested command
    switch (this.command) {
      case "help":
        this.displayHelp();
        return;
      case "version":
        console.log(this.version);
        return;
      default:
        data = await this.performDatabaseAction(this.command, this.commandArg);
    }
  }

  async performDatabaseAction(actionType, commandArg) {
    // validate input
    if (!commandArg) {
      throw new Error("Two arguments expected");
    }

    const Client = require("pg").Client;

    const client = new Client({
      host: process.env.HOST,
      port: process.env.PORT,
      database: process.env.DATABASE_NAME,
      user: process.env.USER_ID,
      password: process.env.USER_KEY,
    });
    await client.connect();

    let QUERY_STRING;

    switch (actionType) {
      case "create":
        QUERY_STRING = "";
        break;
      case "read":
        QUERY_STRING = "SELECT * FROM film";
        break;
      case "update":
        QUERY_STRING = "";
        break;
      case "delete":
        QUERY_STRING = "";
        break;
      default:
        throw new Error("internal error: invalid action type");
    }

    let res;
    try {
      res = await client.query(QUERY_STRING);
    } catch (err) {
      console.log(err);
    } finally {
      await client.end();
    }

    return res;
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
