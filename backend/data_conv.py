import json
import os
import sys
from datetime import datetime

file_name = 'taken.json'
new_file_name = 'dashboard.json'

def get_script_directory():
    if getattr(sys, 'frozen', False):  
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))

script_dir = get_script_directory()
parent_dir = os.path.dirname(script_dir)
new_json_path = os.path.join(parent_dir, 'frontend', new_file_name)
json_path = os.path.join(script_dir, file_name)

werknemers = 'werknemers.txt'
personen = {}
werknemers_file = os.path.join(parent_dir, 'frontend', werknemers)

with open(werknemers_file) as file:
    lines = file.readlines()
    for line in lines:
        teamid, naam = line.split(' = ')
        personen[teamid] = naam.strip()

with open(json_path) as f:
    reader = json.load(f)
    
with open(new_json_path, 'w') as f:
    plannen = {}

    for task in reader:
        today = datetime.now()
        voortgang = task['Voortgang']
        plan = task['Plan']
        title = task['Title']
        assigned_to_json = task['AssignedToUserId']
        due = task.get('Due', '')
        try:
            if due:
                year = int(due[0:4])
                month = int(due[5:7])
                day = int(due[8:10])
                due_till = f'{day}/{month}/{year} 23:59'
                due_till = datetime.strptime(due_till, '%d/%m/%Y %H:%M')

                if due_till < today:
                    due_date = f'Te laat.({due_till.strftime("%d-%m-%Y")})'
                else:
                    due_date = due
            else:
                due_date = 'Geen datum.'
        except (ValueError, IndexError) as e:
            print(f"Error processing due date for task '{title}': {e}")
            due_date = 'Onbekende datum.'

        assigned_to_dict = json.loads(assigned_to_json)
        assigned_to_names = [personen.get(user_id, user_id) for user_id in assigned_to_dict.keys()]

        if voortgang != '100':
            if plan not in plannen:
                plannen[plan] = [[title, assigned_to_names, due_date, voortgang]]
            else:
                plannen[plan].append([title, assigned_to_names, due_date, voortgang])

    json.dump(plannen, f, indent=4)

