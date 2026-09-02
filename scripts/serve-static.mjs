import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const host = "0.0.0.0";
const port = Number(process.env.PORT || 8080);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".task": "application/octet-stream",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function insideDist(filePath) {
  const resolved = resolve(filePath);
  return resolved === dist || resolved.startsWith(dist + sep);
}

function requestedFile(urlPath) {
  const raw = decodeURIComponent((urlPath || "/").split("?")[0] || "/");
  const relative = raw === "/" ? "index.html" : raw.replace(/^\/+/, "");
  return normalize(join(dist, relative));
}

async function existingFile(filePath) {
  if (!insideDist(filePath)) return null;
  try {
    const info = await stat(filePath);
    if (info.isFile()) return filePath;
    if (info.isDirectory()) {
      const index = join(filePath, "index.html");
      if (insideDist(index) && (await stat(index)).isFile()) return index;
    }
  } catch {
    return null;
  }
  return null;
}

const server = createServer(async (req, res) => {
  const filePath = requestedFile(req.url || "/");
  const found = (await existingFile(filePath)) ?? (await existingFile(join(dist, "index.html")));
  if (!found) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const body = await readFile(found);
  res.writeHead(200, {
    "Content-Type": types[extname(found)] || "application/octet-stream",
    "Cache-Control": found.endsWith("index.html") ? "no-store" : "public, max-age=31536000, immutable",
  });
  res.end(body);
});

server.listen(port, host, () => {
  console.log(`AestheticAI listening on http://${host}:${port}`);
});
