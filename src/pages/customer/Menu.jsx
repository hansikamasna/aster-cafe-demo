import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCafe } from '../../store/CafeStore';
import { categories, menuItems, combos } from '../../data/menuData';
import MenuCard from '../../components/MenuCard';

export default function CustomerMenu() {
  const { cart, tableNumber, setTableNumber, cartTotal } = useCafe();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, searchQuery]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen bg-brand-black pb-36">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-display text-xl text-brand-cream">Menu</h1>
              {tableNumber && (
                <p className="text-brand-cream/40 text-xs">Table {tableNumber}</p>
              )}
            </div>
            <Link
              to="/cart"
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-brand-cream/60
                         hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.638c.186 0 .351.128.413.314l1.006 3.018a.459.459 0 01-.028.392l-3.7 6.498a.459.459 0 00.393.678h13.936a.459.459 0 00.393-.678l-3.7-6.498a.459.459 0 01-.028-.392l1.006-3.018A.432.432 0 0114.612 3H15.75M6 20.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zm9.75 0a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="badge-count">{cartCount}</span>
              )}
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-cream/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="input-field pl-10 text-sm"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-brand-gold text-brand-black'
                  : 'bg-white/5 text-brand-cream/50 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                  activeCategory === cat.id
                    ? 'bg-brand-gold text-brand-black'
                    : 'bg-white/5 text-brand-cream/50 hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Combos */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="mb-8 opacity-0 animate-fade-in-up">
            <h2 className="font-display text-lg text-brand-cream mb-3 flex items-center gap-2">
              <span className="text-brand-gold">★</span> Recommended Combos
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {combos.map(combo => (
                <div key={combo.id} className="flex-shrink-0 w-56 glass-card p-3 card-hover">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                      Save ₹{combo.savings}
                    </span>
                  </div>
                  <h3 className="font-display text-sm text-brand-cream mt-2">{combo.name}</h3>
                  <p className="text-brand-cream/40 text-xs mt-1">{combo.items}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-brand-gold font-display font-bold">₹{combo.price}</span>
                    <span className="text-brand-cream/30 text-xs line-through">₹{combo.originalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${i * 0.03}s` }}>
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-brand-cream/40">No items found</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="btn-outline mt-4 text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Sticky cart button */}
      {cartCount > 0 && (
        <div className="fixed bottom-[72px] left-0 right-0 z-30 px-4 pb-2 animate-slide-up">
          <Link
            to="/cart"
            className="flex items-center justify-between max-w-lg mx-auto p-4 rounded-2xl bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-black font-semibold shadow-[0_0_30px_rgba(212,165,116,0.3)] hover:shadow-[0_0_40px_rgba(212,165,116,0.4)] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-brand-black/20 rounded-lg flex items-center justify-center text-sm font-bold">
                {cartCount}
              </span>
              <span>View Cart</span>
            </div>
            <span className="font-display">₹{cartTotal}</span>
          </Link>
        </div>
      )}
    </div>
  );
}