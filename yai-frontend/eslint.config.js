import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    env: {
      browser: true,
      es2021: true,
    },
    rules: {
      "react/prop-types": "off",
      // "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn",
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.recommended,
];
