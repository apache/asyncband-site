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

Pages live under `src/pages/`. The homepage (`src/pages/index.tsx`) composes structured landing sections and API catalog data from `src/components/landing/`, following the visual system documented in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). Standalone Markdown pages such as `src/pages/downloads.md` and `src/pages/community.md` start with frontmatter for their title and metadata; the rest of the file is Markdown.

Fenced `bash` and `rust` code blocks are highlighted during the build. Docusaurus also supports MDX components when a page needs behavior beyond Markdown.

Run `pnpm format` to format the repository.

## Writing blog posts

Blog posts live under `blog/`, with author profiles in `blog/authors.yml`. Keep avatar source URLs in `image_url`; the blog plugin fetches and embeds them during each build to comply with the [ASF Content Security Policy](https://infra.apache.org/csp.html). Failed downloads stop the build.

## Validating

Run the type, formatting, lint, production-build, and external-asset checks:

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

The deployment workflow also rebuilds `main` daily to refresh avatars without a source change.

To publish a staging preview, push the site source to a branch named `preview/<name>` in this repository. The same deployment workflow publishes the build through `site/<name>-staging`, which ASF serves at `https://asyncband-<name>.staged.apache.org/`.

Deleting `preview/<name>` removes the generated `site/<name>-staging` branch. Source branches are deleted automatically after merging a pull request. Closing a pull request without merging keeps its preview available until you delete the source branch. The staged preview may remain reachable until ASF infrastructure prunes it.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
