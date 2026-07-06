export default function formatResult(raw) {

  const aiScore =
    raw?.type?.ai_generated ||
    raw?.ai_generated ||
    0;


  const humanScore = 100 - aiScore;


  let riskLevel = "Low";

  if(aiScore >= 70){
    riskLevel = "High";
  }
  else if(aiScore >= 30){
    riskLevel = "Medium";
  }


  return {

    aiPercentage: Math.round(aiScore),

    humanPercentage: Math.round(humanScore),

    trustScore: Math.round(humanScore),

    riskLevel,

    recommendation:
      aiScore >= 70 ? "Block" :
      aiScore >= 30 ? "Review" :
      "Safe",

    raw

  };
}
