import fs from "fs";
import path from "path";

import { canonicalize } from "./canonicalize";

import type {
  BundleManifest,
} from "./types";

/**
 * Writes `manifest` to `<directory>/bundle.manifest.json` in canonical form.
 * The output is deterministic: identical manifests always produce identical
 * bytes on disk.
 *
 * @param manifest  - The manifest to persist.
 * @param directory - Destination bundle directory.
 */
export function writeManifest(
  manifest: BundleManifest,
  directory: string
): void {
  const manifestPath = path.join(
    directory,
    "bundle.manifest.json"
  );

  const canonical =
    canonicalize(manifest);

  fs.writeFileSync(
    manifestPath,
    canonical,
    "utf8"
  );
}




