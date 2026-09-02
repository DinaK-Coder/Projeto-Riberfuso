/**
 * Regenera public/catalog/products.json a partir do PDF de cadastro.
 *
 * Uso:
 *   npm i -D pdf-parse
 *   node scripts/import-catalog.mjs "C:\caminho\listaprodutosprecoriberfusovilanova.pdf"
 *
 * Não publica preços. Apenas código + descrição + linha aproximada.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfPath = process.argv[2];

if (!pdfPath) {
  console.error("Informe o caminho do PDF.");
  process.exit(1);
}

function categoryFor(name) {
  const u = name
    .toUpperCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  if (
    /FURADEIRA|PARAFUSADEIRA|MARTELETE|ESMERILH|LIXADEIRA|SERRA TICO|SERRA CIRC|PLAINA ELE|ESQUADREJA/.test(
      u,
    )
  ) {
    return "ferramentas-eletricas";
  }
  if (/COMPRESSOR|\bPRENSA\b|GUINCHO|\bTORNO\b|SOLDADORA|MOTO.?SERRA/.test(u)) {
    return "maquinas";
  }
  if (/TRATOR|\bARADO\b|RECUPERADOR/.test(u)) return "linha-trator";
  if (
    /DOBRADI|GRAMPO|CABO DE ACO|ELETRODO|CANTONEIRA|BARRA CHATA|BARRA REDONDA|BARRA SEXT/.test(
      u,
    )
  ) {
    return "serralheria";
  }
  if (
    /DISCO DE CORTE|DISCO DE DESB|DISCO FLAP|\bLIXA\b|ABRASIV|ESCOVA DE ACO/.test(
      u,
    )
  ) {
    return "abrasivos";
  }
  if (
    /ALICATE|CHAVE COMB|CHAVE FIXA|CHAVE ALLEN|CHAVE TORX|CHAVE PHILL|MARTELO|CATRACA|SOQUETE|SERROTE|\bLIMA\b|TALHADEIRA|PUNCAO|ALAVANCA|TESOURA|CHAVE DE FENDA|CHAVE DE BOCA/.test(
      u,
    )
  ) {
    return "ferramentas-manuais";
  }
  if (/\bPORCA\b|ARRUELA|ANEL ELAST|O RING/.test(u)) return "porcas-arruelas";
  if (
    /ZN\.PARAF|PARAF\.SEXT|PARAF\.FRANC|PARAF\.AUTO|PARAF\.MAQ|\bPARAFUSO\b|PARAF\./.test(
      u,
    )
  ) {
    return "parafusos";
  }
  if (
    /\bBROCA\b|\bBIT\b|\bBITS\b|MANDRIL|ADAPTADOR|EXTENSAO|ABRACAD|ABRACADEIRA|\bNYLON\b/.test(
      u,
    )
  ) {
    return "acessorios";
  }
  if (
    /CAPACETE|\bLUVA\b|OCULOS|\bTRENA\b|\bNIVEL\b|ESQUADRO|PAQUIMETRO|\bEPI\b|PROTETOR/.test(
      u,
    )
  ) {
    return "equipamentos-profissionais";
  }
  return "outros";
}

const { PDFParse } = require("pdf-parse");
const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
const result = await parser.getText();
const lines = result.text
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);
const products = [];
const seen = new Set();

for (const line of lines) {
  const match = line.match(/^(\d{8})\s+(.+)$/);
  if (!match || seen.has(match[1])) continue;
  seen.add(match[1]);
  const name = match[2].replace(/\s+/g, " ").trim();
  products.push({ c: match[1], n: name, g: categoryFor(name) });
}

products.sort((a, b) => a.n.localeCompare(b.n, "pt-BR"));
const outDir = path.join(process.cwd(), "public", "catalog");
fs.mkdirSync(outDir, { recursive: true });
const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  source: path.basename(pdfPath),
  count: products.length,
  products,
};
fs.writeFileSync(path.join(outDir, "products.json"), JSON.stringify(payload));
const counts = {};
for (const product of products) counts[product.g] = (counts[product.g] || 0) + 1;
fs.writeFileSync(
  path.join(outDir, "index.json"),
  JSON.stringify({ count: products.length, categories: counts }, null, 2),
);
console.log(`Exportados ${products.length} produtos → public/catalog/products.json`);
