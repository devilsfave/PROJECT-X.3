import React, { useState, useRef, useCallback, useEffect } from 'react';
import ButtonStyling from "../ButtonStyling";
import { predictImage } from '../../ml/modelLoader';

function CameraComponent({ setShowCamera, setAnalysisResult, setCurrentTab }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Failed to access camera. Please ensure you have given permission and try again.');
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
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  }, [startCamera]);

  const processImage = useCallback(async () => {
    if (!capturedImage) return;
  
    setIsLoading(true);
    setError(null);
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      const result = await predictImage(imageData);
      setAnalysisResult(result);
      setCurrentTab('results');
      setShowCamera(false);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [capturedImage, setAnalysisResult, setCurrentTab, setShowCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="camera-component bg-[#0D111D] p-4 rounded-lg relative">
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EFEFED]"></div>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default CameraComponent;