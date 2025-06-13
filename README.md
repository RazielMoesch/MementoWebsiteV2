# MementoVision

MementoVision is a full-stack web application for **facial identity verification**. It integrates a **React frontend** with **ONNX-powered machine learning models** for real-time face detection and recognition. The project is built for **speed, modularity, and ease of use**, handling ML processing directly within the frontend for a streamlined experience.

## Features

  * **Real-time face detection** and identity verification

  * **React frontend** with a clean, minimal UI

  * **Integrated ONNX models** for efficient facial recognition

  * **Modular structure** for easy extension or deployment

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

  * **Node.js** and **npm**

  * **Git**

### 1\. Clone the Repository

```
git clone https://github.com/RazielMoesch/MementoWebsiteV2.git
cd MementoWebsiteV2
```

### 2\. Run the Frontend

Navigate into the `MementoFace` directory and install the necessary dependencies, then start the development server:

```
cd MementoFace
npm install
npm run dev
```

This will start the development server, typically accessible at:

`http://localhost:5173`

## How to Test It

Once the frontend is running:

1.  Open your web browser and go to `http://localhost:5173`.

2.  **Upload a reference image** of a face you want to use for verification.

3.  **Upload a second image** or use your **webcam** to verify against the reference image.

4.  The application will then indicate whether the faces match.

## Project Structure

The main repository contains:

```
MementoWebsiteV2/
├── MementoFace/        # React frontend application with integrated ONNX models
│   ├── src/            # Source code for React components and ML logic
│   ├── public/         # Static assets
│   └── ...
└── README.md           # This documentation file
```

## License

This project is released under the **MIT License**.

© 2025 Raziel Moesch

## Contact

For questions, ideas, or collaboration opportunities:

[github.com/RazielMoesch](https://github.com/RazielMoesch)
