let tflite;
let tf;
let model;

// Load TensorFlow.js and TFLite dynamically
const loadTensorFlowModules = async () => {
  if (typeof window === 'undefined') return; // Skip on server-side

  // Import TensorFlow.js and TFLite modules
  if (!tf) {
    tf = await import('@tensorflow/tfjs');
    await tf.ready(); // Wait for TensorFlow.js to be ready
    console.log('TensorFlow.js is ready.');
  }

  if (!tflite) {
    tflite = await import('@tensorflow/tfjs-tflite');
  }
};

export const loadModel = async () => {
  await loadTensorFlowModules(); // Ensure TensorFlow modules are loaded

  if (typeof window === 'undefined') {
    console.log('Cannot load model in server-side environment');
    return; // Skip on server-side
  }

  try {
    if (model) {
      console.log('Model already loaded, skipping initialization.');
      return;
    }

    console.log('Starting model loading process...');

    const modelPath = '/ml/model_unquant.tflite'; // Adjust the path as needed
    model = await tflite.loadTFLiteModel(modelPath);
    console.log('TFLite model loaded successfully!');

    // Perform a warm-up inference
    const dummyInput = tf.zeros([1, 224, 224, 3]);
    const warmupResult = await model.predict(dummyInput);
    warmupResult.dispose();
    dummyInput.dispose();
    console.log('Warm-up inference completed.');
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load the machine learning model. Please try again later.');
  }
};

const preprocessImage = async (imageData) => {
  try {
    const imageTensor = tf.browser.fromPixels(imageData)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));
    return imageTensor;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Failed to process the image. Please try again.');
  }
};

export const predictImage = async (imageData) => {
  await loadTensorFlowModules(); // Ensure modules are loaded

  if (typeof window === 'undefined') {
    console.log('Cannot predict on server-side');
    return null; // Skip on server-side
  }

  try {
    if (!model) {
      await loadModel(); // Load the model if it's not already loaded
    }
    const imageTensor = await preprocessImage(imageData);
    const outputTensor = await model.predict(imageTensor);
    const predictions = await outputTensor.data();
    const predictedClassIndex = predictions.indexOf(Math.max(...Array.from(predictions)));

    const classNames = ['nv', 'mel', 'bkl', 'bcc', 'akiec', 'vasc', 'df'];

    const classProbabilities = {};
    for (let i = 0; i < classNames.length; i++) {
      classProbabilities[classNames[i]] = (predictions[i] * 100).toFixed(2) + '%';
    }

    imageTensor.dispose();
    outputTensor.dispose();
    return {
      predictedClass: classNames[predictedClassIndex],
      probabilities: classProbabilities
    };
  } catch (error) {
    console.error('Error predicting image:', error);
    throw error;
  }
};