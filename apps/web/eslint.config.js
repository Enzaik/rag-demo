import config from "@rag/eslint-config/react";

const EXCLUDED_REGISTRY_COMPONENTS = [
  "alert",
  "section-header",
  "breadcrumb",
  "metrics",
  "calendar",
  "dialog",
  "page-header",
  "header-01",
];

export default [
  ...config,
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: EXCLUDED_REGISTRY_COMPONENTS.map((name) => ({
            group: [`**/components/ui/${name}`, `@/components/ui/${name}`],
            message: `"${name}" is excluded from the registry for OSS licensing reasons — use an allow-listed component instead.`,
          })),
        },
      ],
    },
  },
];
