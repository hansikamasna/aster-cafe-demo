import { useMemo } from 'react';
import { useCafe } from '../../store/CafeStore';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['#D4A574', '#8B6914', '#5A7A50', '#E8C99B', '#6B4226', '#C08552', '#3E2723'];

export default function AdminAnalytics() {
  const { orders, revenue, ordersCompleted, tables } = useCafe();

  const activeTables = tables.filter(t => t.status !== 'empty' && t.status !== 'paid').length;

  // Revenue by hour (mock + real combined)
  const hourlyRevenue = useMemo(() => {
    const hours = Array.from({ length: 14 }, (_, i) => ({
      hour: `${(i + 7) % 12 || 12}${i + 7 < 12 ? 'am' : 'pm'}`,
      revenue: 0,
      orders: 0,
    }));

    orders.forEach(order => {
      if (order.status === 'paid') {
        const date = new Date(order.timestamp);
        const h = date.getHours() - 7;
        if (h >= 0 && h < 14) {
          hours[h].revenue += order.total;
          hours[h].orders += 1;
        }
      }
    });

    // Add demo data for visual appeal
    const demoData = [800, 400, 200, 1200, 2400, 1800, 3200, 2800, 1600, 2200, 3400, 2600, 1200, 600];
    hours.forEach((h, i) => {
      if (h.revenue === 0) h.revenue = demoData[i] || 0;
    });

    return hours;
  }, [orders]);

  // Popular items
  const popularItems = useMemo(() => {
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
      });
    });

    const sorted = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({ name, value }));

    // Demo fallback
    if (sorted.length < 3) {
      return [
        { name: 'Cappuccino', value: 42 },
        { name: 'Mocha', value: 38 },
        { name: 'Garlic Bread', value: 35 },
        { name: 'Brownie Sundae', value: 28 },
        { name: 'Alfredo Pasta', value: 24 },
        { name: 'Masala Chai', value: 22 },
        { name: 'Cold Brew', value: 18 },
      ];
    }

    return sorted;
  }, [orders]);

  // Peak hour
  const peakHour = useMemo(() => {
    const max = hourlyRevenue.reduce((a, b) => a.revenue > b.revenue ? a : b, hourlyRevenue[0]);
    return max?.hour || '7am';
  }, [hourlyRevenue]);

  // Average bill
  const avgBill = useMemo(() => {
    const paidOrders = orders.filter(o => o.status === 'paid');
    if (paidOrders.length === 0) return 847; // demo fallback
    return Math.round(paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length);
  }, [orders]);

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card p-3 border border-white/10 text-sm">
          <p className="text-brand-cream font-medium">{label}</p>
          <p className="text-brand-gold">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const metrics = [
    { label: 'Revenue Today', value: `₹${(revenue || 24800).toLocaleString()}`, icon: '💰', change: '+12%' },
    { label: 'Orders Completed', value: ordersCompleted || 47, icon: '✅', change: '+8%' },
    { label: 'Peak Hour', value: peakHour, icon: '📈', change: '' },
    { label: 'Avg. Table Bill', value: `₹${avgBill}`, icon: '🍽️', change: '+5%' },
    { label: 'Active Tables', value: activeTables, icon: '🪑', change: '' },
    { label: 'Most Popular', value: popularItems[0]?.name || 'Cappuccino', icon: '☕', change: '' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-brand-cream mb-6">Analytics</h1>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="glass-card p-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{m.icon}</span>
                {m.change && (
                  <span className={`text-[10px] font-bold ${m.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {m.change}
                  </span>
                )}
              </div>
              <p className="text-brand-cream/40 text-xs uppercase tracking-wider">{m.label}</p>
              <p className="font-display text-xl text-brand-cream mt-0.5">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Revenue by Hour */}
          <div className="md:col-span-2 glass-card p-6">
            <h2 className="font-display text-lg text-brand-cream mb-4">Revenue by Hour</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hourlyRevenue} barCategoryGap="20%">
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9A8A7A', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9A8A7A', fontSize: 11 }}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={customTooltip} cursor={{ fill: 'rgba(212, 165, 116, 0.05)' }} />
                <Bar dataKey="revenue" fill="#D4A574" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Items */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg text-brand-cream mb-4">Popular Items</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={popularItems}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {popularItems.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {popularItems.slice(0, 5).map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-brand-cream/60">{item.name}</span>
                  </div>
                  <span className="text-brand-cream/40">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}