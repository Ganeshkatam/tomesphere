import next from "eslint-config-next";

const eslintConfig = [
  {
    ignores: ["archive/**/*"],
  },
  ...(Array.isArray(next) ? next : [next]),
  {
    files: ["modules/reading/books/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/modules/!(reading/books|shared/core|shared/navigation|reading/search)/**/*",
              ],
              message:
                "Books module is restricted from importing other feature modules directly.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["modules/reading/reader/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/modules/!(reading/reader|shared/core|shared/navigation)/**/*",
              ],
              message:
                "Reader module must remain isolated and cannot import from other feature modules.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["modules/learning/analytics/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/modules/!(learning/analytics|shared/core|shared/navigation|reading/books)/**/*",
              ],
              message:
                "Analytics module is restricted from importing other feature modules directly.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["modules/shared/ui/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/!(shared/ui)/**/*"],
              message:
                "Shared UI components must remain completely domain-agnostic and are restricted from importing feature modules.",
            },
          ],
        },
      ],
    },
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
