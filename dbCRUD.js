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

    // display result
    // temp
    console.log(data);
  }

  async performDatabaseAction(actionType, commandArg) {
    // validate input
    if (!commandArg) {
      throw new Error("Two arguments expected");
    }

    // connect to postgreSQL db
    const Client = require("pg").Client;
    const client = new Client({
      host: process.env.HOST,
      port: process.env.PORT,
      database: process.env.DATABASE_NAME,
      user: process.env.USER_ID,
      password: process.env.USER_KEY,
    });
    await client.connect();

    // verifies table
    await this.verifyTable(client);

    // build query string
    let QUERY_STRING;
    switch (actionType) {
      case "create":
        QUERY_STRING = "";
        break;
      case "read":
        QUERY_STRING = "SELECT * FROM tasks";
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

    // query db
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

  async verifyTable(client) {
    // check if table exists on db
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'tasks'
      );
    `;
    const result = await client.query(tableExistsQuery);

    // create table if it does not exist
    if (!result.rows[0].exists) {
      // Create the "tasks" table with the desired schema
      const createTableQuery = `
        CREATE TABLE tasks (
          task_id SERIAL PRIMARY KEY,
          task VARCHAR(255) NOT NULL,
          complete BOOLEAN NOT NULL DEFAULT false
        );
      `;
      await client.query(createTableQuery);
      console.log('Created the "tasks" table.');
    }

    let res;
    try {
      res = await client.query(`CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
	      task_description VARCHAR(255) NOT NULL,
	      complete BOOLEAN NOT NULL DEFAULT false
      );`);
    } catch (err) {
      throw new Error(err);
    } finally {
      console.log(res);
    }
  }

  displayHelp() {
    super.displayHelp();

    console.log(
      `--new to add a new todo item
--list [all|pending|done] to list the todo items
--done [id] to update a todo item--delete [id] to delete a todo item
--help to list all the available options
--version to print the version of the application`
    );
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
