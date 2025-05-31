import { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import './Demo.css';
import { findFaces } from './DetectionModel';
import { generateEmbedding, recognizeFace } from './RecognitionModel';

const MODEL_W = 256;
const MODEL_H = 256;

const Demo = ({ knownPeople, setKnownPeople }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [frontCam, setFrontCam] = useState(true);
  const [img, setImg] = useState(null);
  const [newName, setNewName] = useState('');
  const [foundFaces, setFoundFaces] = useState([]);
  const [error, setError] = useState(null);
  const [knownEmbeddings, setKnownEmbeddings] = useState([]);
  const [recognitionFailedAlerted, setRecognitionFailedAlerted] = useState(false);

  const capture = async () => {
    const image = webcamRef.current.getScreenshot();
    if (image) {
      setImg(image);
    }
  };

  const cropFace = async (sourceCanvas, box) => {
    const { x, y, width, height } = box;
    const x1 = Math.max(0, x - width / 2);
    const y1 = Math.max(0, y - height / 2);
    const w = Math.min(width, MODEL_W - x1);
    const h = Math.min(height, MODEL_H - y1);
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = MODEL_W;
    faceCanvas.height = MODEL_H;
    const faceCtx = faceCanvas.getContext('2d');
    faceCtx.drawImage(sourceCanvas, x1, y1, w, h, 0, 0, MODEL_W, MODEL_H);
    const croppedImageData = faceCtx.getImageData(0, 0, MODEL_W, MODEL_H);
    const croppedImage = faceCanvas.toDataURL('image/jpeg');
    return { croppedImageData, croppedImage };
  };

  const handleNewPerson = async () => {
    if (img && newName.trim() !== '') {
      const imgElement = new Image();
      imgElement.src = img;
      await new Promise((resolve) => (imgElement.onload = resolve));
      const canvas = document.createElement('canvas');
      canvas.width = MODEL_W;
      canvas.height = MODEL_H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0, MODEL_W, MODEL_H);

      try {
        const detections = await findFaces(canvas);
        if (detections.length !== 1) {
          alert('Please capture an image with exactly one face.');
          return;
        }
        const { croppedImageData, croppedImage } = await cropFace(canvas, detections[0]);
        const embedding = await generateEmbedding(croppedImageData);
        setKnownPeople([...knownPeople, { image: croppedImage, name: newName }]);
        setKnownEmbeddings([...knownEmbeddings, { name: newName, embedding }]);
      } catch (err) {
        if (!recognitionFailedAlerted) {
          alert('Face recognition failed. Detection will continue without recognition.');
          setRecognitionFailedAlerted(true);
        }
        setKnownPeople([...knownPeople, { image: img, name: newName }]);
        setKnownEmbeddings([...knownEmbeddings, { name: newName, embedding: null }]);
      }
      setImg(null);
      setNewName('');
    }
  };

  const removePerson = (index) => {
    setKnownPeople(knownPeople.filter((_, i) => i !== index));
    setKnownEmbeddings(knownEmbeddings.filter((_, i) => i !== index));
  };

  const detect = useCallback(async () => {
    try {
      const video = webcamRef.current?.video;
      if (video && video.readyState === 4) {
        const detections = await findFaces(video);
        const canvas = document.createElement('canvas');
        canvas.width = MODEL_W;
        canvas.height = MODEL_H;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, MODEL_W, MODEL_H);

        const results = [];
        for (const box of detections) {
          const { croppedImageData } = await cropFace(canvas, box);
          try {
            const match = await recognizeFace(croppedImageData, knownEmbeddings.filter((e) => e.embedding !== null));
            results.push({ ...box, name: match.name, similarity: match.similarity });
          } catch (err) {
            if (!recognitionFailedAlerted) {
              alert('Face recognition failed. Detection will continue without recognition.');
              setRecognitionFailedAlerted(true);
            }
            results.push({ ...box, name: 'Unknown', similarity: 0 });
          }
        }

        setFoundFaces(results);
        drawDetections(results, video);
      }
    } catch (err) {
      setError('Face detection failed. Check detection model or webcam.');
    }
  }, [webcamRef, knownEmbeddings, recognitionFailedAlerted]);

  const drawDetections = (boxes, video) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleX = canvas.width / MODEL_W;
    const scaleY = canvas.height / MODEL_H;

    boxes.forEach(({ x, y, width, height, conf, name, similarity }) => {
      if (conf < 0.1) return;
      const x1 = (x - width / 2) * scaleX;
      const y1 = (y - height / 2) * scaleY;
      const w = width * scaleX;
      const h = height * scaleY;
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, w, h);
      ctx.fillStyle = 'red';
      ctx.font = '14px Arial';
      const label = name === 'Unknown' ? `Unknown ` : `${name} `;
      // (${conf.toFixed(2)})
      //  (${conf.toFixed(2)}, ${similarity.toFixed(2)})
      ctx.fillText(label, x1 + 4, y1 - 4);
    });
  };

  useEffect(() => {
    const interval = setInterval(detect, 1500);
    return () => clearInterval(interval);
  }, [detect]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="demo-container">
      <div className="webcam-side" style={{ position: 'relative', width: '600px', height: '400px' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 1080, height: 720, facingMode: frontCam ? 'user' : 'environment' }}
          style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            borderRadius: '12px',
            width: '100%',
            height: '100%',
          }}
        />
        <div className="btn-group">
          <button onClick={capture}>📸 Capture</button>
          <button onClick={() => setFrontCam(!frontCam)}>🔄 Flip</button>
        </div>
      </div>

      <div className="controls-side">
        <h2>Captured Preview</h2>
        {img && <img src={img} alt="Preview" style={{ maxWidth: '200px' }} />}
        <input type="text" placeholder="Enter name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button onClick={handleNewPerson}>➕ Add Face</button>

        <h2 style={{ marginTop: '1rem' }}>Known Faces</h2>
        <div className="known-gallery">
          {knownPeople.map((person, i) => (
            <div key={i} className="face-card">
              <img src={person.image} alt={person.name} style={{ width: '100px', height: '100px' }} />
              <p>{i + 1}. {person.name}</p>
              <button onClick={() => removePerson(i)}>🗑️ Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Demo;