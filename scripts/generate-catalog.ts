import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const productsDir = join(root, "client", "public", "achadinhos");
const output = join(root, "client", "src", "data", "generated-products.ts");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const urlPath = (value: string) => "/" + value.split("/").map(encodeURIComponent).join("/");
const title = (value: string) => value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (char) => char.toUpperCase());

const products: string[] = [];
if (existsSync(productsDir)) {
  const folders = readdirSync(productsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  folders.forEach((folder, index) => {
    const folderPath = join(productsDir, folder.name);
    const files = readdirSync(folderPath, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name);
    const images = files.filter((file) => imageExtensions.has(file.slice(file.lastIndexOf(".")).toLowerCase()));
    const videos = files.filter((file) => videoExtensions.has(file.slice(file.lastIndexOf(".")).toLowerCase()));
    const textFiles = files.filter((file) => file.toLowerCase().endsWith(".txt"));
    const purchaseUrl = textFiles.map((file) => readFileSync(join(folderPath, file), "utf8").trim()).map((text) => text.match(/https?:\/\/\S+/)?.[0] ?? "").find(Boolean) ?? "";
    if (!purchaseUrl || (!images.length && !videos.length)) return;
    const folderRelative = relative(join(root, "client", "public"), folderPath).replaceAll("\\", "/");
    const imageUrls = images.map((file) => urlPath(`${folderRelative}/${file}`));
    const videoUrls = videos.map((file) => urlPath(`${folderRelative}/${file}`));
    const record = `{ id: ${1000 + index}, name: ${JSON.stringify(title(folder.name))}, section: "finds", imageUrl: ${JSON.stringify(imageUrls[0] ?? "")}, gallery: ${JSON.stringify(imageUrls)}, videoUrl: ${JSON.stringify(videoUrls[0] ?? "")}, purchaseUrl: ${JSON.stringify(purchaseUrl)}, position: ${index}, active: true }`;
    products.push(record);
  });
}

mkdirSync(join(root, "client", "src", "data"), { recursive: true });
writeFileSync(output, `// Generated automatically by scripts/generate-catalog.ts.\nimport type { Product } from "./catalog";\n\nexport const generatedProducts: Product[] = [\n${products.map((product) => `  ${product},`).join("\n")}\n];\n`);
console.log(`Generated ${products.length} products from ${productsDir}`);
