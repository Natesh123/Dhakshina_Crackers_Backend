import re

target_file = '../Dhakshina_Crackers_Admin/app/admin/page.tsx'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

search_str = r'''                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="py-5 px-6 text-right text-base font-bold tracking-tight text-slate-500">Total Amount:</td>
                      <td className="py-5 px-6 text-right text-xl font-semibold text-slate-900">₹{viewingOrder.total_amount + (viewingOrder.total_savings || 0)}</td>
                    </tr>
                    {(viewingOrder.total_savings || 0) > 0 && (
                      <tr className="border-t border-slate-200">
                        <td colSpan={4} className="py-4 px-6 text-right text-sm font-bold tracking-tight text-emerald-600">
                          Discount Applied ({Math.round(((viewingOrder.total_savings || 0) / (viewingOrder.total_amount + (viewingOrder.total_savings || 0))) * 100)}% OFF):
                        </td>
                        <td className="py-4 px-6 text-right text-lg font-semibold text-emerald-600">-₹{viewingOrder.total_savings || 0}</td>
                      </tr>
                    )}
                    <tr className="border-t border-slate-200 bg-slate-50">
                      <td colSpan={3} className="py-4 px-6 border-r border-slate-200/60">'''

replace_str = r'''                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="py-5 px-6 text-right text-base font-bold tracking-tight text-slate-500">Total Amount:</td>
                      <td className="py-5 px-6 text-right text-xl font-semibold text-slate-900">
                        ₹{(() => {
                           const itemOriginalTotal = viewingOrder.items.reduce((acc: any, item: any) => acc + (item.originalPrice * item.quantity), 0);
                           return itemOriginalTotal;
                        })()}
                      </td>
                    </tr>
                    {(viewingOrder.total_savings || 0) > 0 && (
                      <tr className="border-t border-slate-200">
                        <td colSpan={4} className="py-4 px-6 text-right text-sm font-bold tracking-tight text-emerald-600">
                          Discount Applied:
                        </td>
                        <td className="py-4 px-6 text-right text-lg font-semibold text-emerald-600">-₹{viewingOrder.total_savings || 0}</td>
                      </tr>
                    )}
                    <tr className="border-t border-slate-200">
                      <td colSpan={4} className="py-4 px-6 text-right text-sm font-bold tracking-tight text-amber-600">
                        Packing Charges (3%):
                      </td>
                      <td className="py-4 px-6 text-right text-lg font-semibold text-amber-600">
                        +₹{(() => {
                           const itemOfferTotal = viewingOrder.items.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);
                           return Math.round(itemOfferTotal * 0.03);
                        })()}
                      </td>
                    </tr>
                    <tr className="border-t border-slate-200 bg-slate-50">
                      <td colSpan={3} className="py-4 px-6 border-r border-slate-200/60">'''

if search_str in content:
    content = content.replace(search_str, replace_str)
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Search string not found")

