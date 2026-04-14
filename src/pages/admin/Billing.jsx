import { useState } from 'react';
import { useCafe } from '../../store/CafeStore';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminBilling() {
  const { tables, orders, markTablePaid } = useCafe();
  const [selectedTable, setSelectedTable] = useState(null);
  const [billSent, setBillSent] = useState(null);

  const activeTables = tables.filter(t => t.currentBill > 0);
  const table = selectedTable ? tables.find(t => t.id === selectedTable) : null;
  const tableOrders = selectedTable
    ? orders.filter(o => o.tableNumber === selectedTable && o.status !== 'cancelled' && o.status !== 'paid')
    : [];

  const subtotal = tableOrders.reduce((sum, o) => sum + o.total, 0);
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.05);
  const total = subtotal + gst + serviceCharge;

  const handleGenerateBill = (tableId) => {
    setBillSent(tableId);
    setTimeout(() => setBillSent(null), 3000);
  };

  const handleMarkPaid = (tableId) => {
    markTablePaid(tableId);
    setSelectedTable(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-2xl text-brand-cream mb-6">Billing</h1>

        {activeTables.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4 animate-float">💳</div>
            <p className="text-brand-cream/40">No active bills to display</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Table list */}
            <div className="space-y-3">
              {activeTables.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTable(t.id)}
                  className={`w-full glass-card p-4 text-left card-hover border transition-all
                    ${selectedTable === t.id ? 'border-brand-gold/40 ring-1 ring-brand-gold/20' : 'border-white/[0.06]'}
                    opacity-0 animate-fade-in-up`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg text-brand-cream">Table {t.id}</h3>
                      <p className="text-brand-cream/30 text-xs">{t.orderCount} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl text-brand-gold">₹{t.currentBill}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        t.status === 'served' ? 'bg-purple-500/10 text-purple-400' :
                        t.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Invoice Preview */}
            <div>
              {table && tableOrders.length > 0 ? (
                <div className="glass-card p-6 border border-brand-gold/10 animate-scale-in">
                  {/* Header */}
                  <div className="text-center pb-4 border-b border-white/[0.06]">
                    <h2 className="font-display text-2xl text-brand-cream">Astor Café</h2>
                    <p className="text-brand-cream/30 text-xs mt-1">742 Blossom Lane, Portland, OR</p>
                    <p className="text-brand-cream/20 text-xs">Tax ID: 12-3456789</p>
                  </div>

                  {/* Invoice Info */}
                  <div className="flex justify-between py-4 border-b border-white/[0.06] text-sm">
                    <div>
                      <p className="text-brand-cream/40">Table</p>
                      <p className="font-display text-brand-cream">{table.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-cream/40">Date</p>
                      <p className="text-brand-cream">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="py-4 border-b border-white/[0.06]">
                    <div className="grid grid-cols-12 gap-2 text-xs text-brand-cream/40 font-bold uppercase tracking-wider mb-3">
                      <span className="col-span-6">Item</span>
                      <span className="col-span-2 text-center">Qty</span>
                      <span className="col-span-2 text-right">Rate</span>
                      <span className="col-span-2 text-right">Amount</span>
                    </div>
                    <div className="space-y-2">
                      {tableOrders.flatMap(o => o.items).map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="grid grid-cols-12 gap-2 text-sm">
                          <span className="col-span-6 text-brand-cream/70">{item.name}</span>
                          <span className="col-span-2 text-brand-cream/50 text-center">{item.qty}</span>
                          <span className="col-span-2 text-brand-cream/50 text-right">₹{item.price}</span>
                          <span className="col-span-2 text-brand-cream text-right">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="py-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-cream/40">Subtotal</span>
                      <span className="text-brand-cream">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-cream/40">GST (5%)</span>
                      <span className="text-brand-cream">₹{gst}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-cream/40">Service Charge (5%)</span>
                      <span className="text-brand-cream">₹{serviceCharge}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between">
                      <span className="font-display text-lg text-brand-cream">Grand Total</span>
                      <span className="font-display text-2xl text-brand-gold">₹{total}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                    {billSent === table.id && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center animate-fade-in">
                        ✅ Bill sent to Table {table.id}!
                      </div>
                    )}
                    <button
                      onClick={() => handleGenerateBill(table.id)}
                      className="w-full btn-outline text-sm py-2.5"
                    >
                      📱 Send Bill to Table
                    </button>
                    <button
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-brand-cream/60 text-sm hover:text-brand-cream/80 transition-all"
                    >
                      🖨️ Print Bill
                    </button>
                    <button
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-brand-cream/60 text-sm hover:text-brand-cream/80 transition-all"
                    >
                      💬 WhatsApp Bill
                    </button>
                    <button
                      onClick={() => handleMarkPaid(table.id)}
                      className="w-full btn-primary text-sm py-3"
                    >
                      ✅ Mark as Paid — ₹{total}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-brand-cream/40 text-sm">Select a table to generate bill</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}