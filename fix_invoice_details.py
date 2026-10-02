import re

target_file = '../Dhakshina_Crackers_Admin/app/admin/page.tsx'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Addresses
content = re.sub(
    r'D\.NO\. 177/5/18, Pernaickenpatti,<br/>Sithurajapuram, Virudhunagar, Tamil Nadu 626 189, India',
    r'Online Crackers Dealer<br/>Sivakasi, Tamil Nadu, India',
    content
)
content = re.sub(
    r'D\.NO\. 177/5/18, Pernaickenpatti, Sithurajapuram,<br/>Virudhunagar, Tamil Nadu 626 189, India',
    r'Online Crackers Dealer<br/>Sivakasi, Tamil Nadu, India',
    content
)

# Replace Proprietor Name
content = re.sub(r'SWETHA', r'S.NATESH KUMAR', content)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated invoice details.")
