# Apache Asyncband (Incubating) Website

This repository contains the source for the Apache Asyncband (Incubating) website. Read the project [DISCLAIMER](DISCLAIMER) and learn what [incubation](https://incubator.apache.org/policy/incubation.html) means.

## Developing

Install dependencies and start the SvelteKit development server:

```sh
pnpm install
pnpm dev
```

The local site is available at `http://localhost:5173/` by default.

## Editing the homepage

The site is intentionally a single page. Homepage content lives in `src/routes/+page.svx` and follows the structure of the main Asyncband repository README. Generated Rust API documentation remains external at [docs.rs/asyncband](https://docs.rs/asyncband/).

Second- and third-level headings receive stable anchors automatically. Fenced `bash` and `rust` code blocks are highlighted during the build.

## Validating

Run the type, formatting, lint, and production-build checks:

```sh
pnpm validate
```

## Building and previewing

Generate the static site and preview the result locally:

```sh
pnpm build
pnpm preview
```

The generated site is written to `build/`. Pushing to `main` builds and publishes the site through the `asf-site` branch.

To publish a staging preview, push the site source to a branch named `preview/<name>`. The same deployment workflow publishes the build through `site/<name>-staging`, which ASF serves at `https://asyncband-<name>.staged.apache.org/`.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
