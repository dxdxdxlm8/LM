import React from 'react';
import { Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800 bg-hifi-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-hifi-gold to-yellow-200 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]">
            <Activity className="w-5 h-5 text-hifi-black" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-hifi-gold bg-clip-text text-transparent bg-gradient-to-r from-hifi-gold to-white">
            HIFI 线材架构师
          </h1>
        </div>
        <div className="text-sm text-slate-500 hidden sm:block">
          高保真线材模拟引擎
        </div>
      </div>
    </header>
  );
};

export default Header;