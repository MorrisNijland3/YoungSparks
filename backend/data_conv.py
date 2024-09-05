import json
import os
import sys
from datetime import datetime

personen = {'b4d1b492-7032-463d-83af-aff06efa96ce' : 'Alec van der Schuit',
            '38c20268-9c11-4f0d-be56-1299263ff655' : 'Amber Schouten',
            '229783bd-5be2-4298-a0f1-1ce089b6e621' : 'Daan Bakker',
            '413d0ff7-8dcb-420a-ba12-951f36f7d67e' : 'Ewout Vet',
            '993ef9e4-30df-43f2-9dbf-f68f26e3b1fb' : 'Jim Struikenkamp',
            '8f1c96b3-8224-48f7-b4c7-a7e74338dfc8' : 'Julia van Kalken',
            '4282d6cb-daad-438d-b530-4e7bf1b23519' : 'Julia Klaver',
            '5b092ce6-0f82-4b33-aad7-6e3cb6486950' : 'Leonie van der Park',
            '91ea8c27-b8de-4502-a72a-a195288de3a5' : 'Mart Cabooter',
            '59549484-de76-4dac-90f5-1f09f644bed6' : 'Miel Tiebie',
            '5efa6a82-5942-4dd9-a54e-fa71365e8292' : 'Morris Nijland',
            '99dba567-3892-4236-a695-2e8c0180c197' : 'Steijn van Buuren',
            '5c84a86f-c592-40f1-af8c-d8e7d108e37e' : 'Thijmen Buurs',
            'a1266dc0-cdf5-472c-9f17-2f851ebc2f76' : 'Tijn de Ruijter'
}       # personen met hun teams id

file_name = 'taken.json'
new_file_name = 'dashboard.json'

def get_script_directory():
    if getattr(sys, 'frozen', False):  
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))

script_dir = get_script_directory()
parent_dir = os.path.dirname(script_dir)

json_path = os.path.join(script_dir, file_name)
new_json_path = os.path.join(parent_dir, 'frontend', new_file_name)

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

