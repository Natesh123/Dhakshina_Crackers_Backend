import re

target_file = '../Dhakshina_Crackers_Admin/app/admin/page.tsx'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the HTML table row
search_str = r'''              <tr>
                <td colspan="2" class="text-right bold">Total Qty</td>
                <td class="text-center bold">${totalQty}</td>
                <td colspan="3"></td>
                <td class="text-right bold">₹ ${previousTotal.toFixed(0)}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-left bold" style="vertical-align: middle;">${numberToWords(totalAmount)}</td>'''

replace_str = r'''              <tr>
                <td colspan="2" class="text-right bold">Total Qty</td>
                <td class="text-center bold">${totalQty}</td>
                <td colspan="3"></td>
                <td class="text-right bold">₹ ${previousTotal.toFixed(0)}</td>
              </tr>
              ${extraDiscountAmt > 0 ? `
              <tr>
                <td colspan="6" class="text-right bold" style="color: #ea580c;">Extra Discount</td>
                <td class="text-right bold" style="color: #ea580c;">- ₹ ${extraDiscountAmt.toFixed(0)}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="6" class="text-right bold" style="color: #ca8a04;">Packing Charges (3%)</td>
                <td class="text-right bold" style="color: #ca8a04;">+ ₹ ${packingChargeAmt.toFixed(0)}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-left bold" style="vertical-align: middle;">${numberToWords(totalAmount)}</td>'''

if search_str in content:
    content = content.replace(search_str, replace_str)
    print("Successfully replaced HTML")
else:
    print("Could not find search string. Regex fallback...")
    content = re.sub(
        r'(<td class="text-right bold">₹ \$\{previousTotal\.toFixed\(0\)\}</td>\s*</tr>)',
        r'\1\n              ${extraDiscountAmt > 0 ? `\n              <tr>\n                <td colspan="6" class="text-right bold" style="color: #ea580c;">Extra Discount</td>\n                <td class="text-right bold" style="color: #ea580c;">- ₹ ${extraDiscountAmt.toFixed(0)}</td>\n              </tr>\n              ` : \'\'}\n              <tr>\n                <td colspan="6" class="text-right bold" style="color: #ca8a04;">Packing Charges (3%)</td>\n                <td class="text-right bold" style="color: #ca8a04;">+ ₹ ${packingChargeAmt.toFixed(0)}</td>\n              </tr>',
        content
    )
    print("Applied regex substitution.")

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)
