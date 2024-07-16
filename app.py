from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='frontend')
CORS(app, resources={r"/api/*": {"origins": "http://0.0.0.0:5000"}})

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')
    
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path) 

if __name__ == '__main__':
    app.run(debug=True)

