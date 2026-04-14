import { useState } from 'react';
import { useCafe } from '../../store/CafeStore';
import AdminLayout from '../../components/admin/AdminLayout';

const statusFlow = ['pending', 'accepted', 'preparing', 'ready', 'served'];

const statusConfig = {
  pending:   { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20', label: 'Pending' },
  accepted:  { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Accepted' },
  preparing: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/20', label: 'Preparing' },
  ready:     { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Ready' },
  served:    { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20', label: 'Served' },
  cancelled: { bg: 'bg-white/5', text: 'text-white/30', border: 'border-white/10', label: 'Cancelled' },
  paid:      { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/20', label: 'Paid' },
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, cancelOrder } = useCafe();
  const [filter, setFilter] = useState('active');

  const filtered = orders.filter(o => {
    if (filter === 'active') return !['cancelled', 'paid'].includes(o.status);
    if (filter === 'completed') return ['cancelled', 'paid'].includes(o.status);
    return true;
  }).sort((a, b) => b.timestamp - a.timestamp);

  const getNextStatus = (status) => {
    const idx = statusFlow.indexOf(status);
    return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-brand-cream">Orders</h1>
          <div className="flex gap-2">
            {['active', 'completed', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-brand-gold text-brand-black'
                    : 'bg-white/5 text-brand-cream/50 hover:bg-white/10'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-brand-cream/40">No orders to display</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const nextStatus = getNextStatus(order.status);

              return (
                <div
                  key={order.id}
                  className={`glass-card p-5 border ${config.border} opacity-0 animate-fade-in-up`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg text-brand-cream">Table {order.tableNumber}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.border} border`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-brand-cream/30 text-xs mt-1">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-brand-gold">₹{order.total}</p>
                      <p className="text-brand-cream/30 text-xs">
                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 mb-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-brand-cream/60">
                          {item.name} × {item.qty}
                          {item.notes && <span className="text-brand-gold/50 text-xs ml-2">📝 {item.notes}</span>}
                        </span>
                        <span className="text-brand-cream/40">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  {order.status !== 'cancelled' && order.status !== 'paid' && (
                    <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                      {nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                          className="btn-primary text-xs py-2 px-4"
                        >
                          Mark as {statusConfig[nextStatus]?.label}
                        </button>
                      )}
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}