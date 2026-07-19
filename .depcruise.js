/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // 1. LAYER RULES
    {
      name: "domain-must-not-depend-on-application",
      comment:
        "Domain logic must remain pure and cannot depend on application orchestration.",
      severity: "error",
      from: { path: "^modules/([^/]+)/domain" },
      to: { path: "^modules/([^/]+)/application" },
    },
    {
      name: "domain-must-not-depend-on-infrastructure",
      comment:
        "Domain logic must remain pure and cannot depend on infrastructure.",
      severity: "error",
      from: { path: "^modules/([^/]+)/domain" },
      to: { path: "^modules/([^/]+)/infrastructure" },
    },
    {
      name: "domain-must-not-depend-on-presentation",
      comment:
        "Domain logic must remain pure and cannot depend on presentation.",
      severity: "error",
      from: { path: "^modules/([^/]+)/domain" },
      to: { path: "^modules/([^/]+)/presentation" },
    },
    {
      name: "application-must-not-depend-on-infrastructure",
      comment:
        "Application layer orchestration should not depend directly on concrete infrastructure implementations (except maybe types/interfaces from shared, but we prefer interfaces in Domain).",
      severity: "error",
      from: { path: "^modules/([^/]+)/application" },
      to: { path: "^modules/([^/]+)/infrastructure" },
    },
    {
      name: "application-must-not-depend-on-presentation",
      comment: "Application layer must not depend on presentation elements.",
      severity: "error",
      from: { path: "^modules/([^/]+)/application" },
      to: { path: "^modules/([^/]+)/presentation" },
    },
    {
      name: "infrastructure-must-not-depend-on-presentation",
      comment: "Infrastructure layer must not depend on presentation elements.",
      severity: "error",
      from: { path: "^modules/([^/]+)/infrastructure" },
      to: { path: "^modules/([^/]+)/presentation" },
    },

    // 2. DOMAIN RULES (Isolation)
    // Domain and application layers must be strictly isolated.
    // Presentation, actions, and components are composition roots in Next.js
    // and are allowed to wire domains together.
    {
      name: "domain-layer-cannot-import-other-domains",
      comment:
        "Domain layers must be completely isolated — only shared kernel and self-imports allowed.",
      severity: "error",
      from: { path: "^modules/([^/]+)/domain" },
      to: {
        path: "^modules/([^/]+)/",
        pathNot: ["^modules/shared/", "^modules/core/", "^modules/$1/"],
      },
    },
    {
      name: "application-layer-cannot-import-other-domains",
      comment:
        "Application layers must not reach into other domains, except via shared kernel or explicitly allowed upstream domains.",
      severity: "error",
      from: { path: "^modules/([^/]+)/application" },
      to: {
        path: "^modules/([^/]+)/",
        pathNot: [
          "^modules/shared/",
          "^modules/core/",
          "^modules/$1/",
          "^modules/reading/books/",
          "^modules/reading/library/",
        ],
      },
    },
    // The rule above is a blanket ban on cross-domain imports. Let's make explicit exemptions if any.
    // The prompt allows: "Reader -> Books"
    // BUT we don't have Reader yet. For now, this strict rule forces isolated contexts!

    // Explicit exclusions just to be extremely literal to the user's prompt (although the blanket rule already catches them):
    {
      name: "reader-cannot-depend-on-profile",
      severity: "error",
      from: { path: "^modules/reader" },
      to: { path: "^modules/user/profile" },
    },
    {
      name: "books-cannot-depend-on-library",
      severity: "error",
      from: { path: "^modules/books" },
      to: { path: "^modules/library" },
    },
    {
      name: "progress-cannot-depend-on-reader",
      severity: "error",
      from: { path: "^modules/user/progress" },
      to: { path: "^modules/reader" },
    },

    // 3. INFRASTRUCTURE RULES
    {
      name: "no-supabase-in-presentation",
      comment: "Presentation must not interact directly with Supabase clients.",
      severity: "error",
      from: { path: "^modules/([^/]+)/presentation" },
      to: { path: "@supabase" },
    },
    {
      name: "no-supabase-in-application",
      comment:
        "Application layer must not interact directly with Supabase clients.",
      severity: "error",
      from: { path: "^modules/([^/]+)/application" },
      to: { path: "@supabase" },
    },
    {
      name: "no-database-types-in-domain",
      comment: "Domain models must not import generated database schemas.",
      severity: "error",
      from: { path: "^modules/([^/]+)/domain" },
      to: { path: "types/database\\.ts" },
    },

    // 4. CROSS-PRESENTATION RULES
    {
      name: "no-cross-domain-presentation-imports",
      comment:
        "Presentation layers across different domains must not import each other to prevent UI coupling.",
      severity: "error",
      from: { path: "^modules/([^/]+)/presentation" },
      to: {
        path: "^modules/([^/]+)/presentation",
        pathNot: "^modules/$1/presentation",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
    reporterOptions: {
      archi: {
        collapsePattern: "^(node_modules|modules/[^/]+/[^/]+)",
      },
    },
  },
};
