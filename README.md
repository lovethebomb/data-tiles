# Data Tiles

This application is a simple side-project created to learn a bit more about [Next.js](https://github.com/zeit/next.js/) and [TypeScript]("https://www.typescriptlang.org").

## Usage

```bash
git clone git@github.com:lovethebomb/data-tiles.git
```

Create a `.env` file with `KEY=value` as decribed in `.config.js`

## Development

```bash
npm run dev
```

## Production

A [Dockerfile](Dockerfile) is provided.

The build-and-run step is:

```bash
npm run build && npm run start
```

You can provide the `.env` file through a Docker volume.

```bash
docker run -v /path/to/.env:/app/.env data-tiles
```