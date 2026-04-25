<p align="center">
  <img src="public/logo192.png" alt="Deus Ex Machina">
</p>

# Deus Ex Machina

[![release](https://img.shields.io/github/v/release/remarkablegames/deus-ex-machina)](https://github.com/remarkablegames/deus-ex-machina/releases)
[![build](https://github.com/remarkablegames/deus-ex-machina/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/deus-ex-machina/actions/workflows/build.yml)

Play the game on:

- [remarkablegames](https://remarkablegames.org/deus-ex-machina/)

## Credits

- [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds)
- [Menu SFX Pack](https://hitrison.itch.io/menu-sfx-pack)

## Prerequisites

[nvm](https://github.com/nvm-sh/nvm#installing-and-updating):

```sh
brew install nvm
```

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablegames/deus-ex-machina.git
cd deus-ex-machina
```

Install the dependencies:

```sh
npm install
```

Update the files:

- [ ] `public/*.png`
- [ ] `public/manifest.webmanifest`

## Environment Variables

Update the environment variables:

```sh
cp .env .env.local
```

Update the **Secrets** in the repository **Settings**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the game in the development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

You will also see any errors in the console.

### `npm run build`

Builds the game for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your game is ready to be deployed!

### `npm run bundle`

Builds the game and compresses the contents into a ZIP archive in the `dist` folder.

Your game can be uploaded to your server, [itch.io](https://itch.io/), [newgrounds](https://www.newgrounds.com/), etc.

## Testing

### Level

To start the game at a specific level, append the `?level=` querystring parameter to the URL with a zero-based index:

```
http://localhost:5173/?level=0
```

If the index is out of range or omitted, the game defaults to level `0`.
