# Data Tiles

[![Build Status](https://travis-ci.com/lovethebomb/data-tiles.svg?branch=master)](https://travis-ci.com/lovethebomb/data-tiles)

This application is a simple side-project created to learn a bit more about [Next.js](https://github.com/zeit/next.js/) and [TypeScript](https://www.typescriptlang.org).

## Usage

```bash
git clone git@github.com:lovethebomb/data-tiles.git
```

Create a `.env` file with `KEY=value` as decribed in `.config.js`

## Development

```bash
npm run dev
```

## Testing

```bash
npm run test
```

## Production

A [Dockerfile](Dockerfile) is provided.

The build-and-run step is:

```bash
npm run build && npm run start
```

You can provide the `.env` file through a Docker volume and override the port `envvar` if needed.

```bash
docker run -v -e "PORT=3000" /path/to/.env:/app/.env data-tiles
```