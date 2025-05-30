import * as ort from 'onnxruntime-web';

// Set the WASM files to load from the CDN
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

let session = null;

const MODEL_W = 256;
const MODEL_H = 256;

export async function initSession() {
  if (!session) {
    session = await ort.InferenceSession.create('/DetectionModel.onnx');
  }
  return session;
}

function softSigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function decodePredictions(preds, confThresh = 0.1) {
  const [B, C, H, W] = [1, preds.dims[1], preds.dims[2], preds.dims[3]];
  const data = preds.data;
  const strideX = MODEL_W / W;
  const strideY = MODEL_H / H;
  const boxes = [];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const px = data[idx];
      const py = data[H * W + idx];
      const pw = data[2 * H * W + idx];
      const ph = data[3 * H * W + idx];
      const confLogit = data[4 * H * W + idx];
      const conf = softSigmoid(confLogit);

      if (conf > confThresh) {
        const cx = (x + px) * strideX;
        const cy = (y + py) * strideY;
        const w = pw * strideX;
        const h = ph * strideY;
        boxes.push({ x: cx, y: cy, width: w, height: h, conf });
      }
    }
  }

  return boxes;
}

function preprocess(video) {
  const canvas = document.createElement('canvas');
  canvas.width = MODEL_W;
  canvas.height = MODEL_H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, MODEL_W, MODEL_H);
  const imageData = ctx.getImageData(0, 0, MODEL_W, MODEL_H);
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

export async function findFaces(video) {
  if (!session) await initSession();
  const inputTensor = preprocess(video);
  const feeds = {};
  feeds[session.inputNames[0]] = inputTensor;
  const results = await session.run(feeds);
  const outputTensor = results[session.outputNames[0]];
  return decodePredictions(outputTensor, 0.1);
}