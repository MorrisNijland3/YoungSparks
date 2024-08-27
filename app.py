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
    """Run the Flask app."""
    app.run(debug=True)  # Adjust debug=True as needed, set to False in production

def main():
    """Main function to start Flask app and scheduler."""
    # Run the scripts immediately after startup
    run_scripts_immediately()

    # Start the scheduler in a separate thread
    scheduler_thread = threading.Thread(target=schedule_periodic_tasks)
    scheduler_thread.start()

    try:
        # Run the Flask app
        run_flask_app()
    except (KeyboardInterrupt, SystemExit):
        # Handle graceful shutdown
        scheduler_thread.join()  # Ensure the scheduler thread is properly shut down

if __name__ == '__main__':
    main()
