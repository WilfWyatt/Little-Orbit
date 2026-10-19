/* Local save, migration guard, export and import */
(() => {
  const KEY = "littleOrbit.save.v1";
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const pet = JSON.parse(raw);
      if (!pet || pet.version !== 1 || !pet.needs || !pet.traits) return null;
      return pet;
    } catch (e) { console.warn("Save could not be read", e); return null; }
  }
  function save(pet) {
    try { localStorage.setItem(KEY, JSON.stringify(pet)); return true; }
    catch (e) { console.warn("Save could not be written", e); return false; }
  }
  function exportSave(pet) {
    const blob = new Blob([JSON.stringify({app:"Little Orbit",version:1,pet},null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "little-orbit-save.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function importSave(file) {
    return file.text().then(text => {
      const data = JSON.parse(text); const pet = data.pet || data;
      if (!pet || pet.version !== 1 || !pet.needs || !pet.traits || !pet.name) throw new Error("That doesn't look like a Little Orbit save.");
      return pet;
    });
  }
  window.PetSave = {load, save, exportSave, importSave};
})();