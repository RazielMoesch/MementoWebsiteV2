import * as ort from 'onnxruntime-web';

// Configure WebAssembly paths for ONNX runtime
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

let session = null;
let isRunning = false; // Lock to prevent concurrent inference

const MODEL_W = 256;
const MODEL_H = 256;

/**
 * Initializes the ONNX inference session for the recognition model.
 * @returns {Promise<ort.InferenceSession>} The initialized session
 * @throws {Error} If the model file is inaccessible or fails to load
 */
export async function initRecognitionSession() {
  if (!session) {
    try {
      const response = await fetch('/RecognitionModel.onnx');
      if (!response.ok) {
        throw new Error(`Model file not found or inaccessible: ${response.statusText}`);
      }
      session = await ort.InferenceSession.create('/RecognitionModel.onnx');
      console.log('Recognition session initialized successfully');
    } catch (err) {
      console.error('Failed to initialize recognition session:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        details: err
      });
      throw err;
    }
  }
  return session;
}

/**
 * Preprocesses image data into a tensor for the recognition model.
 * @param {ImageData} imageData - The raw image data from a canvas
 * @returns {ort.Tensor} A tensor with shape [1, 3, MODEL_H, MODEL_W]
 */
function preprocess(imageData) {
  const data = imageData.data;
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];
  const float32Data = new Float32Array(3 * MODEL_H * MODEL_W);

  for (let i = 0; i < MODEL_H * MODEL_W; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    float32Data[i] = (r - mean[0]) / std[0];
    float32Data[i + MODEL_W * MODEL_H] = (g - mean[1]) / std[1];
    float32Data[i + 2 * MODEL_W * MODEL_H] = (b - mean[2]) / std[2];
  }

  return new ort.Tensor('float32', float32Data, [1, 3, MODEL_H, MODEL_W]);
}

/**
 * Computes cosine similarity between two embeddings.
 * @param {Float32Array} embedding1 - First embedding vector
 * @param {Float32Array} embedding2 - Second embedding vector
 * @returns {number} Cosine similarity score
 */
export function cosineSimilarity(embedding1, embedding2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (norm1 * norm2);
}

/**
 * Generates an embedding from cropped face image data.
 * @param {ImageData} imageData - Cropped face image data
 * @returns {Promise<Float32Array>} The 384-dimensional embedding
 */
export async function generateEmbedding(imageData) {
  if (isRunning) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait if another inference is running
    return generateEmbedding(imageData); // Retry
  }
  isRunning = true;
  try {
    if (!session) await initRecognitionSession();
    const inputTensor = preprocess(imageData);
    const feeds = {};
    feeds[session.inputNames[0]] = inputTensor;
    const results = await session.run(feeds);
    const outputTensor = results[session.outputNames[0]];
    console.log('Embedding generated:', outputTensor.data.slice(0, 10));
    return outputTensor.data;
  } catch (err) {
    console.error('Failed to generate embedding:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      details: err
    });
    throw err;
  } finally {
    isRunning = false;
  }
}

/**
 * Recognizes a face by comparing its embedding to known embeddings.
 * @param {ImageData} imageData - Cropped face image data
 * @param {Array} knownEmbeddings - Array of known embeddings
 * @param {number} threshold - Similarity threshold (default: 0.6)
 * @returns {Promise<Object>} Best match { name, similarity }
 */
export async function recognizeFace(imageData, knownEmbeddings, threshold = 0.6) {
  try {
    const embedding = await generateEmbedding(imageData);
    let bestMatch = { name: 'Unknown', similarity: 0 };
    for (const known of knownEmbeddings) {
      if (!known.embedding) continue;
      const similarity = cosineSimilarity(embedding, known.embedding);
      console.log(`Comparing with ${known.name}: Similarity = ${similarity.toFixed(2)}`);
      if (similarity > bestMatch.similarity && similarity >= threshold) {
        bestMatch = { name: known.name, similarity };
      }
    }
    return bestMatch;
  } catch (err) {
    console.error('Failed to recognize face:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      details: err
    });
    throw err;
  }
}