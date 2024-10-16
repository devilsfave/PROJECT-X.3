import React, { useEffect, useState } from 'react';
import ButtonStyling from "../ButtonStyling";
import { saveAnalysisToFirestore } from '../../Firebase/config';

const conditions = ['nv', 'mel', 'bkl', 'bcc', 'akiec', 'vasc', 'df'];

const conditionExplanations = {
  'nv': {
    explanation: 'A common benign mole or nevus that usually requires no treatment.',
    link: 'https://www.aad.org/public/diseases/skin-conditions/moles',
    recommendations: [
      'Monitor any changes in size, shape, or color.',
      'Consult a dermatologist if changes occur.'
    ],
  },
  'mel': {
    explanation: 'Melanoma is a serious form of skin cancer that develops from melanocytes.',
    link: 'https://www.cancer.org/cancer/melanoma-skin-cancer.html',
    recommendations: [
      'Perform regular skin checks.',
      'Wear sunscreen and protective clothing.',
      'Consult a dermatologist regularly.'
    ],
  },
  'bkl': {
    explanation: 'Benign keratosis is a non-cancerous growth that can appear on the skin.',
    link: 'https://www.aad.org/public/diseases/skin-conditions/benign-keratosis',
    recommendations: [
      'Keep the area clean and dry.',
      'Consult a dermatologist if it becomes painful or changes.'
    ],
  },
  'bcc': {
    explanation: 'Basal cell carcinoma is the most common type of skin cancer.',
    link: 'https://www.aad.org/public/diseases/skin-cancer/types/basal-cell-carcinoma',
    recommendations: [
      'Avoid sun exposure and use sunscreen.',
      'See a dermatologist for any suspicious growths.'
    ],
  },
  'akiec': {
    explanation: 'Actinic keratosis is a pre-cancerous skin condition caused by sun exposure.',
    link: 'https://www.aad.org/public/diseases/skin-cancer/types/actinic-keratosis',
    recommendations: [
      'Use sunscreen and protective clothing.',
      'See a dermatologist for treatment options.'
    ],
  },
  'vasc': {
    explanation: 'Vascular lesions can appear in a variety of forms and are usually benign.',
    link: 'https://www.ncbi.nlm.nih.gov/books/NBK547990/',
    recommendations: [
      'Monitor any changes in the lesions.',
      'Consult a dermatologist if concerned.'
    ],
  },
  'df': {
    explanation: 'Dermatofibroma is a common benign skin growth that often appears on the legs.',
    link: 'https://www.aad.org/public/diseases/skin-conditions/dermatofibroma',
    recommendations: [
      'Monitor for any changes.',
      'Consult a dermatologist for removal options if desired.'
    ],
  },
};

function ResultsComponent({ analysisResult, imageUri, setCurrentTab }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (analysisResult) {
      const result = analysisResult.reduce((acc, prob, index) => {
        acc[conditions[index]] = parseFloat((prob * 100).toFixed(2));
        return acc;
      }, {});
      setPrediction(result);
    }
  }, [analysisResult]);

  const getSeverityLevel = (className) => {
    switch (className) {
      case 'mel':
        return 'High';
      case 'bcc':
      case 'akiec':
        return 'Medium';
      default:
        return 'Low';
    }
  };

  const saveToHistory = async () => {
    try {
      if (prediction) {
        await saveAnalysisToFirestore(prediction, imageUri);
        alert('Analysis saved to history.');
      } else {
        alert('No prediction data available to save.');
      }
    } catch (err) {
      console.error('Error saving analysis:', err);
      alert('Failed to save analysis.');
    }
  };

  if (!prediction) {
    return <div className="text-[#EFEFED]">Loading results...</div>;
  }

  const predictedClass = Object.entries(prediction).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const conditionInfo = conditionExplanations[predictedClass];

  return (
    <div className="bg-[#0D111D] p-4 rounded-lg text-[#EFEFED]">
      <img src={imageUri} alt="Analyzed skin lesion" className="mb-4 max-w-full h-auto" />
      <h2 className="text-2xl mb-4">Analysis Results</h2>
      
      <div className="mb-6">
        <h3 className="text-xl mb-2">Most Likely Condition: {predictedClass}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${prediction[predictedClass]}%`}}></div>
        </div>
        <p>Confidence: {prediction[predictedClass].toFixed(2)}%</p>
        <p>Severity: {getSeverityLevel(predictedClass)}</p>
        {conditionInfo && (
          <div className="mt-4">
            <p>{conditionInfo.explanation}</p>
            <a href={conditionInfo.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Learn more about {predictedClass}</a>
            <h4 className="mt-2 font-bold">Recommendations:</h4>
            <ul className="list-disc list-inside">
              {conditionInfo.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h3 className="text-lg mb-2">Other Possibilities:</h3>
      {Object.entries(prediction)
        .filter(([className]) => className !== predictedClass)
        .map(([className, probability]) => (
          <div key={className} className="mb-2">
            <p>{className}: {probability.toFixed(2)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${probability}%`}}></div>
            </div>
          </div>
        ))}

      <div className="mt-6 space-y-4">
        <ButtonStyling text="Save to History" onClick={saveToHistory} />
        <ButtonStyling text="Learn More" onClick={() => {/* Navigate to Education page */}} />
        <ButtonStyling text="Back to Analysis" onClick={() => setCurrentTab('analysis')} />
      </div>
    </div>
  );
}

export default ResultsComponent;