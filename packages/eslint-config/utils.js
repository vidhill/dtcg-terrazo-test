import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Dynamically generates package groups by reading the monorepo structure.
 * This ensures the ESLint rules automatically adapt to new packages/apps.
 *
 * @param {string} currentPackageDir - The directory of the current package
 * @returns {string[]} Array of relative import patterns to restrict
 */
function generatePackageGroups(currentPackageDir) {
  const packagesDir = join(currentPackageDir, "../..", "packages");

  const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `**/${dirent.name}/src/**/*`);

  return packages;
}

export { generatePackageGroups };
