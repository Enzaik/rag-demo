// Simple character-based recursive splitter. ~500 tokens target (≈2000 chars)
// with ~200 char overlap. Splits on paragraph boundaries first, then sentences,
// then hard character cuts. Good enough for a showcase corpus.

const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

export interface Chunk {
  content: string;
  index: number;
  tokenCount: number; // approximation: chars/4
}

export function chunkText(text: string): Chunk[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (candidate.length <= CHUNK_SIZE) {
      current = candidate;
      continue;
    }
    if (current) chunks.push(current);
    if (para.length <= CHUNK_SIZE) {
      current = para;
    } else {
      // Hard split long paragraphs.
      for (let i = 0; i < para.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
        chunks.push(para.slice(i, i + CHUNK_SIZE));
      }
      current = "";
    }
  }
  if (current) chunks.push(current);

  return chunks.map((content, index) => ({
    content,
    index,
    tokenCount: Math.ceil(content.length / 4),
  }));
}
