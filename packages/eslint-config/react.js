import globals from "globals";
import base from "./base.js";

// Untitled-UI components that are excluded from this project for
// licensing reasons. Imports from these files are blocked at lint time.
const FORBIDDEN_UI_COMPONENTS = [
  "section-header",
  "breadcrumb",
  "metrics",
  "calendar",
  "dialog",
  "page-header",
  "header-01",
];

const forbiddenPatterns = FORBIDDEN_UI_COMPONENTS.flatMap((name) => [
  `**/components/ui/${name}`,
  `**/components/ui/${name}/**`,
  `@/components/ui/${name}`,
  `@/components/ui/${name}/**`,
]);

export default [
  ...base,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: forbiddenPatterns.map((pattern) => ({
            group: [pattern],
            message:
              "This component is excluded from this project for licensing reasons. Use token-based markup instead.",
          })),
        },
      ],
    },
  },
];
