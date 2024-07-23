from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
import os
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def get_script_directory():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))

def run_existing_script():
    script_path = os.path.join(get_script_directory(), 'data_conv.py')
    try:
        logger.info(f"Executing script: {script_path}")
        subprocess.run(['python', script_path], check=True)
        logger.info(f"Script {script_path} executed successfully.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error executing script {script_path}: {e}")

def run_existing_script1():
    script_path = os.path.join(get_script_directory(), 'teamstaken.py')
    try:
        logger.info(f"Executing script: {script_path}")
        subprocess.run(['python', script_path], check=True)
        logger.info(f"Script {script_path} executed successfully.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error executing script {script_path}: {e}")

def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(run_existing_script, 'interval', hours=2)  
        scheduler.add_job(run_existing_script1, 'interval', hours=2)
        scheduler.start()

def shutdown_scheduler():
    if scheduler.running:
        scheduler.shutdown()
