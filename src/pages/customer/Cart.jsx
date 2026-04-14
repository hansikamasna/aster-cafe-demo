import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCafe } from '../../store/CafeStore';

export default function CustomerCart() {
  const { cart, updateCartQty, updateCartNote, removeFromCart, clearCart, cartTotal, tableNumber, setTableNumber, placeOrder } = useCafe();
  const navigate = useNavigate();
  const [showNotes, setShowNotes] = useState({});

  if (!tableNumber) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🪑</div>
          <h2 className="font-display text-xl text-brand-cream mb-2">Select a Table</h2>
          <p className="text-brand-cream/40 text-sm mb-6">Please select your table before placing an order.</p>
          <Link to="/" className="btn-primary inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="text-6xl mb-4 animate-float">🛒</div>
          <h2 className="font-display text-xl text-brand-cream mb-2">Cart is Empty</h2>
          <p className="text-brand-cream/40 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/menu" className="btn-primary inline-block">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const gst = Math.round(cartTotal * 0.05);
  const serviceCharge = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gst + serviceCharge;

  const handlePlaceOrder = () => {
    const order = placeOrder(cart, tableNumber);
    navigate(`/success?orderId=${order.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-black pb-36">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-brand-cream">Your Cart</h1>
            <p className="text-brand-cream/40 text-xs">Table {tableNumber}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-brand-cream/40 text-sm hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {cart.map((item, index) => (
          <div key={item.id} className="glass-card p-4 opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold ${item.isVeg ? 'text-green-400' : 'text-red-400'}`}>
                        {item.isVeg ? '●' : '●'}
                      </span>
                      <h3 className="font-display text-base text-brand-cream">{item.name}</h3>
                    </div>
                    <p className="text-brand-cream/30 text-xs mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-brand-cream/20 hover:text-red-400 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Special instructions */}
                {showNotes[item.id] ? (
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={e => updateCartNote(item.id, e.target.value)}
                    placeholder="e.g., less sugar, no onion..."
                    className="input-field text-xs mt-2 py-2"
                    autoFocus
                    onBlur={() => { if (!item.notes) setShowNotes(s => ({ ...s, [item.id]: false })); }}
                  />
                ) : (
                  <button
                    onClick={() => setShowNotes(s => ({ ...s, [item.id]: true }))}
                    className="text-xs text-brand-cream/30 hover:text-brand-gold transition-colors mt-1"
                  >
                    + Add special instructions
                  </button>
                )}
                {item.notes && !showNotes[item.id] && (
                  <p className="text-xs text-brand-gold/60 mt-1">📝 {item.notes}</p>
                )}
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
              <span className="font-display text-lg text-brand-gold">₹{item.price * item.qty}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCartQty(item.id, item.qty - 1)}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-brand-cream flex items-center justify-center
                             hover:bg-white/10 transition-colors active:scale-90"
                >
                  −
                </button>
                <span className="text-brand-cream font-semibold min-w-[24px] text-center">{item.qty}</span>
                <button
                  onClick={() => updateCartQty(item.id, item.qty + 1)}
                  className="w-8 h-8 rounded-lg bg-brand-gold/20 border border-brand-gold/30 text-brand-gold flex items-center justify-center
                             hover:bg-brand-gold/30 transition-colors active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Summary */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="glass-card p-5">
          <h3 className="font-display text-lg text-brand-cream mb-4">Bill Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-cream/50">Subtotal</span>
              <span className="text-brand-cream">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-cream/50">GST (5%)</span>
              <span className="text-brand-cream">₹{gst}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-cream/50">Service Charge (5%)</span>
              <span className="text-brand-cream">₹{serviceCharge}</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between">
              <span className="font-display text-lg text-brand-cream">Grand Total</span>
              <span className="font-display text-xl text-brand-gold">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full btn-primary mt-4 py-4 text-lg rounded-2xl gold-glow-strong"
        >
          Place Order — ₹{grandTotal}
        </button>
      </div>
    </div>
  );
}