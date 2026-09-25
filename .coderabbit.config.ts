// Central CodeRabbit configuration: inherited by every frostney repository
// that has no `.coderabbit.yaml` / `.coderabbit.config.ts` of its own.
// The shared settings live in base.ts so repositories with their own file
// can include the same fragment (see base.ts).
import { defineConfig } from "@coderabbitai/config"
import base from "./base"

export default defineConfig(base)
