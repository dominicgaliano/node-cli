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
        // validate 2 args passed
        if (!this.commandArg) {
          throw new Error("Two arguments expected");
        }

        // perform db action
        data = await this.performDatabaseAction(this.command, this.commandArg);
    }

    // display result
    // temp
    console.log(data);
  }

  async performDatabaseAction(actionType, actionBody) {
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

    // build query string
    let QUERY_STRING;
    switch (actionType) {
      case "create":
        QUERY_STRING = `INSERT INTO test_table (task_description) VALUES ('${actionBody}');`;
        break;
      case "read":
        let filterString = "";
        if (actionBody === "pending") {
          filterString = "WHERE NOT complete";
        } else if (actionBody === "done") {
          filterString = "WHERE complete";
        }

        QUERY_STRING = `SELECT task_description FROM tasks ${filterString};`;
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
      // verify table
      await this.verifyTable(client);
      res = await client.query(QUERY_STRING);
    } catch (err) {
      console.log(err);
    } finally {
      await client.end();
    }

    return res;
  }

  async verifyTable(client) {
    // check if table exists
    if (this.tableExists(client)) {
      // check if table follows desired schema
      if (!this.tableSchemaValid(client)) {
        this.createTable(client);
      }
    } else {
      // create table
      this.createTable(client);
    }
  }

  async tableExists(client) {
    // check if table exists on db
    const tableExistsQuery = `
    SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'tasks');`;

    const result = await client.query(tableExistsQuery);
    return result.rows[0].exists;
  }

  async tableSchemaValid(client) {
    const getTableSchemaQuery = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'tasks'
    ORDER BY column_name;`;

    const result = await client.query(getTableSchemaQuery);

    // Check if the schema matches desired schema
    if (
      result.rows.length === 3 && // Check the number of columns
      result.rows[0].column_name === "complete" &&
      result.rows[0].data_type === "boolean" &&
      result.rows[1].column_name === "task_description" &&
      result.rows[1].data_type === "character varying" &&
      result.rows[2].column_name === "task_id" &&
      result.rows[2].data_type === "integer"
    ) {
      return true;
    }
    return false;
  }

  async createTable(client) {
    // Create the "tasks" table with the desired schema
    const createTableQuery = `
      CREATE TABLE tasks (
      task_id SERIAL PRIMARY KEY,
      task VARCHAR(255) NOT NULL,
      complete BOOLEAN NOT NULL DEFAULT false);`;

    await client.query(createTableQuery);
    console.log('Created the "tasks" table.');
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
