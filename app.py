from flask import Flask, send_from_directory
from flask_cors import CORS
from backend.scheduler import start_scheduler, shutdown_scheduler
from backend.routes import routes_bp

app = Flask(__name__, static_folder='frontend')
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(routes_bp)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

def initialize():
    start_scheduler()

if __name__ == '__main__':
    initialize()
    try:
        app.run(debug=True)
    except (KeyboardInterrupt, SystemExit):
        shutdown_scheduler()  
