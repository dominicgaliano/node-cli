const CLIApp = require("./CLIApp");

class MyCLIApp extends CLIApp {
  constructor() {
    super();
    this.expectedArgs = ["URL", "CSS-Selector(s)"];
  }

  parseArgs(args) {
    // check that an arg is given
    if (args.length < 2) {
      throw new Error(`Min 2 args required`);
    }

    // check if help was requested
    if (args[0] === "-h" || args[0] === "--help") {
      throw new Error();
    }

    // set path argument
    this.URL = args[0];
    this.cssSelectors = args.slice(1);
  }

  async execute() {
    await this.findBySelector(this.URL, this.cssSelectors);
  }

  async findBySelector(URL, cssSelectors) {
    // fetch HTML
    const htmlContent = await this.getHTML(URL);

    // load and find elements by cssSelector
    this.findSelector(htmlContent, cssSelectors);
  }

  async getHTML(URL) {
    const axios = require("axios");

    try {
      const response = await axios.get(URL);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  findSelector(htmlContent, cssSelectors) {
    const cheerio = require("cheerio");

    try {
      const $ = cheerio.load(htmlContent);
      const results = $(cssSelectors.join(" "));

      if (results.length > 0) {
        console.log(results.text());
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// Create an instance of your CLI app and run it
const myApp = new MyCLIApp();
myApp.run();
