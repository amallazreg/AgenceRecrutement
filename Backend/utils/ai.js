const { pipeline } = require("@xenova/transformers");

let embedder;

async function embedText(text) {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  const embedding = await embedder(text, { pooling: "mean", normalize: true });
  return embedding.data;
}

module.exports = { embedText };