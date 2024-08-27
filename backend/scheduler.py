from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
import os
import sys
import logging
import time
import datetime

# Set up logging
logging.basicConfig(level=logging.DEBUG)
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
        result = subprocess.run(['python3', script_path], check=True, text=True, capture_output=True)
        logger.info(f"Script {script_path} executed successfully.")
        logger.debug(f"Script output: {result.stdout}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error executing script {script_path}: {e}")
        logger.debug(f"Error output: {e.output}")

def run_scripts_immediately():
    """Run scripts immediately after startup."""
    logger.info("Running scripts immediately.")
    # First run file_download.py, then data_conv.py and teamstaken.py
    run_script('taken_download.py')  # Ensure file_download.py runs before the others
    time.sleep(60)  # Wait 1 minute before running the next scripts
    run_script('data_conv.py')
    run_script('teamstaken.py')

def schedule_periodic_tasks():
    """Schedule tasks to run every 2 minutes."""
    if not scheduler.running:
        # Schedule file_download.py to run every 2 minutes
        scheduler.add_job(run_script, 'interval', hours=2, args=['taken_download.py'], id='taken_download_job')

        # Schedule data_conv.py and teamstaken.py to run every 2 minutes, but with a 1 minute delay
        scheduler.add_job(run_script, 'interval', hours=2, start_date=datetime.datetime.now() + datetime.timedelta(minutes=1), args=['data_conv.py'], id='data_conv_job')
        scheduler.add_job(run_script, 'interval', hours=2, start_date=datetime.datetime.now() + datetime.timedelta(minutes=1), args=['teamstaken.py'], id='teamstaken_job')
        
        scheduler.start()
        logger.info("Scheduler started and periodic tasks are scheduled.")

def main():
    """Main function to run tasks and start scheduler."""
    try:
        run_scripts_immediately()  # Run scripts immediately after startup
        schedule_periodic_tasks()  # Schedule tasks every 2 minutes
        logger.info("Scheduler setup complete and scripts running.")
        # Keep the script running to let the scheduler work
        while True:
            time.sleep(60)
    except Exception as e:
        logger.error(f"Unhandled exception: {e}")
        scheduler.shutdown()

if __name__ == "__main__":
    main()
