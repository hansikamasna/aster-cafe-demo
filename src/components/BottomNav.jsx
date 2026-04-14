import { NavLink, useLocation } from 'react-router-dom';
import { useCafe } from '../store/CafeStore';

const navItems = [
  { path: '/menu', label: 'Menu', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )},
  { path: '/cart', label: 'Cart', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.638c.186 0 .351.128.413.314l1.006 3.018a.459.459 0 01-.028.392l-3.7 6.498a.459.459 0 00.393.678h13.936a.459.459 0 00.393-.678l-3.7-6.498a.459.459 0 01-.028-.392l1.006-3.018A.432.432 0 0114.612 3H15.75M6 20.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zm9.75 0a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
    </svg>
  )},
  { path: '/bill', label: 'Bill', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )},
  { path: '/', label: 'Help', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.446-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  )},
];

export default function BottomNav() {
  const { cart } = useCafe();
  const location = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-charcoal/95 backdrop-blur-xl border-t border-white/[0.06] pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path === '/' && location.pathname === '/');
          const isHelp = item.path === '/' && location.pathname !== '/';

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
                isActive && !isHelp
                  ? 'text-brand-gold'
                  : 'text-brand-cream/40 hover:text-brand-cream/70'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.label === 'Cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-brand-gold text-brand-black text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && !isHelp && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-brand-gold rounded-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}