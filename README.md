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

Pages live under `src/pages/`. The homepage is `src/pages/index.tsx`, with its prose content in `src/pages/_home-content.md`. Markdown pages start with frontmatter for their title and metadata; the rest of the file is Markdown.

Fenced `bash` and `rust` code blocks are highlighted during the build. Docusaurus also supports MDX components when a page needs behavior beyond Markdown.

Run `pnpm format` to format the repository.

## Writing blog posts

Blog posts live under `blog/`, with author profiles in `blog/authors.yml`. Keep each author's avatar source URL in `image_url`. Before starting the development server or building, `scripts/prepare-authors.mjs` downloads remote avatars and generates a local author map and static images under `.docusaurus/blog-authors/`. These generated files are not committed. Local image paths and authors without avatars also work.

Each build fetches avatars again and names them by their content hash, so changed images get new URLs. Docusaurus uses the generated author map for both HTML and client navigation, serving images from the site in accordance with the [ASF Content Security Policy](https://infra.apache.org/csp.html). Failed downloads stop the build and leave the deployed site unchanged. Restart `pnpm dev` after editing author profiles to regenerate them.

## Validating

Run the type, test, formatting, lint, and production-build checks:

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

The deployment workflow also rebuilds `main` daily at 03:17 UTC to refresh avatars without a source change. The schedule takes effect after the workflow is merged into `main`; its timing depends on GitHub Actions availability. GitHub can disable scheduled workflows after 60 days without repository activity; re-enable the workflow in Actions if that happens.

To publish a staging preview, push the site source to a branch named `preview/<name>`. The same deployment workflow publishes the build through `site/<name>-staging`, which ASF serves at `https://asyncband-<name>.staged.apache.org/`.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
