let pipelineInstance = null;

/**
 * Initializes and returns the Transformers.js pipeline.
 */
async function getPipeline() {
  if (!pipelineInstance) {
    console.log("Loading AI model for semantic search...");
    const { pipeline } = await import('@xenova/transformers');
    // Using a lightweight model that performs well for semantic search
    pipelineInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true, // Uses less memory
    });
    console.log("AI model loaded successfully!");
  }
  return pipelineInstance;
}

/**
 * Generates an embedding (vector array) for a given text.
 * @param {string} text - The text to vectorize.
 * @returns {Promise<number[]>} - Array of floats representing the embedding.
 */
exports.generateEmbedding = async (text) => {
  if (!text) {
    return [];
  }
  const strText = String(text);
  if (strText.trim() === '') {
    return [];
  }
  const finalText = strText;
  try {
    const pipe = await getPipeline();
    const output = await pipe(finalText, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating embedding:", error);
    return [];
  }
};

/**
 * Calculates the cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 is identical.
 */
exports.cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};
