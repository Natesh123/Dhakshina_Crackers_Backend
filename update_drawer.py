import re

target_file = '../Dhakshina_Crackers_Admin/app/components/CartDrawer.tsx'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Add cartPackingCharges to destructuring
content = re.sub(
    r'(cartSubtotal,)',
    r'\1\n    cartPackingCharges,',
    content
)

# Add Packing Charges to UI
search_ui = r'(<span>₹\{cartSubtotal\.toLocaleString\(\'en-IN\'\)\}</span>\n\s*</div>)'
replace_ui = r'\1\n              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-amber-600 pt-1">\n                <span>Packing Charges (3%)</span>\n                <span>+₹{cartPackingCharges.toLocaleString(\'en-IN\')}</span>\n              </div>'
content = re.sub(search_ui, replace_ui, content)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("CartDrawer updated.")
