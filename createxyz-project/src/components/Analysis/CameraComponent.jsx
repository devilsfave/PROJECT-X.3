import React, { useState, useRef, useCallback } from 'react';
import ButtonStyling from "../ButtonStyling";
import { loadModel, predictImage } from '../../ml/modelLoader';

function CameraComponent({ setShowCamera, setAnalysisResult, setCurrentTab }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadModel().catch(console.error);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const processImage = useCallback(async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    try {
      const imageData = canvasRef.current.getContext('2d').getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const result = await predictImage(imageData);
      setAnalysisResult(result);
      setCurrentTab('results');
      setShowCamera(false);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
    } finally {
      setIsLoading(false);
    }
  }, [capturedImage, setAnalysisResult, setCurrentTab, setShowCamera]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="camera-component bg-[#0D111D] p-4 rounded-lg">
      {capturedImage ? (
        <div className="flex flex-col items-center">
          <img src={capturedImage} alt="Captured" className="max-w-full h-auto mb-4" />
          <div className="flex space-x-4">
            <ButtonStyling text="Retake" onClick={retakePhoto} />
            <ButtonStyling text="Process" onClick={processImage} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="mb-4 rounded-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <ButtonStyling text="Capture" onClick={captureImage} />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EFEFED]"></div>
        </div>
      )}
    </div>
  );
}

export default CameraComponent;