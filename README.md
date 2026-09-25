# coderabbit

Central [CodeRabbit](https://coderabbit.ai) configuration for the
`frostney` repositories.

## How it applies

CodeRabbit reads a repository named `coderabbit` on the account as
[central configuration](https://docs.coderabbit.ai/configuration/central-configuration):

- A repository **without** its own `.coderabbit.yaml` or
  `.coderabbit.config.ts` inherits `.coderabbit.config.ts` from here.
- A repository **with** its own file uses that file instead. To keep the
  shared settings, it includes `base.ts` explicitly and adds to it:

  ```ts
  import { defineConfig, mergeConfig, includeRemote } from "@coderabbitai/config"

  export default defineConfig(
    mergeConfig(
      includeRemote({ path: "base.ts" }),
      { reviews: { /* repository-specific settings */ } },
    ),
  )
  ```

- `includeRemote` always reads from the owner's own `coderabbit`
  repository — the source repository is not configurable
  (`@coderabbitai/config` 0.1.0) — so this covers `frostney` repositories
  only. Another account or organisation (e.g. `signalovernoise-ai`) needs
  its own `coderabbit` repository.
- A committed `.coderabbit.yaml` beats a `.coderabbit.config.ts` in the
  same repository; a repository that wants the shared base converts its
  YAML to TypeScript.

Precedence, highest first: global overrides, the repository's file, this
central repository, repository UI settings, organisation UI settings,
workspace settings, schema defaults. Central configuration therefore
overrides settings made in the CodeRabbit web UI for a repository.

## What is shared

| Setting | Value | Why |
| --- | --- | --- |
| `reviews.auto_review.base_branches` | `[".*"]` | Stacked pull requests target the layer below them; without this, CodeRabbit reviews only pull requests into the default branch. |

## Checking the resolved configuration

Comment `@coderabbitai configuration` on a pull request in any repository:
CodeRabbit replies with the fully resolved configuration and the source of
each value.

## Constraints

`.coderabbit.config.ts` and its includes are evaluated by CodeRabbit in a
sandbox: only `@coderabbitai/config`, relative imports and `includeRemote`
are allowed (no npm packages, no network), with a 10 s evaluation limit.
The `@coderabbitai/config` package is only needed locally for editor types.
