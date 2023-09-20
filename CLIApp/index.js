const path = require("path");

class CLIApp {
  constructor() {
    this.programName = path.basename(process.argv[1]);
    this.expectedArgs = [];
  }

  async run() {
    try {
      const args = process.argv.slice(2);
      this.parseArgs(args);
      await this.execute();
    } catch (error) {
      this.handleError(error);
    }
  }

  parseArgs(args) {
    // Implement your argument parsing logic here
    // Example: this.filePath = args[0];
  }

  async execute() {
    // Implement your custom behavior here
    // Example: await this.readFileAsync(this.filePath);
  }

  handleError(error) {
    if (error) {
      console.error(error.message);
    }
    this.displayHelp();
  }

  displayHelp() {
    console.log(
      `Usage: node ${this.programName} ${this.expectedArgs.join(" ")}`
    );
  }
}

module.exports = CLIApp;
