import threading
from flask import Flask, send_from_directory
from flask_cors import CORS
from backend.scheduler import start_scheduler, shutdown_scheduler, run_scripts_immediately
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

def run_flask_app():
    app.run(debug=True)

if __name__ == '__main__':
    run_scripts_immediately()

    scheduler_thread = threading.Thread(target=start_scheduler)
    scheduler_thread.start()

    try:
        run_flask_app()
    except (KeyboardInterrupt, SystemExit):
        shutdown_scheduler()  
        scheduler_thread.join()  
