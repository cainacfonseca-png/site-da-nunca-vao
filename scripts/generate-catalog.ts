import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const publicDir = join(root, "client", "public");
const output = join(root, "client", "src", "data", "generated-products.ts");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const urlPath = (value: string) => "/" + value.split("/").map(encodeURIComponent).join("/");
const title = (value: string) => value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (char) => char.toUpperCase());

function sortImages(files: string[]) {
  return files
    .filter((file) => imageExtensions.has(file.slice(file.lastIndexOf(".")).toLowerCase()))
    .sort((a, b) => {
      const aIsCover = a.replace(/\.[^.]+$/, "").toLowerCase().startsWith("capa");
      const bIsCover = b.replace(/\.[^.]+$/, "").toLowerCase().startsWith("capa");
      if (aIsCover !== bIsCover) return aIsCover ? -1 : 1;
      return a.localeCompare(b, "pt-BR");
    });
}

function readProductRecords(directoryName: string, section: "finds" | "store", startingId: number) {
  const productsDir = join(publicDir, directoryName);
  const products: string[] = [];
  if (!existsSync(productsDir)) return products;

  const folders = readdirSync(productsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  folders.forEach((folder, index) => {
    const folderPath = join(productsDir, folder.name);
    const files = readdirSync(folderPath, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);
    const images = sortImages(files);
    const videos = files
      .filter((file) => videoExtensions.has(file.slice(file.lastIndexOf(".")).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
    const textFiles = files.filter((file) => file.toLowerCase().endsWith(".txt"));
    const purchaseUrl = textFiles
      .map((file) => readFileSync(join(folderPath, file), "utf8").trim())
      .map((text) => text.match(/https?:\/\/\S+/)?.[0] ?? "")
      .find(Boolean) ?? "";

    if (!purchaseUrl || (!images.length && !videos.length)) return;
    const folderRelative = relative(join(root, "client", "public"), folderPath).replaceAll("\\", "/");
    const imageUrls = images.map((file) => urlPath(`${folderRelative}/${file}`));
    const videoUrls = videos.map((file) => urlPath(`${folderRelative}/${file}`));
    const record = `{ id: ${startingId + index}, name: ${JSON.stringify(title(folder.name))}, section: "${section}", imageUrl: ${JSON.stringify(imageUrls[0] ?? "")}, gallery: ${JSON.stringify(imageUrls)}, videoUrl: ${JSON.stringify(videoUrls[0] ?? "")}, purchaseUrl: ${JSON.stringify(purchaseUrl)}, position: ${index}, active: true }`;
    products.push(record);
  });
  return products;
}

const storeProducts = readProductRecords("umapenca", "store", 1);
const findProducts = readProductRecords("achadinhos", "finds", 1000);
const products = [...storeProducts, ...findProducts];

mkdirSync(join(root, "client", "src", "data"), { recursive: true });
writeFileSync(output, `// Generated automatically by scripts/generate-catalog.ts.\nimport type { Product } from "./catalog";\n\nexport const generatedProducts: Product[] = [\n${products.map((product) => `  ${product},`).join("\n")}\n];\n`);
console.log(`Generated ${storeProducts.length} UmaPenca products and ${findProducts.length} achadinhos from public folders`);
