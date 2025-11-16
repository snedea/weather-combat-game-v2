/**
 * Educational Content
 * Explanations of weather-to-stat conversions
 */

export const statExplanations = {
  hp: {
    title: "Hit Points (HP)",
    description: "Represents the city's resilience based on temperature. Warmer climates provide more energy and vitality.",
    formula: "HP = 100 + (temperature × 2), max 200",
    weatherMetrics: ["Temperature"],
  },
  attack: {
    title: "Attack Power",
    description: "Derived from wind speed and atmospheric pressure. Stronger winds and pressure systems create more forceful attacks.",
    formula: "Attack = (windSpeed × 5) + (pressure ÷ 10)",
    weatherMetrics: ["Wind Speed", "Atmospheric Pressure"],
  },
  defense: {
    title: "Defense",
    description: "Combined humidity and cloud cover create a protective atmospheric shield.",
    formula: "Defense = humidity + clouds",
    weatherMetrics: ["Humidity", "Cloud Cover"],
  },
  magic: {
    title: "Magic Power",
    description: "Based on weather condition severity. More extreme weather = higher magical energy.",
    formula: "Magic varies by condition: Clear=10, Rain=30, Snow=40, Thunderstorm=50",
    weatherMetrics: ["Weather Condition"],
  },
  speed: {
    title: "Speed",
    description: "Determined by visibility. Clear conditions allow for faster reactions and movement.",
    formula: "Speed = visibility ÷ 100",
    weatherMetrics: ["Visibility"],
  },
  critChance: {
    title: "Critical Hit Chance",
    description: "Weather variability increases unpredictability. More severe conditions = higher crit chance.",
    formula: "Crit Chance = 10-20% based on weather severity",
    weatherMetrics: ["Weather Condition Severity"],
  },
};

export const battleMechanics = {
  elementalAdvantages: {
    title: "Elemental Type Advantages",
    description: "Certain weather elements are stronger against others, dealing 1.5× damage.",
    advantages: [
      "Fire > Ice, Wind",
      "Ice > Water, Wind",
      "Water > Fire",
      "Lightning > Water, Wind",
      "Shadow is neutral (no advantages)",
    ],
  },
  actions: {
    attack: {
      name: "Attack",
      description: "Standard attack with 1.0× damage multiplier",
    },
    heavy_attack: {
      name: "Heavy Attack",
      description: "Powerful attack with 1.5× damage multiplier",
    },
    defend: {
      name: "Defend",
      description: "Defensive stance reduces incoming damage by 50%",
    },
  },
  criticalHits: {
    title: "Critical Hits",
    description: "A critical hit deals 2× damage and is determined by the attacker's crit chance percentage.",
  },
};
