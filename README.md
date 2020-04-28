# Spring307-8amMWF-Team7
TODO: write project description

## Branch Description
This branch contains demo code of a "roundtrip" with a React.js frontend and Parse backend.

## Tech Stack
Links to technologies and relevant documentation.

* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
  * [Learn X in Y Minutes](https://learnxinyminutes.com/docs/html/)
  * [FreeCodeCamp](https://www.freecodecamp.org/learn/responsive-web-design/basic-html-and-html5/)
  * [HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
  * [Learn X in Y Minutes](https://learnxinyminutes.com/docs/css/)
  * [FreeCodeCamp](https://www.freecodecamp.org/learn/responsive-web-design/basic-css/)
  * [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  * [Learn X in Y Minutes](https://learnxinyminutes.com/docs/javascript/)
  * FreeCodeCamp
    * [Basic JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/)
    * [ES6](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/es6/)
  * [JSON](https://www.json.org/json-en.html)
    * [Learn X in Y Minutes](https://learnxinyminutes.com/docs/json/)
  * [Essential JavaScript Features for React](https://codeburst.io/essential-javascript-features-for-react-82a6bf6855c2)
* [Node.js](https://nodejs.org/en/)
  * [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/)
  * [npm (Node package manager)](https://www.npmjs.com/)
    * [Downloading and installing packages locally](https://docs.npmjs.com/downloading-and-installing-packages-locally)
* [yarn](https://yarnpkg.com/)
  * [Getting Started](https://yarnpkg.com/getting-started)
  * [CLI](https://yarnpkg.com/cli/install)
* [React.js](https://reactjs.org/)
  * [Documentation](https://reactjs.org/docs/getting-started.html)
    * [Main Concepts](https://reactjs.org/docs/hello-world.html)
    * [Hooks](https://reactjs.org/docs/hooks-intro.html)
  * [JSX vs. HTML](https://medium.com/@wilstaley/jsx-vs-html-3aeb55ed6ee4)
  * [Create React App](https://create-react-app.dev/)
    * [Documentation](https://create-react-app.dev/docs/getting-started)
* [Parse](https://parseplatform.org/)
  * Server
    * [Guide](https://docs.parseplatform.org/parse-server/guide/)
  * Javascript SDK
    * [Guide](https://docs.parseplatform.org/js/guide/)
    * [API Reference](http://parseplatform.org/Parse-SDK-JS/api/2.12.0/)

## Getting Started
Here's how to get the demo up and running.

### Frontend
Our frontend uses React.js and was created using Create React App.

#### Prerequisites
Make sure you have `node` and `npm` on your machine.

#### Setup
1. Navigate to the `frontend/` directory.
```
$ cd frontend/
```

2. Install the packages from `package.json`
```
$ npm install
```

#### Run the development server
1. Run the start script from `package.json`
```
$ npm start
```

### Backend
Our backend uses Parse server.

#### Prerequisites
* Node.js
* MongoDB
* Python 2.x

#### Setup
1. Navigate to the `backend/` directory.
```
$ cd backend/
```

2. Install `mongodb-runner` globally
```
$ npm install -g mongodb-runner
```

3. Install the packages from `package.json`
```
$ npm install
```

#### Run the development server
1. Start `mongodb-runner`
```
$ mongodb-runner start
```

2. Run the start script from `package.json`
```
$ npm start
```

