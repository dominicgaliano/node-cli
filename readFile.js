const CLIApp = require("./CLIApp");

class MyCLIApp extends CLIApp {
  constructor() {
    super();
    this.expectedArgs = ["FILE_PATH"];
  }

  parseArgs(args) {
    // check that an arg is given
    if (args.length < 1) {
      throw new Error(`No arguments given`);
    }

    // check if help was requested
    if (args[0] === "-h" || args[0] === "--help") {
      throw new Error();
    }

    // set path argument
    this.filePath = args[0];
  }

  async execute() {
    await this.readFileAsync(this.filePath);
  }

  async readFileAsync(relativePath) {
    const fs = require("fs").promises;
    try {
      const data = await fs.readFile(relativePath, "utf-8");
      console.log(data);
    } catch (err) {
      throw new Error(`Error reading file: ${err.message}`);
    }
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
