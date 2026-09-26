# coderabbit

Central [CodeRabbit](https://coderabbit.ai) configuration for the
`frostney` repositories.

## How it applies

CodeRabbit reads a repository named `coderabbit` on the account as
[central configuration](https://docs.coderabbit.ai/configuration/central-configuration):

- A repository **without** its own `.coderabbit.yaml` or
  `.coderabbit.config.ts` uses `.coderabbit.config.ts` from here.
- A repository **with** its own file uses that file instead. To keep the
  shared settings, it sets `inheritance: true` (YAML or TypeScript), which
  falls through to this repository for every value it does not set.
- A committed `.coderabbit.yaml` beats a `.coderabbit.config.ts` in the
  same repository.

### Inheritance

A CodeRabbit file **replaces** every lower-priority source unless it sets
[`inheritance: true`](https://docs.coderabbit.ai/configuration/configuration-inheritance).
Without it, a file sends every value it does not mention back to the
schema default — including everything configured in the CodeRabbit web
UI. `base.ts` therefore sets `inheritance: true`: the values here win and
the rest falls through to the UI settings, then the defaults. Objects
merge deeply, scalars from the higher level win, and arrays list the
higher level's items first.

Precedence, highest first: the repository's file, this central
repository, repository UI settings, organisation UI settings, schema
defaults. Each level passes on to the next only if it sets
`inheritance: true`.

`includeRemote({ path: "base.ts" })` from `@coderabbitai/config` is the
alternative for a repository that wants the shared fragment without
inheriting: it always reads from the owner's own `coderabbit`
repository (`@coderabbitai/config` 0.1.0), so it covers `frostney`
repositories only. Another account or organisation (e.g.
`signalovernoise-ai`) needs its own `coderabbit` repository.

## What is shared

| Setting | Value | Why |
| --- | --- | --- |
| `inheritance` | `true` | Keeps the CodeRabbit web-UI settings in force; see [Inheritance](#inheritance). |
| `reviews.auto_review.base_branches` | `[".*"]` | Stacked pull requests target the layer below them; without this, CodeRabbit reviews only pull requests into the default branch. |

## Shared functions

`lib/` holds functions for repository configs, apart from the shared data in
`base.ts`. A repository config loads them with `includeRemote`, which
passes a module's exports through at runtime even though its type says
config object; a repository config cannot import this repository any other
way (bare imports are rejected).

| Function | File | Use |
| --- | --- | --- |
| `excludeVendoredSkills(lock)` | `lib/skills.ts` | Excludes every skill listed in the repository's `skills-lock.json` (vendored by the skills CLI) from review; project-authored skills under `.agents/skills` stay reviewed. Keeps `inheritance: true`. |

A repository that vendors skills carries this `.coderabbit.config.ts`:

```ts
import { defineConfig, includeRemote } from "@coderabbitai/config"
import lock from "./skills-lock.yaml"

const { excludeVendoredSkills } = includeRemote({
  path: "lib/skills.ts",
}) as unknown as { excludeVendoredSkills(lock: unknown): object }

export default defineConfig(excludeVendoredSkills(lock))
```

plus `skills-lock.yaml`, a symlink to `skills-lock.json`
(`ln -s skills-lock.json skills-lock.yaml`). Only a file inside the
reviewed repository can read its lock, and CodeRabbit's config sandbox
imports `.yaml` but not `.json` (with or without an import attribute); JSON
is valid YAML.

## Checking the resolved configuration

Comment `@coderabbitai configuration` on a pull request in any repository:
CodeRabbit replies with the fully resolved configuration and the source of
each value.

## Constraints

`.coderabbit.config.ts` and its includes are evaluated by CodeRabbit in a
sandbox: only `@coderabbitai/config`, relative imports and `includeRemote`
are allowed (no npm packages, no network), with a 10 s evaluation limit.
The `@coderabbitai/config` package is only needed locally for editor types.
