export const predictImage = async (imageData) => {
  try {
    // Convert imageData to a Blob
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

    // Create FormData and append the image
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    
    // Add description field
    formData.append('description', 'image');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result.prediction;
  } catch (error) {
    console.error('Error predicting image:', error);
    throw error;
  }
};