import React from 'react';
import { CableType } from '../types';
import { Zap, Cable, Network, Disc } from 'lucide-react';

interface CableSelectorProps {
  selected: CableType | null;
  onSelect: (type: CableType) => void;
}

const CableSelector: React.FC<CableSelectorProps> = ({ selected, onSelect }) => {
  const options = [
    { type: CableType.POWER, icon: Zap, label: '电源线', sub: 'Power Cable' },
    { type: CableType.USB, icon: Disc, label: 'USB 数据线', sub: 'USB Data' },
    { type: CableType.INTERCONNECT, icon: Cable, label: '信号线', sub: 'Interconnect (RCA/XLR)' },
    { type: CableType.ETHERNET, icon: Network, label: '网线', sub: 'Ethernet (LAN)' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {options.map((opt) => (
        <button
          key={opt.type}
          onClick={() => onSelect(opt.type)}
          className={`
            relative p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 h-32
            ${selected === opt.type 
              ? 'bg-hifi-gold/10 border-hifi-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
              : 'bg-hifi-panel border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
          `}
        >
          <opt.icon 
            className={`w-8 h-8 ${selected === opt.type ? 'text-hifi-gold' : 'text-slate-400'}`} 
          />
          <div className="text-center">
            <div className={`font-medium ${selected === opt.type ? 'text-white' : 'text-slate-300'}`}>
              {opt.label}
            </div>
            <div className="text-xs text-slate-500 mt-1">{opt.sub}</div>
          </div>
          {selected === opt.type && (
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-hifi-gold/50 pointer-events-none" />
          )}
        </button>
      ))}
    </div>
  );
};

export default CableSelector;