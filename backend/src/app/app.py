from flask import Flask, request, jsonify
from flask_cors import CORS
import os

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
    
    files = request.files
    saved_files = []

    for position, file in files.items():
        if file:
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            saved_files.append(filename)

    return jsonify({'message': 'Files successfully uploaded', 'files': saved_files}), 200

def app_main():
    app.run(debug=True)