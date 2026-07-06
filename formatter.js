export default function formatResult(raw) {

  console.log("FORMATTER INPUT:", JSON.stringify(raw, null, 2));

  const aiScore =
    raw?.type?.ai_generated ??
    raw?.genai?.ai_generated ??
    raw?.genai?.score ??
    null;


  return {
    aiPercentage: aiScore !== null 
      ? Math.round(aiScore * 100)
      : null,

    isAI: aiScore !== null ? aiScore >= 0.7 : null,

    raw
  };
}
