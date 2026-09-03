# Apache Asyncband (Incubating) Website

This repository contains the source for the Apache Asyncband (Incubating) website. Read the project [DISCLAIMER](DISCLAIMER) and learn what [incubation](https://incubator.apache.org/policy/incubation.html) means.

## Developing

Install dependencies and start the Docusaurus development server:

```sh
pnpm install
pnpm dev
```

The local site is available at `http://localhost:3000/` by default.

## Writing documentation

Pages live under `src/pages/` as Markdown files. The homepage is `src/pages/index.md`. Each page starts with frontmatter for its title and metadata; the rest of the file is Markdown.

Fenced `bash` and `rust` code blocks are highlighted during the build. Docusaurus also supports MDX components when a page needs behavior beyond Markdown.

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
