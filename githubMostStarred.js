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
      // TODO: add some date validation
      this.startDate = args[0];
      this.endDate = args[1];
    }
  }

  async execute() {
    const baseURL = `https://api.github.com/search/repositories?`;

    // construct query string
    const queryString = this.constructQueryString();

    // call github search api
    const results = await this.getResults(baseURL, queryString);

    // display results
    results.slice(0, 10).forEach((repo, index) => {
      console.log(`#${index + 1}`);
      console.log(repo.name);
      console.log(repo.description);
      console.log(repo.html_url);
      console.log("Stars:", repo.stargazers_count);
      console.log("----------");
    });
  }

  constructQueryString() {
    if (this.startDate && this.endDate) {
      return (
        "q=" +
        encodeURI(
          `created:${this.startDate}..${this.endDate}&sort:stars&order:desc`
        )
      );
    }
  }

  async getResults(baseURL, queryString) {
    const axios = require("axios");

    try {
      const response = await axios.get(baseURL + queryString);
      return response.data.items;
    } catch (error) {
      console.log(error);
    }
  }

  displayHelp() {
    super.displayHelp();

    console.log("Required date format: YYYY-MM-DD");
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
