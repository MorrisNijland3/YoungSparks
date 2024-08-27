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
    """Execute a script."""
    script_path = os.path.join(get_script_directory(), script_name)
    try:
        logger.info(f"Executing script: {script_path}")
        subprocess.run(['python', script_path], check=True)
        logger.info(f"Script {script_path} executed successfully.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error executing script {script_path}: {e}")

def run_scripts_immediately():
    """Run scripts immediately after startup."""
    run_script('data_conv.py')
    run_script('teamstaken.py')

def schedule_periodic_tasks():
    """Schedule tasks to run the scripts periodically."""
    if not scheduler.running:
        # Schedule to run scripts every 2 minutes
        scheduler.add_job(run_scripts_immediately, 'interval', minutes=2, id='run_scripts_job')
        scheduler.start()
        logger.info("Scheduler started and periodic tasks are scheduled.")

def main():
    """Main function to run tasks and start scheduler."""
    run_scripts_immediately()  # Run scripts immediately after startup
    schedule_periodic_tasks()  # Schedule periodic running of scripts

if __name__ == "__main__":
    main()
