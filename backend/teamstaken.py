import xlsxwriter as xw
import json, os, sys
from datetime import datetime

def get_script_directory():
    if getattr(sys, 'frozen', False):  
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))

script_dir = get_script_directory()

new_folder_name = 'frontend'
new_folder_path = os.path.join(os.path.dirname(script_dir), new_folder_name)


workbook_path = os.path.join(new_folder_path, 'taken.xlsx')
workbook = xw.Workbook(workbook_path)

filename = 'taken.json'
json_path = os.path.join(script_dir, filename)

if os.path.exists(json_path):
    with open(json_path) as file:
        reader = json.load(file)

personen = {'b4d1b492-7032-463d-83af-aff06efa96ce' : 'Alec van der Schuit',
            '38c20268-9c11-4f0d-be56-1299263ff655' : 'Amber Schouten',
            '229783bd-5be2-4298-a0f1-1ce089b6e621' : 'Daan Bakker',
            '413d0ff7-8dcb-420a-ba12-951f36f7d67e' : 'Ewout Vet',
            'a19eceb3-d5b2-4d36-81b5-bda86c9309b6' : 'Jake Wittebrood',
            '993ef9e4-30df-43f2-9dbf-f68f26e3b1fb' : 'Jim Struikenkamp',
            'a1bd4754-af60-4208-b5d3-860ab6aaa204' : 'Jolie Sekeris',
            '8f1c96b3-8224-48f7-b4c7-a7e74338dfc8' : 'Julia van Kalken',
            '4282d6cb-daad-438d-b530-4e7bf1b23519' : 'Julia Klaver',
            '5b092ce6-0f82-4b33-aad7-6e3cb6486950' : 'Leonie van der Park',
            '91ea8c27-b8de-4502-a72a-a195288de3a5' : 'Mart Cabooter',
            '59549484-de76-4dac-90f5-1f09f644bed6' : 'Miel Tiebie',
            '5efa6a82-5942-4dd9-a54e-fa71365e8292' : 'Morris Nijland',
            '4b9ccf8a-a255-4791-9b2a-4442fd1d7e3f' : 'Sharon Swart',
            '99dba567-3892-4236-a695-2e8c0180c197' : 'Steijn van Buuren',
            '5c84a86f-c592-40f1-af8c-d8e7d108e37e' : 'Thijmen Buurs',
            'a1266dc0-cdf5-472c-9f17-2f851ebc2f76' : 'Tijn de Ruijter'
}       # personen met hun teams id

for werknemer in personen:
    index = 1
    worksheet = workbook.add_worksheet(personen[werknemer])
    worksheet.write(0, 0 , 'Naam van taak.')
    worksheet.write(0, 1 , 'Klant.')
    worksheet.write(0, 2 , 'Datum van deadline.')

    today = datetime.now()
    for read in reader:
        titel = read["Title"]
        plan = read['Plan']
        assigned_to = read["AssignedToUserId"]
        due = read["Due"][:10]
        voortgang = read["Voortgang"]
        persoon_ = []

        reader1 = json.loads(assigned_to)

        for werkn in reader1:
            persoon_.append(werkn)

        if werknemer in persoon_:
            if voortgang != '100':
                worksheet.write(index, 0, titel)
                worksheet.write(index, 1, plan)
                if due:
                    year = int(due[0:4])
                    month = int(due[5:7])
                    day = int(due[8:10])
                    due_till = f'{day}/{month}/{year} 23:59'
                    due_till = datetime.strptime(due_till, '%d/%m/%Y %H:%M')
                    if due_till < today:
                        worksheet.write(index, 2, f'Te laat.({due})')
                    else:
                        worksheet.write(index, 2, due)
                        
                else:
                    worksheet.write(index, 2, 'Geen datum.')

                personen_i = 2
                for i in persoon_:
                    if i in personen:
                        worksheet.write(index, personen_i + 1, personen[i])
                        personen_i += 1
                index += 1
    worksheet.autofilter('A1:C1') # type: ignore
    worksheet.set_column(0, 2, 32)

workbook.close()
