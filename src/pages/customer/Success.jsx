import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCafe } from '../../store/CafeStore';

export default function CustomerSuccess() {
  const { tableNumber, getTableOrders } = useCafe();
  const [searchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  const orderId = searchParams.get('orderId');
  const orders = tableNumber ? getTableOrders(tableNumber) : [];
  const latestOrder = orders.find(o => o.id === orderId) || orders[orders.length - 1];

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-sm w-full text-center">
        {/* Animated checkmark */}
        <div className={`transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="w-24 h-24 mx-auto bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center gold-glow">
            <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="font-display text-2xl text-brand-cream mt-6">
            Order Sent Successfully!
          </h1>
          <p className="text-brand-cream/40 text-sm mt-2 mb-1">
            {orderId ? `Order ${orderId}` : 'Your order has been placed'}
          </p>
          <p className="text-brand-cream/60 text-sm">
            Your order for <strong className="text-brand-gold">Table {tableNumber}</strong> has been sent to the kitchen.
          </p>
        </div>

        {/* Estimated time */}
        <div className={`mt-6 glass-card p-4 inline-block transition-all duration-700 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-3xl mb-1">⏱️</div>
          <p className="text-brand-cream/50 text-xs uppercase tracking-wider">Estimated Time</p>
          <p className="font-display text-2xl text-brand-cream">15 mins</p>
        </div>

        {/* Order details */}
        {latestOrder && (
          <div className={`mt-6 text-left transition-all duration-700 delay-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-display text-sm text-brand-cream/60 mb-2">Your Order</h3>
            <div className="space-y-1.5">
              {latestOrder.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">{item.name} × {item.qty}</span>
                  <span className="text-brand-cream/80">₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between font-medium">
                <span className="text-brand-cream">Total</span>
                <span className="text-brand-gold">₹{latestOrder.total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={`mt-8 flex flex-col gap-3 transition-all duration-700 delay-[900ms] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link to="/menu" className="btn-primary w-full">
            Continue Ordering
          </Link>
          <Link to="/bill" className="btn-outline w-full">
            View Bill
          </Link>
        </div>

        {/* Play success sound */}
        <SuccessSound />
      </div>
    </div>
  );
}

function SuccessSound() {
  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      // Pleasant two-tone chime
      playNote(880, 0, 0.3);    // A5
      playNote(1320, 0.15, 0.4); // E6
      playNote(1760, 0.35, 0.5); // A6
      setTimeout(() => ctx.close(), 1500);
    } catch { /* Audio not supported */ }
  }, []);
  return null;
}