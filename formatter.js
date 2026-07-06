export default function formatResult(raw) {

  const aiScore =
    raw?.type?.ai_generated ?? 0;


  return {

    aiPercentage: Math.round(aiScore * 100),

    isAI: aiScore >= 0.7,


    trustScore: Math.round((1 - aiScore) * 100),


    detections: {
      nudity: raw?.nudity?.safe ?? null,
      offensive: raw?.offensive?.prob ?? null,
      weapon: raw?.weapon?.prob ?? null,
    },

    raw
  };
}
