/* Deterministic growth and branching evolution */
(() => {
  const forms = {
    seeker: {name:"The Seeker", art:"assets/seeker.svg", description:"Bright-eyed and endlessly curious, The Seeker wants to know everything."},
    wisp: {name:"The Wisp", art:"assets/wisp.svg", description:"Gentle and connected, The Wisp glows brightest when you're near."},
    spark: {name:"The Spark", art:"assets/spark.svg", description:"Bouncy and bold, The Spark turns every day into an adventure."}
  };
  function updateStage(pet) {
    const hours = pet.ageHours || 0;
    if (hours >= 72 && pet.stage !== "adult") {
      pet.stage = "adult";
      const t = pet.traits;
      let form = "seeker";
      if (t.sociability + t.calmness > t.curiosity + t.energy && t.sociability >= t.independence) form = "wisp";
      else if (t.energy + t.independence > t.curiosity + t.calmness) form = "spark";
      pet.evolvedForm = form;
      pet.evolutionChecked = true;
      pet.journal.unshift({at:Date.now(),text:`Evolution discovered! ${pet.name} became ${forms[form].name}.`});
      pet.mood = "Something wonderful is happening!";
      return {evolved:true, form:forms[form]};
    }
    pet.stage = hours >= 24 ? "juvenile" : "baby";
    return {evolved:false, form:pet.evolvedForm ? forms[pet.evolvedForm] : null};
  }
  function current(pet) { return pet.evolvedForm ? forms[pet.evolvedForm] : null; }
  window.PetEvolution = { updateStage, current, forms };
})();