# Apache Asyncband (Incubating) Website

This repository contains the source for the Apache Asyncband (Incubating) website. Read the project [DISCLAIMER](DISCLAIMER) and learn what [incubation](https://incubator.apache.org/policy/incubation.html) means.

## Developing

Install dependencies and start the SvelteKit development server:

```sh
pnpm install
pnpm dev
```

The local site is available at `http://localhost:5173/` by default.

Pagefind search is generated from the static HTML during `pnpm build`, so use the production preview below when testing search.

## Writing documentation

Documentation pages live under `src/routes/docs/` as MDsveX `.md` files. Each page starts with frontmatter for its navigation label and metadata; the rest of the file is Markdown.

Second-level headings generate the on-page table of contents automatically. Fenced `bash` and `rust` code blocks are highlighted during the build. MDsveX also supports Svelte components when a document needs behavior beyond Markdown.

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

The generated site is written to `build/`. Publishing to the `asf-site` branch will be added when the project is ready to launch the public site.

To publish a staging preview, push the site source to a branch named `preview/<name>`. GitHub Actions builds it into `preview/<name>-staging`, and ASF serves it at `https://asyncband-<name>.staged.apache.org/`.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
