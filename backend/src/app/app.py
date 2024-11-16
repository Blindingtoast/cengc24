from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from interpreter import file_uploaded

app = Flask(__name__)
CORS(app)  # Enable CORS to allow React to communicate with Flask

# Define upload folder
UPLOAD_FOLDER = './uploaded_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_image():
    if not request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    return file_uploaded(request)

def app_main():
    app.run(debug=True)

app_main()