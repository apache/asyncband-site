# Apache Asyncband (Incubating) Website

This repository contains the source for the Apache Asyncband (Incubating) website. Read the project [DISCLAIMER](DISCLAIMER) and learn what [incubation](https://incubator.apache.org/policy/incubation.html) means.

## Developing

Install dependencies and start the SvelteKit development server:

```sh
npm install
npm run dev
```

The local site is available at `http://localhost:5173/` by default.

Pagefind search is generated from the static HTML during `npm run build`, so use the production preview below when testing search.

## Validating

Run the type, formatting, lint, and production-build checks:

```sh
npm run validate
```

## Building and previewing

Generate the static site and preview the result locally:

```sh
npm run build
npm run preview
```

The generated site is written to `build/`. Publishing to the `asf-site` branch will be added when the project is ready to launch the public site.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
