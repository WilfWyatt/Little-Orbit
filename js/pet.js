/* Little Orbit: core pet model */
(() => {
  const clamp = n => Math.max(0, Math.min(100, Math.round(n)));
  const defaultPet = name => ({
    version: 1, name: name || "Pip", createdAt: Date.now(), lastSeen: Date.now(),
    ageHours: 0, stage: "baby", evolvedForm: null, evolutionChecked: false,
    needs: { hunger: 78, energy: 82, happiness: 78, cleanliness: 88, health: 100 },
    traits: { curiosity: 25, sociability: 25, calmness: 25, energy: 25, independence: 25 },
    actions: { feed: 0, play: 0, clean: 0, rest: 0, cuddle: 0, explore: 0 },
    journal: [{ at: Date.now(), text: "A tiny hatchling arrived in your orbit. Your story begins." }],
    mood: "Hello, star friend!"
  });
  const labels = {
    hunger: {label:"Hunger", icon:"✿"}, energy:{label:"Energy",icon:"☾"},
    happiness:{label:"Happiness",icon:"♡"}, cleanliness:{label:"Cleanliness",icon:"☼"},
    health:{label:"Health",icon:"✚"}
  };
  window.PetModel = { clamp, defaultPet, labels };
})();