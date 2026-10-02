import re

target_file = '../Dhakshina_Crackers_Admin/app/admin/page.tsx'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix logic
search_logic = r'''                            const finalTotal = Math.max(0, total - extraAmt);
                            const finalSavings = (subtotal - total) + extraAmt;'''
replace_logic = r'''                            const packingAmt = (total * 3) / 100;
                            const finalTotal = Math.max(0, total - extraAmt + packingAmt);
                            const finalSavings = (subtotal - total) + extraAmt;'''
if search_logic in content:
    content = content.replace(search_logic, replace_logic)
    print("Logic Replaced")

# Fix UI
search_ui = r'''                              <div className="flex justify-between items-end mb-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                                <div>
                                  <div className="text-[10px] text-slate-400 tracking-widest font-semibold uppercase mb-1">Total Amount</div>
                                  <div className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-md inline-block">
                                    Save ₹{finalSavings.toFixed(0)} ({subtotal > 0 ? Math.round((finalSavings / subtotal) * 100) : 0}% OFF)
                                  </div>
                                </div>
                                <div className="text-2xl font-semibold text-white tracking-tight">₹{finalTotal.toFixed(2)}</div>
                              </div>'''

replace_ui = r'''                              <div className="flex justify-between items-center mb-1.5 bg-slate-800/20 px-3 py-1.5 rounded-lg border border-slate-700/30">
                                <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider">Packing Charges (3%)</span>
                                <span className="text-xs font-bold text-amber-500">+₹{packingAmt.toFixed(0)}</span>
                              </div>
                              <div className="flex justify-between items-end mb-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                                <div>
                                  <div className="text-[10px] text-slate-400 tracking-widest font-semibold uppercase mb-1">Final Amount</div>
                                  <div className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-md inline-block">
                                    Save ₹{finalSavings.toFixed(0)} ({subtotal > 0 ? Math.round((finalSavings / subtotal) * 100) : 0}% OFF)
                                  </div>
                                </div>
                                <div className="text-2xl font-semibold text-white tracking-tight">₹{finalTotal.toFixed(2)}</div>
                              </div>'''
if search_ui in content:
    content = content.replace(search_ui, replace_ui)
    print("UI Replaced")

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

