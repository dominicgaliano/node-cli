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
    let res;

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
        res = await this.performDatabaseAction(this.command, this.commandArg);
    }

    this.describeResult(res);
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

    let res;
    try {
      // build query string
      const QUERY_STRING = this.buildQueryString(actionType, actionBody);

      // verify table
      await this.verifyTable(client);

      // query db
      res = await client.query(QUERY_STRING);
    } catch (err) {
      throw new Error(err);
    } finally {
      await client.end();
    }

    return res;
  }

  async verifyTable(client) {
    // check if table exists
    if (await this.tableExists(client)) {
      // check if table follows desired schema
      if (await !this.tableSchemaValid(client)) {
        await this.createTable(client);
      }
    } else {
      // create table
      await this.createTable(client);
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
      DROP TABLE IF EXISTS tasks;
    
      CREATE TABLE tasks (
      task_id SERIAL PRIMARY KEY,
      task_description VARCHAR(255) NOT NULL,
      complete BOOLEAN NOT NULL DEFAULT false);`;

    await client.query(createTableQuery);
  }

  buildQueryString(actionType, actionBody) {
    // build query string
    let QUERY_STRING;
    switch (actionType) {
      case "create":
        QUERY_STRING = `INSERT INTO tasks (task_description) VALUES ('${actionBody}');`;
        break;
      case "read":
        let filterString = "";
        switch (actionBody) {
          case "pending":
            filterString = "WHERE NOT complete";
            break;
          case "done":
            filterString = "WHERE complete";
            break;
          case "all":
            break;
          default:
            throw new Error("invalid filter");
        }

        if (actionBody === "pending") {
          filterString = "WHERE NOT complete";
        } else if (actionBody === "done") {
          filterString = "WHERE complete";
        }

        QUERY_STRING = `SELECT * FROM tasks ${filterString};`;
        break;
      case "update":
        QUERY_STRING = `UPDATE tasks SET complete = true WHERE task_id=${actionBody};`;
        break;
      case "delete":
        QUERY_STRING = `DELETE FROM tasks WHERE task_id=${actionBody};`;
        break;
      default:
        throw new Error("internal error: invalid action type");
    }

    return QUERY_STRING;
  }

  describeResult(res) {
    switch (this.command) {
      case "create":
        console.log("Created!");
        break;
      case "read":
        console.log(res.rows);
        break;
      case "update":
        console.log("Updated!");
        break;
      case "delete":
        console.log("Deleted");
        break;
      default:
        throw new Error("internal error: invalid action type ");
    }
  }

  displayHelp() {
    super.displayHelp();

    console.log(
      `--new to add a new todo item
--list [all|pending|done] to list the todo items
--done [id] to update a todo item
--delete [id] to delete a todo item
--help to list all the available options
--version to print the version of the application`
    );
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
