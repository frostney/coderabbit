# Agent Instructions

This repository is CodeRabbit's central configuration for the `frostney`
account. Every repository without its own CodeRabbit file inherits
`.coderabbit.config.ts`; repositories with their own file include
`base.ts` via `includeRemote({ path: "base.ts" })`, which always reads
from the owner's `coderabbit` repository.

## Rules

- Shared settings go in `base.ts`; `.coderabbit.config.ts` only exports
  it. Keep `base.ts` a plain default-exported object so `includeRemote`
  and `mergeConfig` can consume it.
- Only `@coderabbitai/config`, relative imports and `includeRemote` may be
  imported — CodeRabbit evaluates the files in a sandbox without npm
  packages or network access.
- `base.ts` must keep `inheritance: true`. Without it the central file
  replaces the CodeRabbit web-UI settings wholesale and every value it
  does not set drops to the schema default, in every repository.
- A change here alters review behaviour in every inheriting repository
  and outranks their web-UI settings. Record each shared setting and its
  reason in the README table.
- Verify a change on a real pull request with `@coderabbitai configuration`
  before relying on it: the dashboard values must still show their
  `Organization UI` source.
