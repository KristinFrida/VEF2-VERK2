import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**/*", "node_modules/**/*"],
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    ...js.configs.recommended,

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      'no-restricted-syntax': 0,
      'import/prefer-default-export': 0,
      'import/no-extraneous-dependencies': 0,
      'no-param-reassign': 0,
      quotes: ['error', 'single'],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info', 'group', 'groupCollapsed', 'groupEnd'],
        },
      ],
      'import/extensions': 0,
      'max-len': [
        'warn',
        {
          code: 100,
          ignoreUrls: true,
          ignoreComments: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
];