import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCafe } from '../../store/CafeStore';

export default function CustomerBill() {
  const { tableNumber, getRunningBill } = useCafe();

  const [paymentStep, setPaymentStep] = useState(null);
  // null | 'methods' | 'processing' | 'done'

  if (!tableNumber) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🪑</div>
          <h2 className="font-display text-xl text-brand-cream mb-2">
            Select a Table
          </h2>
          <p className="text-brand-cream/40 text-sm mb-6">
            Please select your table to view the bill.
          </p>

          <Link to="/" className="btn-primary inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const bill = getRunningBill(tableNumber);

  const handlePayOnline = () => {
    setPaymentStep('methods');
  };

  const handlePaymentMethod = (method) => {
    setPaymentStep('processing');

    setTimeout(() => {
      setPaymentStep('done');
    }, 2200);
  };

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mx-auto" />

          <h2 className="font-display text-xl text-brand-cream mt-6">
            Redirecting to Payment...
          </h2>

          <p className="text-brand-cream/40 text-sm mt-2">
            Opening your payment app
          </p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'done') {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-sm w-full animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-emerald-400 animate-bounce-in"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h2 className="font-display text-2xl text-brand-cream mt-6">
            Payment Successful!
          </h2>

          <p className="text-brand-cream/40 text-sm mt-2 mb-6">
            Thank you for dining with us at Aster Cafe & Kitchen.
          </p>

          <Link to="/" className="btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (bill.orders.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4 animate-float">📋</div>

          <h2 className="font-display text-xl text-brand-cream mb-2">
            No Active Orders
          </h2>

          <p className="text-brand-cream/40 text-sm mb-6">
            You haven't placed any orders yet.
          </p>

          <Link to="/menu" className="btn-primary inline-block">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="font-display text-xl text-brand-cream">
            Running Bill
          </h1>

          <p className="text-brand-cream/40 text-xs">
            Table {tableNumber}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Orders */}
        {bill.orders.map((order, idx) => (
          <div
            key={order.id}
            className="glass-card p-4 mb-3 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-brand-cream/40 text-xs">
                  {order.id}
                </span>

                <p className="font-display text-sm text-brand-cream">
                  {new Date(order.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
                {order.status}
              </span>
            </div>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm py-1"
              >
                <span className="text-brand-cream/60">
                  {item.name} × {item.qty}
                </span>

                <span className="text-brand-cream">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}

            <div className="flex justify-between pt-2 mt-2 border-t border-white/[0.06]">
              <span className="font-medium text-brand-cream">
                Order Total
              </span>

              <span className="font-display text-brand-gold">
                ₹{order.total}
              </span>
            </div>
          </div>
        ))}

        {/* Bill Summary */}
        <div className="glass-card p-5 mt-4">
          <h3 className="font-display text-lg text-brand-cream mb-4">
            💳 Bill Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brand-cream/50">Subtotal</span>
              <span className="text-brand-cream">₹{bill.subtotal}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-brand-cream/50">GST (5%)</span>
              <span className="text-brand-cream">₹{bill.gst}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-brand-cream/50">Service Charge</span>
              <span className="text-brand-cream">
                ₹{bill.serviceCharge}
              </span>
            </div>

            <div className="h-px bg-white/10"></div>

            <div className="flex justify-between">
              <span className="font-display text-xl text-brand-cream">
                Total
              </span>

              <span className="font-display text-2xl text-brand-gold">
                ₹{bill.total}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Area */}
        <div className="mt-6 space-y-3">
          {paymentStep === 'methods' ? (
            <div className="glass-card p-5">
              <h3 className="text-center text-brand-cream font-display text-lg mb-4">
                Choose Payment Method
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => handlePaymentMethod('Google Pay')}
                  className="w-full btn-primary"
                >
                  Google Pay
                </button>

                <button
                  onClick={() => handlePaymentMethod('PhonePe')}
                  className="w-full btn-primary"
                >
                  PhonePe
                </button>

                <button
                  onClick={() => handlePaymentMethod('Paytm')}
                  className="w-full btn-primary"
                >
                  Paytm
                </button>

                <button
                  onClick={() => handlePaymentMethod('QR')}
                  className="w-full btn-outline"
                >
                  Scan QR Code
                </button>

                <button
                  onClick={() => setPaymentStep(null)}
                  className="w-full text-brand-cream/60 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={handlePayOnline}
                className="w-full btn-primary py-4 rounded-2xl gold-glow-strong text-lg"
              >
                Pay Online — ₹{bill.total}
              </button>

              <button className="w-full btn-outline py-3">
                Pay at Counter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}