<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

# Repository Instructions

## Pull Request Preview Workflow

- Fetch `origin/main` and create every pull request branch from its latest commit.
- Name the source branch `preview/<name>`, where `<name>` uses lowercase letters, digits, and hyphens. Do not use `codex/`, `staging/`, or `site/` for a pull request branch.
- Run `pnpm validate` before pushing the branch.
- Push the `preview/<name>` branch before opening the pull request. The deploy workflow publishes its build to the generated `site/<name>-staging` branch and ASF serves it at `https://asyncband-<name>.staged.apache.org/`.
- Treat `site/<name>-staging` as deployment output. Never base work on it, commit to it directly, or use it as the pull request head branch.
- Open the pull request from `preview/<name>` into `main` and include the staging URL in the pull request description.
- When the pull request is closed, the cleanup workflow deletes the `site/<name>-staging` branch so deployment output does not accumulate. The staged preview may remain reachable until ASF infrastructure prunes it. To remove a stale staging branch by hand, delete its `site/<name>-staging` branch.
- Production publishing remains separate: pushes to `main` publish through the `asf-site` branch.
