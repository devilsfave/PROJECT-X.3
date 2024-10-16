from flask import Flask, request, jsonify
import tflite_runtime.interpreter as tflite
import numpy as np
from PIL import Image
import io
import requests

app = Flask(__name__)

# URL to your hosted TFLite model
# Replace this with your actual GitHub Pages URL when it's ready
MODEL_URL = "https://devilsfave.github.io/model-host/model_unquant.tflite"

def download_model():
    response = requests.get(MODEL_URL)
    return io.BytesIO(response.content)

# Load the TFLite model
interpreter = tflite.Interpreter(model_content=download_model().read())
interpreter.allocate_tensors()

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image'].read()
    img = Image.open(io.BytesIO(image)).resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0).astype(np.float32)
    img_array = tf.keras.applications.mobilenet.preprocess_input(img_array)

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])

    predicted_class = np.argmax(output_data, axis=1)[0]
    classes = ['nv', 'mel', 'bkl', 'bcc', 'akiec', 'vasc', 'df']
    
    return jsonify({'prediction': classes[predicted_class]})

if __name__ == '__main__':
    app.run(debug=True)