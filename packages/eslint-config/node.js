import globals from "globals";
import base from "./base.js";

export default [
  ...base,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // Nest uses decorators + class metadata heavily; loosen rules that
      // conflict with that style.
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
