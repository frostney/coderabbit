// Shared functions for repository configs: import through includeRemote,
// which passes a module's exports through at runtime (a repository config
// cannot import this repository any other way).
//
//   import { defineConfig, includeRemote } from "@coderabbitai/config"
//   import lock from "./skills-lock.yaml"
//
//   const { excludeVendoredSkills } = includeRemote({
//     path: "lib/skills.ts",
//   }) as unknown as { excludeVendoredSkills(lock: unknown): object }
//
//   export default defineConfig(excludeVendoredSkills(lock))
//
// Data (shared settings) lives in base.ts; this file only holds functions.

interface SkillsLock {
  skills: Record<string, unknown>
}

// Review scope for Agent Skills. Every skill listed in the repository's
// skills-lock.json is vendored by the skills CLI and refreshed from upstream,
// so review findings on it belong upstream: exclude it. A skill under
// .agents/skills that the lock does not list is project-authored and stays
// reviewed. Inheritance stays on, so the central settings and the web-UI
// settings still apply.
//
// The repository passes its lock as `./skills-lock.yaml`, a symlink to
// skills-lock.json: CodeRabbit's config sandbox cannot import .json (with or
// without an import attribute), and JSON is valid YAML.
export function excludeVendoredSkills(lock: SkillsLock) {
  return {
    inheritance: true,
    reviews: {
      path_filters: Object.keys(lock.skills).map(
        (name) => `!.agents/skills/${name}/**`,
      ),
    },
  }
}

export default { excludeVendoredSkills }
