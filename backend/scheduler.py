from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
import os
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def get_script_directory():
    """Determine the directory of the script."""
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))

def run_script(script_name):
    script_path = os.path.join(get_script_directory(), script_name)
    try:
        logger.info(f"Executing script: {script_path}")
        subprocess.run(['python', script_path], check=True)
        logger.info(f"Script {script_path} executed successfully.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error executing script {script_path}: {e}")

def restart_service():
    """Restart the myapp.service."""
    try:
        logger.info("Restarting myapp.service")
        subprocess.run(['sudo', 'systemctl', 'restart', 'myapp.service'], check=True)
        logger.info("myapp.service restarted successfully.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error restarting myapp.service: {e}")

def run_scripts_immediately():
    """Run scripts immediately after startup."""
    run_script('data_conv.py')
    run_script('teamstaken.py')

def schedule_periodic_tasks():
    """Schedule tasks to restart the service periodically."""
    if not scheduler.running:
        scheduler.add_job(restart_service, 'interval', minutes=2)
        scheduler.start()
        logger.info("Scheduler started and periodic restart jobs are scheduled.")

def main():
    """Main function to run tasks and start scheduler."""
    run_scripts_immediately()  # Run scripts immediately after startup
    schedule_periodic_tasks()  # Schedule service restart every 2 minutes

if __name__ == "__main__":
    main()
