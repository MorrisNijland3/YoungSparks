import threading
from flask import Flask, send_from_directory
from flask_cors import CORS
from backend.scheduler import schedule_periodic_tasks, run_scripts_immediately

app = Flask(__name__, static_folder='frontend')
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

def run_flask_app():
    app.run(debug=True, host='0.0.0.0', port=8000) 

def main():
    run_scripts_immediately()
    scheduler_thread = threading.Thread(target=schedule_periodic_tasks)
    scheduler_thread.start()

    try:
        run_flask_app()
    except (KeyboardInterrupt, SystemExit):
        scheduler_thread.join()  
if __name__ == '__main__':
    main()
