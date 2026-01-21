
import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeStock(ticker: string): Promise<StockAnalysis> {
  const model = "gemini-3-pro-preview";
  
  const prompt = `Perform a comprehensive analysis for the stock ticker: ${ticker.toUpperCase()}. 
  1. Technicals: Search for recent price, RSI, MACD, 50/200 SMA, Volume, and Short Interest.
  2. News Sentiment: Search for the most recent news articles and headlines (past 7 days).
     - Categorize overall sentiment (Positive/Negative/Neutral).
     - Assign a sentiment score from 0 (very bearish) to 100 (very bullish).
     - Identify top 3-4 news headlines, THEIR PUBLICATION DATES, and their likely impact on price.
     - Provide a short-term outlook based on this sentiment.
  
  Return the analysis in a detailed structured format. Use Google Search grounding for real-time news and up-to-date data.`;

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
    contents: `Parse the following stock and news analysis text into a strict JSON object.
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
        "rsi": "string",
        "macd": "string",
        "movingAverages": "string",
        "volumeProfile": "string",
        "shortInterest": "string"
      },
      "momentum": {
        "trend": "Bullish | Bearish | Neutral",
        "strength": "string",
        "description": "string"
      },
      "sentiment": {
        "score": number,
        "label": "Positive | Negative | Neutral",
        "headlines": [{"title": "string", "source": "string", "date": "string", "impact": "High | Medium | Low"}],
        "shortTermOutlook": "string"
      },
      "strategy": {
        "entryPoint": "string",
        "takeProfit": "string",
        "stopLoss": "string",
        "downsideExit": "string",
        "rationale": "string"
      }
    }`,
    config: {
      responseMimeType: "application/json",
    }
  });

  const analysisJson = JSON.parse(structuredResponse.text);
  return {
    ...analysisJson,
    sources: sources,
  };
}

export function generateMockChartData(currentPrice: string): { time: string; price: number }[] {
  const priceStr = currentPrice.replace(/[^0-9.]/g, '');
  const price = parseFloat(priceStr) || 150;
  const data = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000 * 60 * 60 * 24);
    data.push({
      time: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price * (0.95 + Math.random() * 0.1),
    });
  }
  return data;
}
