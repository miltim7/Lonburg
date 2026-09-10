import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");

const result = spawnSync(process.execPath, [nextCli, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_OUTPUT: "export",
    NEXT_PUBLIC_ESTIMATE_FORM_ENDPOINT: "/send.php",
  },
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
