
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface DesignInputProps {
  description: string;
  imageBase64: string | null;
  onDescriptionChange: (val: string) => void;
  onImageChange: (val: string | null) => void;
  onSimulate: () => void;
  isLoading: boolean;
  canSimulate: boolean;
}

const DesignInput: React.FC<DesignInputProps> = ({
  description,
  imageBase64,
  onDescriptionChange,
  onImageChange,
  onSimulate,
  isLoading,
  canSimulate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="space-y-6 bg-hifi-panel p-6 rounded-2xl border border-slate-800">
      <div>
        <label className="block text-hifi-gold text-sm font-semibold tracking-wide mb-2">
          设计规格描述
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="请尽量详细描述，以便获得准确评分。例如：7N 单晶铜导体，每股 0.5mm，特氟龙空气管绝缘，碳纤维屏蔽层..."
          className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-1 focus:ring-hifi-gold focus:border-hifi-gold outline-none resize-none transition-all placeholder-slate-600"
        />
      </div>

      <div>
        <label className="block text-hifi-gold text-sm font-semibold tracking-wide mb-2">
          视觉参考图 (强烈建议上传)
        </label>
        
        {!imageBase64 ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
              ${dragActive ? 'border-hifi-gold bg-hifi-gold/5' : 'border-slate-700 hover:border-slate-500 bg-slate-900/30'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-slate-500 mb-3" />
            <p className="text-sm text-slate-400 text-center">
              AI 将严格分析图片中的物理结构<br/>
              <span className="text-hifi-gold mt-1 inline-block">点击上传或拖拽图片</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 group">
            <img 
              src={imageBase64} 
              alt="Cable Reference" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <button 
                onClick={() => onImageChange(null)}
                className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onSimulate}
        disabled={!canSimulate || isLoading}
        className={`
          w-full py-4 px-6 rounded-lg font-bold text-lg uppercase tracking-widest transition-all duration-500 relative overflow-hidden
          ${!canSimulate || isLoading 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-hifi-gold-dim to-hifi-gold text-hifi-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.01] active:scale-[0.99]'}
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-hifi-black border-t-transparent rounded-full animate-spin" />
            AI 深度计算中...
          </span>
        ) : (
          "开始模拟"
        )}
      </button>
    </div>
  );
};

export default DesignInput;
