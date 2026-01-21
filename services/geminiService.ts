
import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis, ChartDataPoint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeStock(ticker: string): Promise<StockAnalysis> {
  const model = "gemini-3-pro-preview";
  
  const prompt = `Perform a comprehensive technical and sentiment analysis for the stock ticker: ${ticker.toUpperCase()}. 
  1. Technicals: Use Google Search to find current price, RSI(14), MACD, 50/200 SMA, current Volume vs average, and Short Interest.
  2. History: Find the closing prices for the last 5 trading days.
  3. News: Search for the most recent 3-4 news headlines from the past 7 days.
  4. Strategy: Define a specific Entry Point, a Take Profit (Upside Exit), and a Stop Loss (Downside Exit).
  
  Return the results with deep reasoning. Focus on why the specific entry/exit points are chosen based on support/resistance or indicators.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri,
    }));

  const structuredResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse this analysis into a JSON object. For the 'history' array, use the last 5 closing prices found in the text.
    Text: ${text}
    
    JSON Schema:
    {
      "ticker": "string",
      "name": "string",
      "currentPrice": "string",
      "priceChange": "string",
      "priceChangePercent": "string",
      "technicalSummary": "string",
      "indicators": {
        "rsi": "string", "macd": "string", "movingAverages": "string", "volumeProfile": "string", "shortInterest": "string"
      },
      "momentum": { "trend": "Bullish | Bearish | Neutral", "strength": "string", "description": "string" },
      "sentiment": {
        "score": number, "label": "Positive | Negative | Neutral",
        "headlines": [{"title": "string", "source": "string", "date": "string", "impact": "High | Medium | Low"}],
        "shortTermOutlook": "string"
      },
      "strategy": {
        "entryPoint": "string", "takeProfit": "string", "stopLoss": "string", "downsideExit": "string", "rationale": "string"
      },
      "history": [{"time": "string", "price": number}]
    }`,
    config: {
      responseMimeType: "application/json",
    }
  });

  const analysisJson = JSON.parse(structuredResponse.text);
  
  // Fallback for history if the model didn't find enough points
  if (!analysisJson.history || analysisJson.history.length < 3) {
    analysisJson.history = generateMockChartData(analysisJson.currentPrice);
  }

  return {
    ...analysisJson,
    sources: sources,
  };
}

export function generateMockChartData(currentPrice: string): ChartDataPoint[] {
  const priceStr = currentPrice.replace(/[^0-9.]/g, '');
  const price = parseFloat(priceStr) || 150;
  const data = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000 * 60 * 60 * 24);
    data.push({
      time: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price * (0.98 + Math.random() * 0.04),
    });
  }
  return data;
}
