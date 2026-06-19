import { useState } from 'react';
import { useCafe } from '../store/CafeStore';

export default function MenuCard({ item }) {
  const { cart, addToCart, updateCartQty } = useCafe();
  const [imgError, setImgError] = useState(false);
  const cartItem = cart.find(i => i.id === item.id);
  const qty = cartItem?.qty || 0;

  return (
    <div className="glass-card p-4 card-hover group opacity-0 animate-fade-in-up">
      {/* Image placeholder */}
      <div className="relative w-full aspect-[4/3] mb-3 rounded-xl overflow-hidden bg-brand-surface">
        {!imgError ? (
          <img
            src={`https://placehold.co/400x300/1A1A1A/D4A574?text=${encodeURIComponent(item.name)}`}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-brand-surface">
            {item.category === 'coffee' :
             item.category === 'tea':
             item.category === 'cold' :
             item.category === 'starters' :
             item.category === 'mains' ? :
             item.category === 'pasta' ? }
          </div>
        )}

        {/* Veg / Non-veg badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          item.isVeg
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {item.isVeg ? '● Veg' : '● Non-Veg'}
        </div>

        {/* Popular badge */}
        {item.popular && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
            Popular
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <h3 className="font-display text-lg text-brand-cream group-hover:text-brand-gold transition-colors duration-300">
          {item.name}
        </h3>
        <p className="text-brand-cream/40 text-xs leading-relaxed line-clamp-2">
          {item.desc}
        </p>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
        <span className="text-brand-gold font-display text-lg font-semibold">
          ₹{item.price}
        </span>

        {qty === 0 ? (
          <button
            onClick={() => addToCart(item)}
            className="px-4 py-1.5 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm font-semibold
                       hover:bg-brand-gold hover:text-brand-black transition-all duration-300 active:scale-95"
          >
            Add +
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateCartQty(item.id, qty - 1)}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-brand-cream flex items-center justify-center
                         hover:bg-white/10 transition-colors duration-200 active:scale-90"
            >
              −
            </button>
            <span className="text-brand-gold font-semibold text-sm min-w-[20px] text-center">{qty}</span>
            <button
              onClick={() => updateCartQty(item.id, qty + 1)}
              className="w-7 h-7 rounded-lg bg-brand-gold/20 border border-brand-gold/30 text-brand-gold flex items-center justify-center
                         hover:bg-brand-gold/40 transition-colors duration-200 active:scale-90"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
