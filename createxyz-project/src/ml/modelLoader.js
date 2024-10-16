
export const loadModel = async () => {
  console.log('Model loading is handled by the API server');
};



// Update the predictImage function to use the API
export const predictImage = async (imageData) => {
  try {
    // Convert imageData to a Blob
    const blob = await new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(resolve, 'image/jpeg');
    });

    // Create a FormData object and append the image
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');

    const response = await fetch('https://skin-disease-predictor-564837954639.us-central1.run.app/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.prediction;
  } catch (error) {
    console.error('Error predicting image:', error);
    throw error;
  }
};