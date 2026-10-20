/* Little Orbit interface and actions */
(() => {
  const $ = id => document.getElementById(id);
  let pet = PetSave.load();
  let toastTimer;
  const traitNames = {curiosity:"Curiosity",sociability:"Sociability",calmness:"Calmness",energy:"Energy",independence:"Independence"};
  const messages = {
    feed:["Mmm! Cosmic fruit is delicious.","A very satisfied little burble.","That hit the spot!"],
    play:["Wiggle wiggle!","Best game in the galaxy!","A happy little bounce."],
    clean:["Fresh as a moonbeam.","A tidy habitat feels lovely.","Sparkly!"],
    rest:["A peaceful little snooze.","Recharging tiny stardust batteries.","Sleep well, little star."],
    cuddle:["A warm little glow answers you.","Your bond grows a little stronger.","A happy chirrup just for you."],
    explore:["You found a glittering pebble!","A new smell. Fascinating.","A tiny mystery for the journal."]
  };
  function say(message) { pet.mood = message; $("pet-mood").textContent = message; }
  let reactionTimer;
  function react(action) {
    const art = $("pet-art"), reaction = $("pet-reaction");
    const styles = { feed: ["react-bounce", "✦"], play: ["react-wiggle", "✨"], clean: ["react-bounce", "✧"], rest: ["react-snooze", "Z z"], cuddle: ["react-bounce", "♡"], explore: ["react-wiggle", "❇"] };
    const [animation, symbol] = styles[action] || styles.cuddle;
    art.classList.remove("react-bounce", "react-wiggle", "react-snooze", "evolved-pop");
    reaction.classList.remove("pop");
    void art.offsetWidth;
    art.classList.add(animation);
    reaction.textContent = symbol;
    void reaction.offsetWidth;
    reaction.classList.add("pop");
    clearTimeout(reactionTimer);
    reactionTimer = setTimeout(() => {
      art.classList.remove("react-bounce", "react-wiggle", "react-snooze");
      reaction.classList.remove("pop");
    }, 1100);
  }
  function toast(message) {
    const el=$("toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
  }
  function note(text) {
    pet.journal.unshift({at:Date.now(),text});
    pet.journal = pet.journal.slice(0,8);
  }
  function setNeed(key, delta) { pet.needs[key] = PetModel.clamp(pet.needs[key] + delta); }
  function adjustTrait(key, delta) { pet.traits[key] = PetModel.clamp(pet.traits[key] + delta); }
  function artForPet() {
    if (pet.evolvedForm) return PetEvolution.forms[pet.evolvedForm].art;
    return pet.stage === "juvenile" ? "assets/juvenile.svg" : "assets/hatchling.svg";
  }
  function render() {
    $("pet-name").textContent=pet.name;
    $("pet-art").src=artForPet();
    $("pet-art").alt=`${pet.name}, your ${pet.stage === "adult" ? PetEvolution.forms[pet.evolvedForm].name : pet.stage + " alien"}`;
    $("stage-label").textContent=`${pet.stage.toUpperCase()} · DAY ${Math.max(1,Math.floor(pet.ageHours/24)+1)}`;
    const form=PetEvolution.current(pet);
    $("pet-description").textContent=form ? form.description : pet.stage==="juvenile" ? "Growing braver, brighter and more themselves every day." : "A curious little life from somewhere far away.";
    const growth=Math.min(100,Math.round((pet.ageHours/72)*100));
    $("growth-fill").style.width=`${growth}%`; $("growth-label").textContent=`${growth}%`;
    const needGrid=$("needs-grid");
    needGrid.innerHTML=Object.entries(PetModel.labels).map(([key,meta])=>{
      const v=pet.needs[key], state=v<30?"low":v<60?"mid":"good";
      return `<div class="need-card"><div class="need-top"><span class="need-emoji">${meta.icon}</span><span>${meta.label}</span><span class="need-value">${v}%</span></div><div class="need-track"><div class="need-fill ${state}" style="width:${v}%"></div></div></div>`;
    }).join("");
    $("status-chip").textContent=pet.needs.health<60?"Needs gentle care":Math.min(pet.needs.hunger,pet.needs.energy,pet.needs.happiness)<35?"Could use some love":"Doing okay";
    $("traits-list").innerHTML=Object.entries(pet.traits).map(([key,v])=>`<div class="trait-row"><span class="trait-name">${traitNames[key]}</span><div class="trait-track"><div class="trait-fill" style="width:${v}%"></div></div><span class="trait-number">${v}</span></div>`).join("");
    $("journal-count").textContent=`${pet.journal.length} ${pet.journal.length===1?"note":"notes"}`;
    $("journal-list").innerHTML=pet.journal.length?pet.journal.slice(0,5).map(j=>`<li><span class="journal-dot">✦</span><span>${escapeHtml(j.text)}</span></li>`).join(""):'<li class="empty-journal">Your story is just beginning.</li>';
    PetSave.save(pet);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function doAction(action) {
    if (!pet) return;
    const changes = {
      feed:()=>{setNeed("hunger",28);setNeed("happiness",4);adjustTrait("calmness",1);},
      play:()=>{setNeed("happiness",23);setNeed("energy",-13);setNeed("hunger",-5);adjustTrait("energy",5);adjustTrait("sociability",2);},
      clean:()=>{setNeed("cleanliness",35);setNeed("happiness",3);adjustTrait("calmness",2);},
      rest:()=>{setNeed("energy",28);setNeed("happiness",3);adjustTrait("calmness",4);},
      cuddle:()=>{setNeed("happiness",16);adjustTrait("sociability",5);adjustTrait("calmness",1);},
      explore:()=>{setNeed("energy",-8);setNeed("hunger",-4);setNeed("happiness",12);adjustTrait("curiosity",6);adjustTrait("independence",2);const discoveries=["a glittering pebble","a tiny moonflower","a strange musical shell","a speck of meteor glass"];const found=discoveries[Math.floor(Math.random()*discoveries.length)];note(`${pet.name} discovered ${found}.`);}
    };
    changes[action]?.();
    pet.actions[action]=(pet.actions[action]||0)+1;
    pet.lastSeen=Date.now();
    say(messages[action][Math.floor(Math.random()*messages[action].length)]);
    react(action);
    if (action!=="explore") note(`${pet.name} spent a little time with you: ${action}.`);
    const result=PetEvolution.updateStage(pet);
    render();
    if(result.evolved) {
      $("pet-art").classList.remove("evolved-pop"); void $("pet-art").offsetWidth; $("pet-art").classList.add("evolved-pop");
      say(`${pet.name} evolved into ${result.form.name}!`); render();
      toast(`A new form! ${result.form.name} ✨`);
    } else toast(messages[action][Math.floor(Math.random()*messages[action].length)]);
  }
  function start(name) {
    pet=PetModel.defaultPet((name||"Pip").trim().slice(0,18)||"Pip");
    PetSave.save(pet); $("welcome-dialog").close(); render(); toast(`${pet.name} has arrived!`);
  }
  document.querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>doAction(btn.dataset.action)));
  $("welcome-form").addEventListener("submit",e=>{e.preventDefault();start($("new-name").value);});
  $("rename-button").addEventListener("click",()=>{
    const name=prompt("What shall we call your alien?",pet.name);
    if(name && name.trim()){pet.name=name.trim().slice(0,18);note(`You chose the name ${pet.name}.`);say("I like the sound of that!");render();toast("Name updated.");}
  });
  $("export-button").addEventListener("click",()=>{PetSave.exportSave(pet);toast("Save exported.");});
  $("sound-toggle").addEventListener("click",()=>toast("Sound effects are coming in a later update."));
  // Update age and needs in small intervals while the page is open.
  if (pet) {
    const result=PetTime.advance(pet);
    const evolution=PetEvolution.updateStage(pet);
    if(result.hours>=1) note(`Welcome back! ${pet.name} spent ${Math.floor(result.hours)} hour${Math.floor(result.hours)===1?"":"s"} in their little world.`);
    render();
    if(evolution.evolved){render();toast(`${pet.name} evolved into ${evolution.form.name}!`);}
  } else {
    pet=PetModel.defaultPet("Pip");
    $("welcome-dialog").showModal();
  }
  setInterval(()=>{
    if(!pet)return;
    const before=pet.stage;
    PetTime.advance(pet,Date.now());
    const result=PetEvolution.updateStage(pet);
    render();
    if(result.evolved)toast(`${pet.name} evolved into ${result.form.name}!`);
  },60000);
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"&&pet){PetTime.advance(pet);const result=PetEvolution.updateStage(pet);render();if(result.evolved)toast(`${pet.name} evolved into ${result.form.name}!`);}
    else if(pet){pet.lastSeen=Date.now();PetSave.save(pet);}
  });
  window.addEventListener("pagehide",()=>{if(pet){pet.lastSeen=Date.now();PetSave.save(pet);}});
  // Allow importing a backup through a long press on Export Save.
  $("export-button").addEventListener("contextmenu",e=>{e.preventDefault();$("import-save").click();});
  $("import-save").addEventListener("change",async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{pet=await PetSave.importSave(file);pet.lastSeen=Date.now();PetSave.save(pet);render();toast("Your little friend is back!");}
    catch(err){toast(err.message||"Could not import save.");}
    e.target.value="";
  });
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();