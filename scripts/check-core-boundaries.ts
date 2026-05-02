import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const coreSourceDirectory =
  join(
    process.cwd(),
    "packages/core/src"
  );

const sourceExtensions =
  new Set([
    ".ts",
    ".tsx",
    ".mts",
    ".cts",
    ".js",
    ".mjs",
    ".cjs",
  ]);

const forbiddenPatterns = [
  /^fastify$/,
  /^@fastify\//,
  /^redis$/,
  /^@aws-sdk\//,
  /^express$/,
  /^swagger-ui-express$/,
  /^openapi-types$/,
];

function walk(
  directory: string
): string[] {
  const files: string[] = [];

  for (
    const entry of
    readdirSync(directory)
  ) {
    const fullPath =
      join(
        directory,
        entry
      );

    const stats =
      statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(
        ...walk(fullPath)
      );
      continue;
    }

    for (
      const extension of
      sourceExtensions
    ) {
      if (
        fullPath.endsWith(
          extension
        )
      ) {
        files.push(fullPath);
        break;
      }
    }
  }

  return files;
}

function extractSpecifiers(
  content: string
): string[] {
  const specifiers: string[] =
    [];

  const importRegex =
    /import\s+(?:type\s+)?(?:[^'"`;]+?\s+from\s+)?['"]([^'"\n]+)['"]/g;

  const exportFromRegex =
    /export\s+(?:type\s+)?(?:\*|\{[^}]*\})\s+from\s+['"]([^'"\n]+)['"]/g;

  const dynamicImportRegex =
    /import\(\s*['"]([^'"\n]+)['"]\s*\)/g;

  for (
    const regex of [
      importRegex,
      exportFromRegex,
      dynamicImportRegex,
    ]
  ) {
    let match:
      | RegExpExecArray
      | null;

    while (
      (match =
        regex.exec(
          content
        )) !== null
    ) {
      specifiers.push(
        match[1]
      );
    }
  }

  return specifiers;
}

const violations:
  Array<{
    file: string;
    specifier: string;
  }> = [];

for (
  const file of
  walk(coreSourceDirectory)
) {
  const content =
    readFileSync(
      file,
      "utf8"
    );

  for (
    const specifier of
    extractSpecifiers(content)
  ) {
    if (
      forbiddenPatterns.some(
        (pattern) =>
          pattern.test(
            specifier
          )
      )
    ) {
      violations.push({
        file: relative(
          process.cwd(),
          file
        ),
        specifier,
      });
    }
  }
}

if (
  violations.length > 0
) {
  console.error(
    "Core boundary violation(s) detected in packages/core/src:"
  );

  for (
    const violation of
    violations
  ) {
    console.error(
      `- ${violation.file}: forbidden import "${violation.specifier}"`
    );
  }

  process.exit(1);
}

console.log(
  "Core boundary check passed: no forbidden infrastructure imports found in packages/core/src."
);
