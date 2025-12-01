import { fixupPluginRules } from '@eslint/compat';
import eslintJS from "@eslint/js";
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import typescriptEslint from 'typescript-eslint';

const patchedReactHooksPlugin = fixupPluginRules(eslintPluginReactHooks);
const patchedImportPlugin = fixupPluginRules(eslintPluginImport);

const baseESLintConfig = {
  name: "eslint",
  extends: [
    eslintJS.configs.recommended,
  ],
  rules: {
    "no-duplicate-imports": "error",
    "no-unused-private-class-members": "warn",
    "camelcase": [
      "warn",
      {
        properties: "never",
        ignoreGlobals: true,
        ignoreDestructuring: true,
        allow: [
          "^first_name$", "^last_name$", "^birth_date$", "^parent_id$", "^student_id$"
        ],
      },
    ],
    "unicorn/prevent-abbreviations": "off",
  }
};

const typescriptConfig = {
  name: "typescript",
  extends: [
    ...typescriptEslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { modules: true },
      ecmaVersion: "latest",
      project: "./tsconfig.json",
    },
    globals: {
      ...globals.builtin,
      ...globals.browser,
      ...globals.es2025,
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: "error"
  },
  plugins: {
    import: patchedImportPlugin,
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-explicit-any": "off",

    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-floating-promises": "off",

    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    // keep useful rules only
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/return-await": "warn",
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  }
};

const reactConfig = {
  name: "react",
  extends: [
    eslintPluginReact.configs.flat["jsx-runtime"],
  ],
  plugins: {
    "react-hooks": patchedReactHooksPlugin,
    "react-refresh": eslintPluginReactRefresh,
  },
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    ...patchedReactHooksPlugin.configs.recommended.rules,
    "react-refresh/only-export-components": [
      "warn", { allowConstantExport: true }
    ],
  },
};

const jsxA11yConfig = {
  name: "jsxA11y",
  ...jsxA11yPlugin.flatConfigs.recommended,
  plugins: {
    "jsx-a11y": jsxA11yPlugin,
  },
};

const unicornConfig = {
  name: "unicorn",
  plugins: {
    unicorn: eslintPluginUnicorn,
  },
  rules: {
    "unicorn/no-null": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/filename-case": "off",
  },
};

const eslintConfig = typescriptEslint.config(
  baseESLintConfig,
  typescriptConfig,
  eslintConfigPrettier,
  reactConfig,
  jsxA11yConfig,
  unicornConfig,
);

eslintConfig.map((config) => {
  config.files = ["src/**/*.ts", "src/**/*.tsx"];
});

export default eslintConfig;
