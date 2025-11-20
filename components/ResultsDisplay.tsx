
import React from 'react';
import { SimulationResult } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Info, Music, Zap, Activity, Ear, Sliders } from 'lucide-react';

interface ResultsDisplayProps {
  result: SimulationResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const soundData = [
    { subject: '低频质感', A: result.soundProfile.bass, fullMark: 100 },
    { subject: '中频密度', A: result.soundProfile.mids, fullMark: 100 },
    { subject: '高频贵气', A: result.soundProfile.treble, fullMark: 100 },
    { subject: '解析力', A: result.soundProfile.resolution, fullMark: 100 },
    { subject: '声场广度', A: result.soundProfile.soundstage, fullMark: 100 },
    { subject: '微动态', A: result.soundProfile.dynamics, fullMark: 100 },
  ];

  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-yellow-400';
    if (score >= 75) return 'text-hifi-gold';
    if (score >= 50) return 'text-emerald-400';
    return 'text-slate-400';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Main Dashboard: Sound & Physics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sound Profile Radar & Scores */}
        <div className="lg:col-span-7 bg-hifi-panel border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Music className="text-hifi-gold w-5 h-5" />
              <h3 className="text-hifi-gold font-semibold tracking-wide">声音素质六维图谱</h3>
            </div>
            <span className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded">满分: 100</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Radar Chart */}
            <div className="h-64 w-full md:w-1/2 flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={soundData}>
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#d4af37"
                    strokeWidth={2}
                    fill="#d4af37"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
              {/* Center Decor */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-hifi-gold rounded-full shadow-[0_0_10px_#d4af37] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            </div>

            {/* Score Bars */}
            <div className="w-full md:w-1/2 space-y-3">
              {soundData.map((item) => (
                <div key={item.subject} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{item.subject}</span>
                    <span className={`font-mono font-bold text-sm ${getScoreColor(item.A)}`}>
                      {item.A}<span className="text-[10px] opacity-50 ml-0.5">/100</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-hifi-gold-dim to-hifi-gold rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${item.A}%` }}
                    >
                      {item.A >= 90 && <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sound Signature Prediction Text (New Section) */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
             <div className="flex items-center gap-2 mb-3">
               <Ear className="w-4 h-4 text-hifi-gold" />
               <h4 className="text-sm font-semibold text-slate-200">声音特性预测分析</h4>
             </div>
             <div className="bg-slate-900/40 p-4 rounded-lg border-l-2 border-hifi-gold text-sm text-slate-300 leading-relaxed italic">
               "{result.soundSignature}"
             </div>
          </div>
        </div>

        {/* Right Column: Warmth & Physics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Warmth Indicator */}
          <div className="bg-hifi-panel border border-slate-800 rounded-2xl p-6">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sliders className="text-hifi-gold w-5 h-5" />
                  <h3 className="text-hifi-gold font-semibold tracking-wide">音色冷暖取向</h3>
                </div>
                <div className="text-hifi-gold font-mono text-xl font-bold">{result.soundProfile.warmth}</div>
             </div>
             
             <div className="relative mt-8 mb-4 px-2">
                {/* Labels */}
                <div className="absolute -top-8 left-0 text-xs font-medium text-cyan-400">极冷/监听</div>
                <div className="absolute -top-8 right-0 text-xs font-medium text-amber-500">极暖/胆味</div>
                
                {/* Track */}
                <div className="h-4 bg-slate-900 rounded-full shadow-inner relative overflow-hidden border border-slate-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 via-slate-800/0 to-amber-900/40"></div>
                  {/* Center Marker */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600"></div>
                </div>

                {/* The Diamond Cursor */}
                <div 
                  className="absolute top-1/2 w-6 h-6 bg-hifi-gold rotate-45 shadow-[0_0_15px_rgba(212,175,55,0.8)] flex items-center justify-center transform -translate-x-3 -translate-y-1/2 transition-all duration-1000 z-10 border-2 border-white/20"
                  style={{ left: `${result.soundProfile.warmth}%` }}
                >
                  <div className="w-2 h-2 bg-hifi-black rounded-full"></div>
                </div>
             </div>
             <p className="text-xs text-center text-slate-500 mt-2">
               数值越大，声音越偏向模拟味、厚实、宽松。数值越小，声音越偏向线条感、冷静、快速。
             </p>
          </div>

          {/* Physical Specs */}
          <div className="bg-hifi-panel border border-slate-800 rounded-2xl p-6 flex-1">
             <div className="flex items-center gap-2 mb-5">
              <Zap className="text-hifi-gold w-5 h-5" />
              <h3 className="text-hifi-gold font-semibold tracking-wide">物理架构参数</h3>
            </div>
            <div className="space-y-3">
              <SpecRow label="电阻" value={result.technicalSpecs.resistance} />
              <SpecRow label="电容" value={result.technicalSpecs.capacitance} />
              <SpecRow label="电感" value={result.technicalSpecs.inductance} />
              <SpecRow label="集肤" value={result.technicalSpecs.skinEffectFactor} />
              <SpecRow label="屏蔽" value={result.technicalSpecs.shieldingQuality} />
              <SpecRow label="线规" value={result.technicalSpecs.estimatedGauge} />
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-700/50">
              <h4 className="text-xs text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3" /> 结构工程分析
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-5 hover:line-clamp-none transition-all">
                {result.analysis}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-gradient-to-r from-slate-900 to-hifi-panel border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
         <div className="absolute -right-10 -top-10 w-40 h-40 bg-hifi-gold/5 rounded-full blur-3xl group-hover:bg-hifi-gold/10 transition-all duration-1000"></div>
         <h3 className="text-white font-semibold mb-3 flex items-center gap-2 relative z-10">
            <Info className="w-4 h-4 text-hifi-gold" />
            设计优化建议 (Design Improvements)
         </h3>
         <p className="text-slate-300 leading-relaxed text-sm relative z-10">
           {result.recommendations}
         </p>
      </div>
    </div>
  );
};

const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-slate-800/50 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
    <span className="text-xs text-slate-500 uppercase font-medium">{label}</span>
    <span className="text-xs text-hifi-text font-mono text-right max-w-[70%] truncate" title={value}>{value}</span>
  </div>
);

export default ResultsDisplay;
