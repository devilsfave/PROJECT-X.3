import * as tf from '@tensorflow/tfjs';
import * as tflite from '@tensorflow/tfjs-tflite';

let model = null;

export const loadModel = async () => {
  try {
    if (model) {
      console.log('Model already loaded, skipping initialization.');
      return;
    }

    console.log('Starting model loading process...');
    await tf.ready();
    console.log('TensorFlow.js is ready.');

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
    // Convert the image data to a tensor
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
  try {
    if (!model) {
      throw new Error('Model not loaded yet. Please wait.');
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