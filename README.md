# Assorted Node.js CLI Apps

This repository contains several node CLI applications.

I created this project to practice and learn more about [Node.js](https://nodejs.org/en) and common Node packages as part of the [roadmap.sh full stack pathway](https://roadmap.sh/full-stack).

## Usage

### readFile.js

```sh
node readFile FILE_PATH

# Example:
node readFile /path/to/input.txt   # Reads file at /path/to/input.txt
```

### writeFile.js

```sh
node writefile FILE_PATH STRING1 [STRING2] ...

# Example:
node writeFile output.txt Hello World! # Outputs Hello World! to ./output.txt

```

### cssSelector.js

```sh
node cssSelector.js URL SELECTOR1 [SELECTOR2] [SELECTOR3] ...

# Example:
node cssSelector.js https://example.com .title .description
# Returns all elements with className .title and .description returned by http://example.com
```

###
