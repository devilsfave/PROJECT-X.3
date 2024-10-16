import React, { useState } from "react";
import ButtonStyling from "../ButtonStyling";
import { predictImage } from '../../ml/modelLoader';

function AnalysisComponent({ setAnalysisResult, setCurrentTab, setShowCamera }) {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert base64 image to ImageData
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Use the predictImage function from modelLoader
      const prediction = await predictImage(imageData);
      setAnalysisResult(prediction);
      setCurrentTab('results');
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('An error occurred during image analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        setError('Failed to read the selected file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="analysis" className="my-8">
      <h2 className="text-xl mb-4 text-[#EFEFED]">Skin Lesion Analysis</h2>
      <div className="bg-[#171B26] p-4 rounded-lg">
        {image ? (
          <div className="flex flex-col items-center">
            <img src={image} alt="Uploaded" className="max-w-full h-auto mb-4" />
            <div className="flex space-x-4">
              <ButtonStyling text="Choose Different Image" onClick={() => setImage(null)} />
              <ButtonStyling text="Analyze" onClick={handleAnalyze} disabled={isLoading} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label htmlFor="imageUpload">
              <ButtonStyling text="Upload Image" component="span" />
            </label>
            <ButtonStyling text="Take Picture" onClick={() => setShowCamera(true)} className="mt-4" />
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EFEFED]"></div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AnalysisComponent;