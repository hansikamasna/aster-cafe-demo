import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCafe } from '../../store/CafeStore';
import StaffCallModal from '../../components/StaffCallModal';

export default function CustomerHome() {
  const { tableNumber, setTableNumber, callStaff } = useCafe();
  const [showTableSelect, setShowTableSelect] = useState(false);
  const [staffModal, setStaffModal] = useState(false);
  const [inputTable, setInputTable] = useState('');
  const navigate = useNavigate();

  const handleTableSelect = (num) => {
    setTableNumber(num);
    setShowTableSelect(false);
  };

  const handleManualTable = () => {
    const num = parseInt(inputTable, 10);
    if (num >= 1 && num <= 12) {
      setTableNumber(num);
      setShowTableSelect(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1A001F] to-[#4B0076]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.18)_0%,transparent_30%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(75,0,118,0.35)_0%,transparent_45%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_55%)]" />
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="steam-particle"
              style={{
                left: `${15 + i * 15}%`,
                bottom: '-5px',
                animationDelay: `${i * 2}s`,
                animationDuration: `${7 + i}s`,
                width: `${2 + i}px`,
                height: `${2 + i}px`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-lg mx-auto px-6 pt-16 pb-24">
          {/* Table indicator */}
          {tableNumber ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-gold/30 mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-brand-cream/70 text-sm">Table</span>
              <span className="text-brand-gold font-display font-bold text-lg">{tableNumber}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowTableSelect(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-gold/30 mb-8
                         hover:border-brand-gold/60 transition-all duration-300 cursor-pointer animate-fade-in"
            >
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-brand-cream/70 text-sm">Select your table</span>
            </button>
          )}

          {/* Brand */}
          <div className="animate-fade-in-up">
            <p className="text-brand-gold/60 text-xs font-medium tracking-[0.3em] uppercase mb-3">
              Premium Coffee Experience
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-brand-cream leading-[1.1] mb-4">
              Welcome to<br />
              <span className="text-gold-gradient">Aster Café</span>
            </h1>
            <p className="text-brand-cream/40 text-base leading-relaxed max-w-md">
              Scan, browse, order — your coffee journey starts here. Every cup is crafted with passion.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mt-10 space-y-3 stagger-1 opacity-0 animate-fade-in-up">
            <Link
              to="/menu"
              className="flex items-center gap-4 p-4 rounded-2xl glass-card card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-2xl
                             group-hover:bg-brand-gold/20 transition-all duration-300">
                ☕
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-brand-cream group-hover:text-brand-gold transition-colors">
                  View Menu
                </h3>
                <p className="text-brand-cream/40 text-sm">Browse our full collection</p>
              </div>
              <svg className="w-5 h-5 text-brand-cream/30 group-hover:text-brand-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/bill"
              className="flex items-center gap-4 p-4 rounded-2xl glass-card card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl
                             group-hover:bg-emerald-500/20 transition-all duration-300">
                📋
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-brand-cream group-hover:text-brand-gold transition-colors">
                  View Bill
                </h3>
                <p className="text-brand-cream/40 text-sm">Check your running total</p>
              </div>
              <svg className="w-5 h-5 text-brand-cream/30 group-hover:text-brand-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              onClick={() => tableNumber ? setStaffModal(true) : setShowTableSelect(true)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl glass-card card-hover group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl
                             group-hover:bg-amber-500/20 transition-all duration-300">
                🔔
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-brand-cream group-hover:text-brand-gold transition-colors">
                  Call Staff
                </h3>
                <p className="text-brand-cream/40 text-sm">Need assistance? We're here</p>
              </div>
              <svg className="w-5 h-5 text-brand-cream/30 group-hover:text-brand-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Integrations */}
          <div className="mt-10 opacity-0 animate-fade-in-up stagger-3">
            <p className="text-brand-cream/30 text-xs text-center uppercase tracking-widest mb-4">Also available on</p>
            <div className="flex justify-center gap-3">
              {[
                { name: 'Swiggy', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
                { name: 'Zomato', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
                { name: 'Instagram', color: 'bg-pink-500/10 border-pink-500/20 text-pink-400' },
              ].map(platform => (
                <div key={platform.name} className={`px-4 py-2 rounded-xl border text-sm font-medium ${platform.color} cursor-pointer hover:opacity-80 transition-opacity`}>
                  {platform.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table selection modal */}
      {showTableSelect && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowTableSelect(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-card p-6 max-w-sm w-full rounded-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-brand-cream mb-2">Select Your Table</h3>
            <p className="text-brand-cream/40 text-sm mb-5">Choose your table number to start ordering</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <button
                  key={num}
                  onClick={() => handleTableSelect(num)}
                  className={`aspect-square rounded-xl border text-lg font-display font-bold transition-all duration-300
                    ${tableNumber === num
                      ? 'bg-brand-gold text-brand-black border-brand-gold'
                      : 'bg-white/5 border-white/10 text-brand-cream/60 hover:border-brand-gold/40 hover:text-brand-gold'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={inputTable}
                onChange={e => setInputTable(e.target.value)}
                placeholder="Or enter manually"
                className="input-field flex-1"
                min="1"
                max="12"
              />
              <button onClick={handleManualTable} className="btn-primary">
                Go
              </button>
            </div>
          </div>
        </div>
      )}

      <StaffCallModal isOpen={staffModal} onClose={() => setStaffModal(false)} />
    </div>
  );
}