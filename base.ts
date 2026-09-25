// Shared CodeRabbit settings for frostney repositories.
//
// Every repository without its own CodeRabbit file inherits this through
// the central `.coderabbit.config.ts` beside it. A repository that keeps
// its own policy pulls it in explicitly and adds to it:
//
//   import { defineConfig, mergeConfig, includeRemote } from "@coderabbitai/config"
//
//   export default defineConfig(
//     mergeConfig(
//       includeRemote({ path: "base.ts" }),
//       { reviews: { /* repository-specific settings */ } },
//     ),
//   )
//
// includeRemote always reads from the owner's own `coderabbit` repository
// (@coderabbitai/config 0.1.0: "the source repository is not configurable
// for now"), so this works for frostney repositories only; another account
// or organisation needs its own `coderabbit` repository. mergeConfig merges
// objects recursively, concatenates arrays and lets the later scalar win.
export default {
  reviews: {
    auto_review: {
      // Stacked pull requests target the layer below them, not the default
      // branch. CodeRabbit reviews only the default branch unless others
      // are listed here, so without this every layer above the bottom of a
      // stack is skipped ("reviews are disabled for this base branch").
      base_branches: [".*"],
    },
  },
}
