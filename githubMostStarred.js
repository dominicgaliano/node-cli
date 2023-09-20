const CLIApp = require("./CLIApp");

class MyCLIApp extends CLIApp {
  constructor() {
    super();
    this.expectedArgs = ["START_DATE", "END_DATE"];
  }

  parseArgs(args) {
    // check if help was requested
    if (args[0] === "-h" || args[0] === "--help") {
      throw new Error();
    }

    // check if dates were passed
    if (args.length >= 2) {
      this.startDate = args[0];
      this.endDate = args[0];
    }
  }

  async execute() {
    // construct query string
    // call github search api
    // display results
  }

  displayHelp() {
    super.displayHelp();

    console.log("Required date format: YYYY-MM-DD");
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
