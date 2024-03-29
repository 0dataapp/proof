# Zero Data Proof

A sample app that integrates with multiple [0data](https://0data.app) protocols

<a href="https://proof.0data.app/"><img alt="Open app" src="http://static.rosano.ca/_shared/_RCSAppButton.svg" /></a>

## Architecture

The project follows a [Universal folder structure](https://rosano.hmm.garden/01f71kp52knc5nnv08qr9kzj3m) and is a large collection of mostly small modules or functions that are put together using [Svelte](https://svelte.dev) and [Rollup](https://rollupjs.org). With the exception of a few 'global' or 'magic' things such as the localization function `OLSKLocalized`, most resources used by a module should be in the same folder or referenced by path name.

Routing, rendering markdown content, and serving pages is done via a Node.js server (usually configured in the *controller.js* files).

## Development Setup

(For a deeper dive, watch [the tutorial](https://rosano.hmm.garden/01f62t5yseb053m024v1mczbzy)).

Install [Node.js and npm](https://nodejs.org/en/download/), then:

```
npm run setup
```

This should create an `.env` file if there is none. If you encounter errors referring to this file, you can find missing variables in `.env-sample`.

## Running

### Start the Rollup process to build and reload automatically

```
npm run watch
```

### Start the Node.js server to view in the browser

```
npm start
```

It should be accessible at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.

## ❤️

Help me keep creating projects that are public, accessible for free, and open-source.

<a href="https://rosano.ca/back"><img alt="Become a backer" src="https://static.rosano.ca/_shared/_RCSBackButton.svg" /></a>

## Questions

Feel free to reach out on [Mastodon](https://mastodon.online/@rosano) or [Twitter](https://twitter.com/rosano).
