import React, { useState, useEffect } from "react";
import ButtonStyling from "../ButtonStyling";

const classNames = ['nv', 'mel', 'bkl', 'bcc', 'akiec', 'vasc', 'df']; // Example class names

// Function to generate random predictions
const generateRandomPrediction = () => {
  const randomIndex = Math.floor(Math.random() * classNames.length);
  const predictions = Array(classNames.length).fill(0).map(() => Math.random());
  const total = predictions.reduce((acc, curr) => acc + curr, 0);
  return predictions.map(prob => (prob / total).toFixed(2)); // Normalize probabilities
};

const simulatePrediction = () => {
  const randomProbabilities = generateRandomPrediction();
  const predictedClassIndex = randomProbabilities.indexOf(Math.max(...randomProbabilities));
  
  const classProbabilities = {};
  classNames.forEach((name, index) => {
    classProbabilities[name] = (randomProbabilities[index] * 100).toFixed(2) + '%';
  });

  return {
    predictedClass: classNames[predictedClassIndex],
    probabilities: classProbabilities
  };
};

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
      
      const prediction = simulatePrediction();
      setAnalysisResult(prediction); 
      setCurrentTab('results');
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('An error occurred during image analysis. Please try again.');
    } finally {
      setIsLoading(false);
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
              <ButtonStyling text="Retake" onClick={() => setImage(null)} />
              <ButtonStyling text="Analyze" onClick={handleAnalyze} disabled={isLoading} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => setImage(e.target.result);
                  reader.readAsDataURL(file);
                }
              }}
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
