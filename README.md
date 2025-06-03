````markdown
# MementoVision

MementoVision is a full-stack web application for facial identity verification. It integrates a React frontend with a FastAPI backend powered by models from [MementoML](https://github.com/RazielMoesch/MementoML). The project is built for speed, modularity, and ease of use, with real-time face detection and recognition capabilities.

---

## Features

- Real-time face detection and identity verification
- React frontend with clean, minimal UI
- FastAPI backend serving pre-trained facial recognition models
- Modular structure for easy extension or deployment

---

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.9 or higher
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/RazielMoesch/MementoWebsiteV2.git
cd MementoWebsiteV2
````

### 2. Run the Frontend

```bash
cd MementoFace
npm install
npm run dev
```

This will start the development server on:

```
http://localhost:5173
```

### 3. Start the Backend

If not already running, clone and run the MementoML backend:

```bash
git clone https://github.com/RazielMoesch/MementoML.git
cd MementoML
pip install -r requirements.txt
uvicorn api.main:app --reload
```

The backend will run at:

```
http://localhost:8000
```

You can configure the frontend to point to the backend via environment variables or directly in the code.

---

## How to Test It

1. Go to `http://localhost:5173`
2. Upload a reference image of a face you want to use for verification
3. Upload a second image or use your webcam to verify against the reference
4. The app will tell you whether the faces match

---

## Project Structure

```
MementoWebsiteV2/
├── MementoFace/        # React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── MementoML/          # (Optional) Face recognition models (can also be separate)
└── README.md
```

---

## License

MIT License © 2025 Raziel Moesch

---

## Contact

For questions, ideas, or collaboration opportunities:
[github.com/RazielMoesch](https://github.com/RazielMoesch)

