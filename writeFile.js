const CLIApp = require("./CLIApp");

class MyCLIApp extends CLIApp {
  constructor() {
    super();
    this.expectedArgs = ["FILE_PATH", "STRING1", "[STRING2] ..."];
  }

  parseArgs(args) {
    // check that two args are given
    if (args.length < 2) {
      throw new Error(`Two arguments required`);
    }

    // check if help was requested
    if (args[0] === "-h" || args[0] === "--help") {
      throw new Error();
    }

    // set path argument
    this.filePath = args[0];
    this.fileContent = args.slice(1);
  }

  async execute() {
    await this.writeFileAsync(this.filePath, this.fileContent);
  }

  async writeFileAsync(relativePath, content) {
    const fs = require("fs").promises;
    try {
      const data = await fs.writeFile(relativePath, content.join(" "));
    } catch (err) {
      throw new Error(`Error reading file: ${err.message}`);
    }
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
