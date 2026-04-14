import { useState } from 'react';
import { useCafe } from '../store/CafeStore';

export default function StaffCallModal({ isOpen, onClose }) {
  const { tableNumber, callStaff } = useCafe();
  const [called, setCalled] = useState(false);

  if (!isOpen) return null;

  const handleCall = () => {
    if (tableNumber) {
      callStaff(tableNumber);
      setCalled(true);
      setTimeout(() => {
        setCalled(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative glass-card p-8 max-w-sm w-full text-center animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {called ? (
          <>
            <div className="text-6xl mb-4 animate-bounce-in">✅</div>
            <h3 className="font-display text-xl text-brand-cream mb-2">Staff Notified!</h3>
            <p className="text-brand-cream/50 text-sm">
              Someone from our team will be at Table {tableNumber} shortly.
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="font-display text-xl text-brand-cream mb-2">Call Staff</h3>
            <p className="text-brand-cream/50 text-sm mb-6">
              This will notify our team at Table {tableNumber}.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-outline flex-1">
                Cancel
              </button>
              <button onClick={handleCall} className="btn-primary flex-1">
                Call Staff
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}