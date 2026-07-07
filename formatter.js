// formatter.js
export default function formatResult(raw) {
  // Angalia kama data kutoka Sightengine zipo na zina muundo sahihi
  // Sightengine inarudisha: { type: { ai: 0.94 } } mfano wa picha ya AI
  const aiProbability = raw?.type?.ai !== undefined ? raw.type.ai : 0;

  // Sightengine inatoa namba kati ya 0 na 1 (e.g. 0.94). 
  // Lazima tuzidishe kwa 100 ili kupata asilimia halisi (e.g. 94%)
  const aiPercentage = Math.round(aiProbability * 100);

  return {
    aiPercentage: aiPercentage,
    isAi: aiPercentage >= 70, // Kama ni zaidi ya 70% tunasema ni AI
    rawType: raw?.type || {}
  };
}

