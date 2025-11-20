
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CableType, SimulationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const simulationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    technicalSpecs: {
      type: Type.OBJECT,
      properties: {
        resistance: { type: Type.STRING, description: "预估电阻特性 (例如: '极低 - 0.02 欧姆/米')" },
        capacitance: { type: Type.STRING, description: "预估电容特性与介电损耗" },
        inductance: { type: Type.STRING, description: "预估电感特性" },
        skinEffectFactor: { type: Type.STRING, description: "集肤效应与高频阻抗分析" },
        shieldingQuality: { type: Type.STRING, description: "RFI/EMI 抑制能力与屏蔽结构分析" },
        estimatedGauge: { type: Type.STRING, description: "预估线规 (AWG) 或等效截面积" },
      },
      required: ["resistance", "capacitance", "inductance", "skinEffectFactor", "shieldingQuality", "estimatedGauge"]
    },
    soundProfile: {
      type: Type.OBJECT,
      properties: {
        bass: { type: Type.NUMBER, description: "低频下潜与控制力 (0-100)" },
        mids: { type: Type.NUMBER, description: "中频密度、磁性与人声情感 (0-100)" },
        treble: { type: Type.NUMBER, description: "高频延伸、泛音与空气感 (0-100)" },
        soundstage: { type: Type.NUMBER, description: "声场三维空间感与结像力 (0-100)" },
        dynamics: { type: Type.NUMBER, description: "瞬态响应与微动态展现 (0-100)" },
        resolution: { type: Type.NUMBER, description: "信息量与微小细节揭示力 (0-100)" },
        warmth: { type: Type.NUMBER, description: "音色冷暖: 0 (极度监听/冷峻) 到 100 (浓郁模拟味/胆味)" },
      },
      required: ["bass", "mids", "treble", "soundstage", "dynamics", "resolution", "warmth"]
    },
    analysis: { type: Type.STRING, description: "针对物理结构、材料、几何编织的工程学分析（不要谈声音，只谈物理构造）。" },
    soundSignature: { type: Type.STRING, description: "详细的声音特性预测。必须明确指出优点和缺点（例如：'高频华丽但低频偏薄'）。描述其独特的音色性格。" },
    recommendations: { type: Type.STRING, description: "基于物理声学的改进建议（禁止提及任何其他品牌名称）。" }
  },
  required: ["technicalSpecs", "soundProfile", "analysis", "soundSignature", "recommendations"]
};

export const analyzeCableDesign = async (
  cableType: CableType,
  description: string,
  imageBase64: string | null
): Promise<SimulationResult> => {
  
  const prompt = `
    你是一位世界顶级的音频物理学家和线材结构工程师。
    你的任务是对用户设计的 ${cableType} 进行残酷、客观、基于物理事实的模拟分析。

    **核心原则**：
    1. **视觉优先**：如果用户提供了图片，**必须**严格基于图片中的结构进行分析。如果图片显示是很细的普通线，绝对不要因为描述里写了"顶级"就给高分。如果图片是简单的双绞，不要幻想出复杂的空气避震结构。
    2. **评分两极化（拒绝平庸）**：
       - 绝不要把所有分数都打在 70-80 分之间！
       - 如果设计有缺陷（如无屏蔽、材料差），相关分数（如背景宁静度/解析力）必须打低分（30-50分）。
       - 只有极其复杂、符合顶级物理声学的设计（类似 Nordost Odin Gold 或 Siltech Triple Crown 级别的结构）才能得到 95-100 分。
       - **不同的线材必须有不同的性格**：银线通常高频/解析分高，但暖度/低频分可能略低；粗铜线通常能量/中频分高，但空气感/速度分低。请拉开差距。

    **评分参考阶梯 (0-100)**：
    *   **< 50分**：普通工业线材标准。PVC外皮，多股绞合铜线。声音模糊，缺乏细节。
    *   **50-70分**：入门发烧。单晶铜(OCC)，简单的铝箔屏蔽，棉线避震。
    *   **70-85分**：高级发烧。纯银或合金导体，独立绝缘，特氟龙/PE介质，复杂的利兹结构。
    *   **85-95分**：High-End 级别。特殊的空气/真空绝缘，复杂的几何编织，特殊的金银配比，低温冷冻处理。
    *   **95-100分**：理论极限。完美消除了集肤效应、邻近效应和电容效应的终极设计。

    **输出要求**：
    1. **Analysis (物理分析)**：只谈物理。晶界效应、介电常数、集肤深度、电磁干扰屏蔽效率等。
    2. **Sound Signature (声音预测)**：**这是重点**。预测它的声音性格。不要只说好话。
       - 格式示例："声音风格倾向于现代高解析。优点是线条感极强，瞬态响应极快；缺点是中频略显清瘦，缺乏厚润感，久听可能疲劳。"
    3. **Recommendations (改进建议)**：**禁止提及任何竞争对手的品牌名称**（如不要说“像Siltech那样...”）。
       - 正确示例：“建议增加空气绝缘层的比例以降低电容...”
       - 正确示例：“导体表面建议进行抛光处理以减少高频趋肤效应造成的相移...”

    **用户输入**: ${description}
    
    请以 JSON 格式返回分析结果，使用简体中文。
  `;

  const parts: any[] = [{ text: prompt }];

  if (imageBase64) {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: simulationSchema,
        temperature: 0.3, // Low temperature for strict, analytical output
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("AI 未返回数据");
    }

    return JSON.parse(resultText) as SimulationResult;
  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
};
