# Repository Instructions

## Pull Request Preview Workflow

* Fetch `origin/main` and create every pull request branch from its latest commit.
* Name the source branch `preview/<name>`, where `<name>` uses lowercase letters, digits, and hyphens. Do not use `codex/`, `staging/`, or `site/` for a pull request branch.
* Run `pnpm validate` before pushing the branch.
* Push the `preview/<name>` branch before opening the pull request. The deploy workflow publishes its build to the generated `site/<name>-staging` branch and ASF serves it at `https://asyncband-<name>.staged.apache.org/`.
* Treat `site/<name>-staging` as deployment output. Never base work on it, commit to it directly, or use it as the pull request head branch.
* Open the pull request from `preview/<name>` into `main` and include the staging URL in the pull request description.
* Deleting the `preview/<name>` source branch triggers cleanup of the generated `site/<name>-staging` branch. Merged pull requests have their source branch deleted automatically. If a pull request is closed without merging, delete its source branch when the preview is no longer needed. The staged preview may remain reachable until ASF infrastructure prunes it. To remove a stale staging branch by hand, delete its `site/<name>-staging` branch.
* Production publishing remains separate: pushes to `main` publish through the `asf-site` branch.
