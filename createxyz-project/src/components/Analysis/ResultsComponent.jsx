import React from 'react';
import ButtonStyling from '../ButtonStyling';

function ResultsComponent({ analysisResult, setCurrentTab }) {
  if (!analysisResult) return null;

  const { output, imageUri } = analysisResult;
  const parsedOutput = JSON.parse(output);

  const conditions = [
    "Melanoma",
    "Melanocytic nevus",
    "Basal cell carcinoma",
    "Actinic keratosis",
    "Benign keratosis",
    "Dermatofibroma",
    "Vascular lesion"
  ];

  return (
    <section id="results" className="my-8">
      <h2 className="text-xl mb-4 text-[#EFEFED]">Analysis Results</h2>
      <div className="bg-[#171B26] p-4 rounded-lg">
        <img src={imageUri} alt="Analyzed skin lesion" className="mb-4 max-w-full h-auto" />
        <h3 className="text-lg mb-2 text-[#EFEFED]">Probability Breakdown:</h3>
        <ul className="mb-4">
          {parsedOutput.map((prob, index) => (
            <li key={index} className="text-[#EFEFED]">
              {conditions[index]}: {(prob * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
        <ButtonStyling text="Back to Analysis" onClick={() => setCurrentTab('analysis')} />
      </div>
    </section>
  );
}

export default ResultsComponent;