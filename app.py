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
    app.run(debug=True, host='0.0.0.0', port=8000)  # Adjust as needed

def main():
    # Run the scripts immediately after startup
    run_scripts_immediately()
    # Start the scheduler in a separate thread
    scheduler_thread = threading.Thread(target=schedule_periodic_tasks)
    scheduler_thread.start()

    try:
        # Run the Flask app
        run_flask_app()
    except (KeyboardInterrupt, SystemExit):
        scheduler_thread.join()  # Ensure scheduler thread is cleaned up
        # You might need to add shutdown logic for your scheduler here if necessary

if __name__ == '__main__':
    main()
