[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
![Top Tech][tech-shield]
[![LinkedIn][linkedin-shield]][linkedin-url]

# Assorted Node.js CLI Apps

This repository contains several node CLI applications.

I created this project to practice and learn more about [Node.js](https://nodejs.org/en) and common Node packages as part of the [roadmap.sh full stack pathway](https://roadmap.sh/full-stack).

## Usage

### readFile.js

Read utf-8 encoded text from file

```sh
node readFile FILE_PATH

# Example:
node readFile /path/to/input.txt   # Reads file at /path/to/input.txt
```

### writeFile.js

Write utf-8 encoded text to file

```sh
node writefile FILE_PATH STRING1 [STRING2] ...

# Example:
node writeFile output.txt Hello World # Outputs Hello World to ./output.txt

```

### cssSelector.js

Accepts URL and a CSS selector arguments and prints the text content of the element that matches the selector using [axios](https://axios-http.com/) and [cheerio](https://cheerio.js.org/).

```sh
node cssSelector.js URL SELECTOR1 [SELECTOR2] [SELECTOR3] ...

# Example:
node cssSelector.js https://example.com .title .description
# Returns all elements with className .title and .description returned by http://example.com
```

### githubMostStarred.js

Accepts two dates and prints the most starred GitHub projects in that date range using [axios](https://axios-http.com/) and the [GitHub search API](https://docs.github.com/en/free-pro-team@latest/rest/search/search)

```sh
node githubMostStarred.js DATE1 DATE2

# Example
node githubMostStarred.js 2023-09-01 2023-10-19
# Output:
# #1
# hyperdx
# Resolve production issues, fast. An open source observability platform unifying session replays, logs, metrics, traces and errors.
# https://github.com/hyperdxio/hyperdx
# Stars: 2621
# ...
```

### dbCRUD.js

Simple CRUD cli component using PostgreSQL.

```sh
node dbCrud.js COMMAND, [id|all|pending|done|"note_text"]

# Example
node
```

Database Schema:
| Column | Type | Description |
| ------ | ------------ | ----------------------- |
| task_id (PK) | SERIAL | Unique task identifier |
| task | VARCHAR(255) | Description of the task |
| status | VARCHAR(7) | Current task status |
PK = Primary Key

## Installation

To install this project locally, follow the following commands (npm required):

```sh
git clone https://github.com/dominicgaliano/node-cli.git
cd node-cli/
npm i
```

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

## How to Contribute

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

[contributors-shield]: https://img.shields.io/github/contributors/dominicgaliano/node-cli.svg?style=for-the-badge
[contributors-url]: https://github.com/dominicgaliano/node-cli/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dominicgaliano/node-cli.svg?style=for-the-badge
[forks-url]: https://github.com/dominicgaliano/node-cli/network/members
[stars-shield]: https://img.shields.io/github/stars/dominicgaliano/node-cli.svg?style=for-the-badge
[stars-url]: https://github.com/dominicgaliano/node-cli/stargazers
[issues-shield]: https://img.shields.io/github/issues/dominicgaliano/node-cli.svg?style=for-the-badge
[issues-url]: https://github.com/dominicgaliano/node-cli/issues
[license-shield]: https://img.shields.io/github/license/dominicgaliano/node-cli.svg?style=for-the-badge
[license-url]: https://github.com/dominicgaliano/node-cli/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/dominic-galiano
[tech-shield]: https://img.shields.io/github/languages/top/dominicgaliano/node-cli.svg?style=for-the-badge
[github-status-shield]: https://img.shields.io/github/actions/workflow/status/dominicgaliano/node-cli/main.yml.svg?style=for-the-badge
