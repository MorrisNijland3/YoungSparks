import json


filename = 'taken.json'

personen = {'b4d1b492-7032-463d-83af-aff06efa96ce' : 'Alec van der Schuit',
            '38c20268-9c11-4f0d-be56-1299263ff655' : 'Amber Schouten',
            '229783bd-5be2-4298-a0f1-1ce089b6e621' : 'Daan Bakker',
            '8d303b8f-4dad-442c-89b4-aa7c76936416' : 'Dionne Duijzer',
            '413d0ff7-8dcb-420a-ba12-951f36f7d67e' : 'Ewout Vet',
            '9d190cd0-e1e2-4cc1-97ec-1e0c27e7bfbc' : 'Jelmer de Vries',
            '993ef9e4-30df-43f2-9dbf-f68f26e3b1fb' : 'Jim Struikenkamp',
            '8f1c96b3-8224-48f7-b4c7-a7e74338dfc8' : 'Julia van Kalken',
            '4282d6cb-daad-438d-b530-4e7bf1b23519' : 'Julia Klaver',
            '72222403-1d90-49d5-9da3-780a0b39fb8b' : 'Kay van Wijk',
            '5b092ce6-0f82-4b33-aad7-6e3cb6486950' : 'Leonie van der Park',
            '59549484-de76-4dac-90f5-1f09f644bed6' : 'Miel Tiebie',
            '5efa6a82-5942-4dd9-a54e-fa71365e8292' : 'Morris Nijland',
            'f57b2dd5-443a-4306-a2e3-f14b44f0501a' : 'Sabrina Schot',
            '99dba567-3892-4236-a695-2e8c0180c197' : 'Steijn van Buuren',
            '5c84a86f-c592-40f1-af8c-d8e7d108e37e' : 'Thijmen Buurs',
            'a1266dc0-cdf5-472c-9f17-2f851ebc2f76' : 'Tijn de Ruijter'
            }    

with open(filename) as json_file:
    reader = json.load(json_file)




