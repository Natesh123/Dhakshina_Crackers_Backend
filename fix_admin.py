import re

target_file = '../Dhakshina_Crackers_Admin/app/admin/page.tsx'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix total calculation in getInvoiceHTML
calc_search = r'''    const previousTotal = totalAmountBase;
    const totalAmount = previousTotal - extraDiscountAmt;'''
calc_replace = '''    const previousTotal = totalAmountBase;
    const packingChargeAmt = (totalAmountBase * 3) / 100;
    const totalAmount = previousTotal - extraDiscountAmt + packingChargeAmt;'''
content = content.replace(calc_search, calc_replace)

# Fix HTML table
html_search = r'''              <tr>
                <td colspan="2" class="text-right bold">Total Qty</td>
                <td class="text-center bold">\$\{totalQty\}</td>
                <td colspan="3"></td>
                <td class="text-right bold">₹ \$\{previousTotal\.toFixed\(0\)\}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-left bold" style="vertical-align: middle;">\$\{numberToWords\(totalAmount\)\}</td>'''

html_replace = r'''              <tr>
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

content = content.replace(html_search, html_replace)

# Fix Quick Billing UI calculation
quick_search = r'''                            const finalTotal = Math.max(0, total - extraAmt);
                            const finalSavings = \(subtotal - total\) \+ extraAmt;'''
quick_replace = r'''                            const packingAmt = (total * 3) / 100;
                            const finalTotal = Math.max(0, total - extraAmt + packingAmt);
                            const finalSavings = (subtotal - total) + extraAmt;'''
content = content.replace(quick_search, quick_replace)

quick_ui_search = r'''                                  <div className="flex bg-slate-800/80 border border-slate-700 rounded-lg justify-between items-center px-4 py-2 col-span-2 mt-1">
                                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Final Total</span>
                                    <span className="text-xl font-black text-emerald-400 tracking-tight">₹{finalTotal.toFixed\(0\)}</span>'''
quick_ui_replace = r'''                                  <div className="flex bg-slate-800/80 border border-slate-700 rounded-lg justify-between items-center px-4 py-2 col-span-2 mt-1">
                                    <span className="text-amber-500 font-bold text-[11px] uppercase tracking-wider">Packing (3%) : ₹{packingAmt.toFixed(0)}</span>
                                  </div>
                                  <div className="flex bg-slate-800/80 border border-slate-700 rounded-lg justify-between items-center px-4 py-2 col-span-2 mt-1">
                                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Final Total</span>
                                    <span className="text-xl font-black text-emerald-400 tracking-tight">₹{finalTotal.toFixed(0)}</span>'''
content = content.replace(quick_ui_search, quick_ui_replace)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("admin/page.tsx updated.")
