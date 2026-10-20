/* Real-time needs and forgiving offline progression */
(() => {
  // Slightly livelier needs: noticeable over a few hours, still gentle overnight.
  const PER_HOUR = { hunger: 5.0, energy: 3.5, happiness: 2.0, cleanliness: 1.8, health: 0.35 };
  function advance(pet, now = Date.now()) {
    const elapsed = Math.max(0, Math.min(24 * 60 * 60 * 1000, now - (pet.lastSeen || now)));
    const hours = elapsed / 3600000;
    pet.ageHours = (pet.ageHours || 0) + hours;
    for (const [key, rate] of Object.entries(PER_HOUR)) {
      if (key === "health") {
        const averageCare = (pet.needs.hunger + pet.needs.energy + pet.needs.cleanliness) / 3;
        if (averageCare < 22) pet.needs.health -= rate * hours;
        else pet.needs.health += 0.12 * hours;
      } else pet.needs[key] -= rate * hours;
      pet.needs[key] = PetModel.clamp(pet.needs[key]);
    }
    // Forgiving floor: time away alone never causes a critical health spiral.
    pet.needs.health = Math.max(35, pet.needs.health);
    pet.lastSeen = now;
    return {hours, elapsed};
  }
  window.PetTime = { advance };
})();