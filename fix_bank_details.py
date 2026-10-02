import re

target_file = '../Dhakshina_Crackers_Admin/app/admin/page.tsx'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Bank details
content = re.sub(r'403100050600180', r'194100080202463', content)
content = re.sub(r'TMBL SITHURAJAPURAM', r'TMB', content)
content = re.sub(r'TMBL0000403', r'TMBL0000194', content)
content = re.sub(r'S\.NATESH KUMAR S \.', r'S.NATESH KUMAR', content)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated bank details.")
