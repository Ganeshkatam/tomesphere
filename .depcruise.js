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
        "Application layer handlers should not depend directly on concrete infrastructure (except composition roots like facades, factories, and event dispatchers).",
      severity: "error",
      from: {
        path: "^modules/([^/]+)/application",
        pathNot: "(facades|factory|index\\.ts|handler\\.ts|event-handlers|queries/[^/]+/index\\.ts)",
      },
      to: { path: "^modules/([^/]+)/infrastructure" },
    },
    {
      name: "application-must-not-depend-on-presentation",
      comment: "Application core must not depend on presentation components.",
      severity: "error",
      from: {
        path: "^modules/([^/]+)/application",
        pathNot: "(facades|ReaderService|services)",
      },
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
        "Application layer handlers must remain isolated to their bounded context, except composite page facades and event handlers.",
      severity: "error",
      from: {
        path: "^modules/([^/]+)/application",
        pathNot: "^modules/(home|reader|account|landing|progress|me)/application",
      },
      to: {
        path: "^modules/([^/]+)/",
        pathNot: [
          "^modules/shared/",
          "^modules/core/",
          "^modules/$1/",
          "^modules/books/",
          "^modules/library/",
          "^modules/user/",
        ],
      },
    },

    // 3. INFRASTRUCTURE RULES
    {
      name: "no-supabase-in-presentation",
      comment: "Presentation must not interact directly with Supabase clients.",
      severity: "error",
      from: { path: "^modules/([^/]+)/presentation" },
      to: {
        path: "@supabase",
        dependencyTypesNot: ["type-only"],
      },
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
        "Presentation layers across different domains must not import each other directly.",
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
