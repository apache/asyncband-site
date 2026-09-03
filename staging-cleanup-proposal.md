# Staging 残留清理方案(本地评审稿,不入库)

## 现状(已核实)

- 合并 PR 后,`preview/<name>` 源分支会被 GitHub 自动删除(`.asf.yaml` 里 `del_branch_on_merge: true` 生效中),这一侧没有残留。
- 真正残留的是 Deploy workflow 产出的部署分支 `site/<name>-staging`。目前远程有 3 个:`site/docusaurus-staging`(PR #8,已合并)、`site/homepage-staging`(PR #9,已合并)、`site/readme-homepage-staging`(PR #7,关闭未合并),对应的 `https://asyncband-<name>.staged.apache.org/` 全部仍在对外服务(HTTP 200)。
- ASF 的 `autostage: site/*` 是按分支提供 staging 内容的;分支删除后预览站即下线(asfyaml 文档未明示删除语义,需首次清理时实测验证)。
- 现有 ruleset 只保护 `main` 和 `asf-site`,`site/*` 分支可以安全删除。

## 方案 A:手动清理 + 文档约定(改动最小)

- 每次合并/关闭 preview PR 后,手动执行 `git push origin --delete site/<name>-staging`。
- 在 `AGENTS.md` 的 preview 流程说明里补上这一步,作为流程的一部分。
- 优点:不加任何自动化,没有维护负担;删除动作显式可控。
- 缺点:靠人记,忘了就残留;staging 站点在删除前一直在线。

## 方案 B:PR 关闭时自动清理(推荐)

- 新增 `.github/workflows/cleanup-staging.yml`,触发条件 `pull_request: types: [closed]`。
- 逻辑:若 PR 头分支匹配 `preview/*` 且来自本仓库(排除 fork),则推导 `site/<name>-staging`,存在即用 `GITHUB_TOKEN` 删除(`contents: write`)。
- 合并和关闭未合并两种情况都清理——预览周期都已结束(PR #7 就是关闭未合并也留下了残留)。
- 整个 workflow 约 20 行 YAML,无新依赖。
- 优点:全自动、作用域精确、与 AGENTS.md 已有的分支命名约定天然对齐。
- 缺点:依赖命名约定;分支删除事件本身不会再触发其他流程,无连锁风险。

## 方案 C:定时清扫(janitor)

- 新增一个按周运行的 schedule workflow:列出所有 `site/*-staging` 分支,删掉没有对应打开状态 `preview/<name>` PR 的分支。
- 优点:能兜住所有途径产生的残留(包括手动乱推的分支)。
- 缺点:逻辑更复杂(要用 GitHub API 反查打开中的 PR);残留最长可存活一周;多一个定时任务要维护。

## 建议

选 **方案 B**:它和现有的 preview 工作流正好互补,自动化程度够且最简单;方案 A 可以作为 B 的文档补充写进 AGENTS.md(说明自动清理的存在和手动清理方法)。

无论选哪个,都需要一次性清掉现有的 3 个残留分支:`site/docusaurus-staging`、`site/homepage-staging`、`site/readme-homepage-staging`,并实测 staging 站点随分支删除而下线。
