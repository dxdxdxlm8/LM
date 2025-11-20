import React, { useState } from 'react';
import Header from './components/Header';
import CableSelector from './components/CableSelector';
import DesignInput from './components/DesignInput';
import ResultsDisplay from './components/ResultsDisplay';
import { CableType, SimulationResult } from './types';
import { analyzeCableDesign } from './services/geminiService';

function App() {
  const [cableType, setCableType] = useState<CableType | null>(null);
  const [description, setDescription] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!cableType || (!description && !imageBase64)) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCableDesign(cableType, description, imageBase64);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "模拟失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
      setResult(null);
      setError(null);
      // Optional: Keep inputs or clear them
  };

  const canSimulate = cableType !== null && (description.trim().length > 0 || imageBase64 !== null);

  return (
    <div className="min-h-screen bg-hifi-black text-slate-200 font-sans selection:bg-hifi-gold selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Section: Input */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-white">
                    <span className="font-bold text-hifi-gold">01.</span> 选择线材类型
                </h2>
                {result && (
                    <button 
                        onClick={handleReset}
                        className="text-sm text-hifi-gold hover:text-white underline decoration-hifi-gold/30 hover:decoration-white"
                    >
                        开始新的模拟
                    </button>
                )}
            </div>
            
            <CableSelector 
                selected={cableType} 
                onSelect={(t) => {
                    setCableType(t);
                    if(result) handleReset();
                }} 
            />

            {cableType && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                         <h2 className="text-2xl font-light text-white mb-4">
                            <span className="font-bold text-hifi-gold">02.</span> 结构与材料
                        </h2>
                        <DesignInput
                            description={description}
                            imageBase64={imageBase64}
                            onDescriptionChange={setDescription}
                            onImageChange={setImageBase64}
                            onSimulate={handleSimulate}
                            isLoading={isLoading}
                            canSimulate={canSimulate}
                        />
                    </div>

                    <div className="lg:col-span-7 xl:col-span-8">
                        <h2 className="text-2xl font-light text-white mb-6">
                            <span className="font-bold text-hifi-gold">03.</span> 模拟分析结果
                        </h2>
                        
                        {error && (
                             <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg">
                                {error}
                             </div>
                        )}

                        {!result && !isLoading && !error && (
                            <div className="h-[500px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600">
                                <div className="w-16 h-16 border border-slate-700 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl opacity-20">AI</span>
                                </div>
                                <p>等待输入以开始模拟...</p>
                                <p className="text-xs mt-2 max-w-md text-center text-slate-700">
                                    引擎将分析导电率、电容、电感和几何结构以预测声音特性。
                                </p>
                            </div>
                        )}

                        {result && <ResultsDisplay result={result} />}
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default App;