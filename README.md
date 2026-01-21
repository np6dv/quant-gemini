
# 📈 QuantGemini - Advanced Stock Analysis

QuantGemini is a high-performance market intelligence platform powered by Google's Gemini 3 models. It provides institutional-grade technical analysis, real-time sentiment tracking, and strategic trade signals using Google Search grounding.

## ✨ Features

- **Real-time Search Grounding**: Fetches up-to-the-minute stock prices and news headlines.
- **Technical Deep Dive**: Analysis of RSI, MACD, Volume Profile, and Moving Averages.
- **Sentiment Engine**: Categorizes recent news as Positive, Negative, or Neutral with an AI-calculated score.
- **Alpha Strategy**: Provides specific entry points, take-profit targets, and stop-loss levels.
- **Mobile Responsive**: Designed with Tailwind CSS for high performance on all devices.

## 🚀 Getting Started

### Prerequisites

- A [Google Gemini API Key](https://aistudio.google.com/app/apikey).
- A local web server (like Live Server in VS Code) or a hosting provider.

### Environment Setup

Create a `.env` file in the root directory (or set this in your hosting provider's settings):

```env
API_KEY=your_gemini_api_key_here
```

### Local Development

Since this project uses modern ESM (ECMAScript Modules) and `esm.sh`, you don't need a complex build step. Simply serve the `index.html` using any local server.

If you have Node.js installed, you can use `npx`:
```bash
npx serve .
```

## 🛠️ Built With

- **React 19**
- **Google Gemini API** (@google/genai)
- **Tailwind CSS**
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)

---
*Disclaimer: This tool is for educational purposes only. Trading involves risk. Perform your own due diligence.*
