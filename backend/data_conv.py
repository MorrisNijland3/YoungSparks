from fileinput import filename
from hmac import new
import json, os, sys

personen = {
    'b4d1b492-7032-463d-83af-aff06efa96ce': 'Alec van der Schuit',
    '38c20268-9c11-4f0d-be56-1299263ff655': 'Amber Schouten',
    'dcb88e06-c81c-4dda-9964-b10c63cebd77': 'Daan Bakker',
    '413d0ff7-8dcb-420a-ba12-951f36f7d67e': 'Ewout Vet',
    '993ef9e4-30df-43f2-9dbf-f68f26e3b1fb': 'Jim Struikenkamp',
    '8f1c96b3-8224-48f7-b4c7-a7e74338dfc8': 'Julia van Kalken',
    '4282d6cb-daad-438d-b530-4e7bf1b23519': 'Julia Klaver',
    '5b092ce6-0f82-4b33-aad7-6e3cb6486950': 'Leonie van der Park',
    '59549484-de76-4dac-90f5-1f09f644bed6': 'Miel Tiebie',
    '5efa6a82-5942-4dd9-a54e-fa71365e8292': 'Morris Nijland',
    '99dba567-3892-4236-a695-2e8c0180c197': 'Steijn van Buuren',
    '5c84a86f-c592-40f1-af8c-d8e7d108e37e': 'Thijmen Buurs',
    'a1266dc0-cdf5-472c-9f17-2f851ebc2f76': 'Tijn de Ruijter',
    '4b9ccf8a-a255-4791-9b2a-4442fd1d7e3f': 'Sharon Swart'
}
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

f = open(new_json_path, 'w')
plannen = {}

for task in reader:
    voortgang = task['Voortgang']
    plan = task['Plan']
    title = task['Title']
    assigned_to_json = task['AssignedToUserId']
    due_date = task['Due']

    assigned_to_dict = json.loads(assigned_to_json)

    assigned_to_names = [personen.get(user_id, user_id) for user_id in assigned_to_dict.keys()]
    if voortgang != '100':
        if plan not in plannen:
            plannen[plan] = [[title, assigned_to_names, due_date]]
        else:
            plannen[plan].append([title, assigned_to_names, due_date])

f.write(json.dumps(plannen, indent=4))
f.close()
