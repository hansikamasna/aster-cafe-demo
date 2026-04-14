import { useEffect, useState } from 'react';
import { useCafe } from '../../store/CafeStore';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const { tables, orders, revenue, ordersCompleted, staffCalls, updateOrderStatus, resolveStaffCall } = useCafe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const activeTables = tables.filter(t => t.status !== 'empty' && t.status !== 'paid').length;
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const unresolvedCalls = staffCalls.filter(c => !c.resolved);

  const stats = [
    { label: 'Active Tables', value: activeTables, icon: '🍽️', color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20' },
    { label: 'Pending Orders', value: pendingOrders.length, icon: '⏳', color: 'from-red-500/20 to-red-600/5 border-red-500/20' },
    { label: 'Revenue Today', value: `₹${revenue.toLocaleString()}`, icon: '💰', color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20' },
    { label: 'Orders Done', value: ordersCompleted, icon: '✅', color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20' },
  ];

  const statusColors = {
    empty: 'bg-white/10 text-white/30 border-white/10',
    browsing: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    waiting: 'bg-red-500/15 text-red-400 border-red-500/20',
    accepted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    preparing: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    ready: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    served: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    paid: 'bg-green-500/15 text-green-400 border-green-500/20',
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card p-4 bg-gradient-to-br ${stat.color} border opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-brand-cream/40 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="font-display text-2xl text-brand-cream mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Live Table Grid */}
          <div className="md:col-span-2">
            <h2 className="font-display text-lg text-brand-cream mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live Table Status
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {tables.map((table, i) => (
                <div
                  key={table.id}
                  className={`glass-card p-4 text-center border transition-all duration-300 hover:-translate-y-0.5
                    ${statusColors[table.status] || statusColors.empty} opacity-0 animate-fade-in-up`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <p className="font-display text-2xl text-brand-cream">{table.id}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 rounded-full py-0.5 ${statusColors[table.status]?.split(' ')[1]}`}>
                    {table.status}
                  </p>
                  {table.currentBill > 0 && (
                    <p className="text-brand-gold text-sm font-semibold mt-2">₹{table.currentBill}</p>
                  )}
                  {table.orderCount > 0 && (
                    <p className="text-brand-cream/30 text-[10px] mt-1">{table.orderCount} orders</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Incoming orders + Staff alerts */}
          <div className="space-y-6">
            {/* Incoming Orders */}
            <div>
              <h2 className="font-display text-lg text-brand-cream mb-4 flex items-center gap-2">
                <span className="text-brand-gold">🔔</span> Incoming Orders
              </h2>
              {pendingOrders.length === 0 ? (
                <div className="glass-card p-6 text-center">
                  <p className="text-brand-cream/30 text-sm">No pending orders</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="glass-card p-4 border border-red-500/20 animate-pulse-glow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display text-brand-cream">Table {order.tableNumber}</span>
                        <span className="text-brand-cream/30 text-xs">{order.id}</span>
                      </div>
                      <p className="text-brand-cream/50 text-xs mb-3">
                        {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'accepted')}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Staff Alerts */}
            {unresolvedCalls.length > 0 && (
              <div>
                <h2 className="font-display text-lg text-brand-cream mb-4 flex items-center gap-2">
                  <span className="animate-pulse">🔔</span> Staff Calls
                </h2>
                <div className="space-y-2">
                  {unresolvedCalls.map(call => (
                    <div key={call.id} className="glass-card p-3 border border-amber-500/20 flex items-center justify-between">
                      <div>
                        <p className="text-brand-cream text-sm font-medium">Table {call.tableNumber}</p>
                        <p className="text-brand-cream/30 text-xs">
                          {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={() => resolveStaffCall(call.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
                      >
                        Resolved
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}