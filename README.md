# AutomatonSimulator

An online simulator for finite automata (FA), pushdown automata (PDA) and linear bounded automata (LBA). This application allows the user to draw an automaton or edit it using a transition table. Two languages are supported: portuguese and english.

## Dependencies

This application is mainly written in TypeScript, therefore `npm` is required. [This page](https://gist.github.com/isaacs/579814) can be used to install `npm` without needing root privileges. Most package managers also provide `npm`, though it is often an outdated version.

After installing `npm`, install the TypeScript compiler by running (`sudo` might be required depending on how you installed `npm`):
```bash
npm install -g typescript
```

[UglifyJS](https://github.com/mishoo/UglifyJS) and [Browserify](http://browserify.org/) are also required.

## Installation

To compile the code, simply run `make`. Simply open `index.html` in your browser afterwards.

Note that the `js` folder is automatically generated from the files in `scripts`. If you edit a `js` file directly, your changes will be lost.
