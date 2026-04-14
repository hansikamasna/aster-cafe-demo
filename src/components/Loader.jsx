import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function Loader() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);   // logo appears
    const t2 = setTimeout(() => setPhase(2), 1400);  // text appears
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-[#1A001F] to-[#4B0076] overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-[#D4A24C]/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center">

        {/* Logo Container */}
        <div
          className={`relative w-40 h-40 transition-all duration-1000 ease-out
          ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <div className="relative w-full h-full flex items-center justify-center">

            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border border-[#D4A24C]/20 animate-pulse"></div>

            {/* Logo */}
            <img
              src={logo}
              alt="Aster Logo"
              className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(212,162,76,0.4)]"
            />

            {/* Shine Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 animate-shine"></div>
            </div>

          </div>
        </div>

        {/* Brand Text */}
        <div
          className={`mt-8 text-center transition-all duration-700
          ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <h1 className="text-4xl font-bold tracking-[0.3em] text-white">
            ASTER
          </h1>

          <p className="text-[#D4A24C] text-sm tracking-[0.4em] mt-2">
            CAFE & KITCHEN
          </p>
        </div>

      </div>
    </div>
  );
}