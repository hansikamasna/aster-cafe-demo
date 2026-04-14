import { useState } from 'react';
import { useCafe } from '../../store/CafeStore';
import AdminLayout from '../../components/admin/AdminLayout';

const statusColors = {
  empty:     { bg: 'bg-white/10', text: 'text-white/30', border: 'border-white/10', dot: 'bg-white/20' },
  browsing:  { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
  waiting:   { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
  accepted:  { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
  preparing: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-400' },
  ready:     { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  served:    { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400' },
  paid:      { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' },
};

export default function AdminTables() {
  const { tables, orders, staffCalls, markTablePaid, resetTable, updateOrderStatus, resolveStaffCall } = useCafe();
  const [selectedTable, setSelectedTable] = useState(null);

  const table = selectedTable ? tables.find(t => t.id === selectedTable) : null;
  const tableOrders = selectedTable ? orders.filter(o => o.tableNumber === selectedTable && o.status !== 'cancelled' && o.status !== 'paid') : [];
  const tableCalls = selectedTable ? staffCalls.filter(c => c.tableNumber === selectedTable && !c.resolved) : [];
  const colors = table ? statusColors[table.status] : statusColors.empty;

  const formatDuration = (ms) => {
    if (!ms) return '--';
    const mins = Math.floor((Date.now() - ms) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-brand-cream mb-6">Tables</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Table Grid */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {tables.map((t, i) => {
                const c = statusColors[t.status] || statusColors.empty;
                const isSelected = selectedTable === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTable(t.id)}
                    className={`glass-card p-4 text-center border transition-all duration-300 hover:-translate-y-0.5
                      ${c.bg} ${c.border} ${isSelected ? 'ring-2 ring-brand-gold/50' : ''} opacity-0 animate-fade-in-up`}
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    <p className="font-display text-3xl text-brand-cream">{t.id}</p>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className={`w-2 h-2 rounded-full ${c.dot} ${t.status !== 'empty' ? 'animate-pulse' : ''}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>
                        {t.status}
                      </span>
                    </div>
                    {t.currentBill > 0 && (
                      <p className="text-brand-gold text-sm font-semibold mt-2">₹{t.currentBill}</p>
                    )}
                    {t.orderCount > 0 && (
                      <p className="text-brand-cream/25 text-[10px]">{t.orderCount} orders</p>
                    )}
                    {t.occupiedAt && (
                      <p className="text-brand-cream/25 text-[10px]">{formatDuration(t.occupiedAt)}</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-6">
              {Object.entries(statusColors).map(([status, c]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-[10px] uppercase tracking-wider ${c.text}`}>{status}</span>
                </div>
              ))}
            </div>

            {/* QR Codes */}
            <div className="mt-8">
              <h2 className="font-display text-lg text-brand-cream mb-4">QR Codes</h2>
              <p className="text-brand-cream/40 text-sm mb-4">Place these QR codes on each table. Scanning will open the ordering page.</p>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {tables.slice(0, 12).map(t => (
                  <div key={t.id} className="glass-card p-3 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&bgcolor=1A1A1A&color=D4A574&data=${encodeURIComponent(`astorcafe.com/?table=${t.id}`)}`}
                      alt={`QR for Table ${t.id}`}
                      className="w-full aspect-square rounded-lg"
                      loading="lazy"
                    />
                    <p className="text-brand-cream/60 text-xs font-medium mt-2">Table {t.id}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Detail Panel */}
          <div>
            {table ? (
              <div className="glass-card p-5 border animate-fade-in-right">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl text-brand-cream">Table {table.id}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text} ${colors.border} border`}>
                    {table.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass-card p-3 text-center">
                    <p className="text-brand-gold font-display text-xl">₹{table.currentBill}</p>
                    <p className="text-brand-cream/30 text-[10px] uppercase">Current Bill</p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <p className="text-brand-cream font-display text-xl">{table.orderCount}</p>
                    <p className="text-brand-cream/30 text-[10px] uppercase">Orders</p>
                  </div>
                </div>

                {table.occupiedAt && (
                  <p className="text-brand-cream/40 text-xs mb-4">
                    Occupied for {formatDuration(table.occupiedAt)}
                  </p>
                )}

                {/* Staff Calls */}
                {tableCalls.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 text-sm font-semibold mb-2">🔔 Staff Called</p>
                    {tableCalls.map(call => (
                      <div key={call.id} className="flex items-center justify-between">
                        <span className="text-amber-400/60 text-xs">
                          {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => resolveStaffCall(call.id)}
                          className="text-xs text-amber-400 hover:text-amber-300"
                        >
                          Resolve
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Current Orders */}
                {tableOrders.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-brand-cream/60 text-xs font-bold uppercase tracking-wider mb-2">Current Orders</h3>
                    <div className="space-y-2">
                      {tableOrders.map(order => (
                        <div key={order.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-brand-cream/50 text-xs">{order.id}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              statusColors[order.status]?.bg + ' ' + statusColors[order.status]?.text + ' ' + statusColors[order.status]?.border + ' border'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          {order.items.map(item => (
                            <p key={item.id} className="text-brand-cream/60 text-xs">
                              {item.name} × {item.qty}
                              {item.notes && <span className="text-brand-gold/40 ml-1">({item.notes})</span>}
                            </p>
                          ))}
                          <p className="text-brand-cream/30 text-[10px] mt-1">
                            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>

                          {/* Status buttons */}
                          <div className="flex gap-1 mt-2">
                            {order.status === 'pending' && (
                              <button onClick={() => updateOrderStatus(order.id, 'accepted')} className="text-[10px] px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Accept</button>
                            )}
                            {order.status === 'accepted' && (
                              <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="text-[10px] px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">Preparing</button>
                            )}
                            {order.status === 'preparing' && (
                              <button onClick={() => updateOrderStatus(order.id, 'ready')} className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ready</button>
                            )}
                            {order.status === 'ready' && (
                              <button onClick={() => updateOrderStatus(order.id, 'served')} className="text-[10px] px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Served</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                  {table.currentBill > 0 && (
                    <button
                      onClick={() => markTablePaid(table.id)}
                      className="w-full btn-primary text-sm py-2.5"
                    >
                      💳 Mark as Paid — ₹{table.currentBill}
                    </button>
                  )}
                  <button
                    onClick={() => resetTable(table.id)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-brand-cream/40 text-sm hover:text-brand-cream/60 transition-all"
                  >
                    Reset Table
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-brand-cream/40 text-sm">Select a table to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}