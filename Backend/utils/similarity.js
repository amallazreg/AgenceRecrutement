// utils/similarity.js

function calculateSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  // Normalisation basique
  text1 = text1.toLowerCase();
  text2 = text2.toLowerCase();

  const words1 = text1.split(/\W+/);
  const words2 = text2.split(/\W+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  // Intersection
  const intersection = [...set1].filter(word => set2.has(word));

  // Union
  const union = new Set([...set1, ...set2]);

  // Score Jaccard
  const score = intersection.length / union.size;

  return score;
}

module.exports = { calculateSimilarity };
