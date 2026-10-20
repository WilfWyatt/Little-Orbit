from pathlib import Path
p=Path('/mnt/data/lo_work')
assets=p/'assets'; assets.mkdir(exist_ok=True)
# create bespoke flower art: sprout, growing, bloom for four species
species={
'moonflower':('#7ce8d0','#b9fff0','#ffd995','#b7a7ff','round moon petals'),
'chorus':('#73d8c4','#b0f8e9','#ffb9e7','#b5a4ff','singing bell blooms'),
'starmoss':('#9bd6ad','#d9f5ad','#8be7ff','#83bba8','starry moss'),
'orchid':('#65d8e8','#a9fff2','#ff9fd7','#c1a3ff','spiral orchid'),
}
for name,(stem,leaf,petal,inner,desc) in species.items():
    # sprout
    spr=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><defs><linearGradient id="s" x2="1" y2="1"><stop stop-color="{leaf}"/><stop offset="1" stop-color="{stem}"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3"/></filter></defs><ellipse cx="50" cy="108" rx="24" ry="5" fill="#071626" opacity=".28"/><path d="M50 106 Q48 82 52 62" fill="none" stroke="{stem}" stroke-width="7" stroke-linecap="round"/><path d="M50 91 Q20 93 23 70 Q43 69 50 91Z" fill="url(#s)" stroke="#b5ffeb" stroke-opacity=".7" stroke-width="2"/><path d="M51 78 Q79 79 79 54 Q57 55 51 78Z" fill="url(#s)" stroke="#b5ffeb" stroke-opacity=".7" stroke-width="2"/><path d="M51 65 Q36 48 51 36 Q67 48 51 65Z" fill="{petal}" stroke="#fff4d5" stroke-width="2"/><circle cx="51" cy="48" r="8" fill="{inner}" opacity=".55" filter="url(#g)"/></svg>'''
    (assets/f'flower-{name}-sprout.svg').write_text(spr)
    growing=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150"><defs><linearGradient id="s" x2="1" y2="1"><stop stop-color="{leaf}"/><stop offset="1" stop-color="{stem}"/></linearGradient><radialGradient id="p"><stop stop-color="#fff7d2"/><stop offset="1" stop-color="{petal}"/></radialGradient></defs><ellipse cx="60" cy="138" rx="28" ry="6" fill="#071626" opacity=".3"/><path d="M60 136 Q57 101 61 65" fill="none" stroke="{stem}" stroke-width="8" stroke-linecap="round"/><path d="M59 113 Q21 119 22 87 Q47 85 59 113Z" fill="url(#s)" stroke="#c9fff0" stroke-opacity=".65" stroke-width="2"/><path d="M60 99 Q98 103 99 69 Q73 71 60 99Z" fill="url(#s)" stroke="#c9fff0" stroke-opacity=".65" stroke-width="2"/><path d="M60 70 Q30 55 40 31 Q57 32 60 70Z" fill="{petal}" stroke="#fff4d5" stroke-width="2"/><path d="M61 70 Q85 48 79 28 Q61 35 61 70Z" fill="{inner}" stroke="#fff4d5" stroke-width="2"/><path d="M60 70 Q45 35 60 17 Q75 36 60 70Z" fill="url(#p)" stroke="#fff4d5" stroke-width="2"/><circle cx="60" cy="42" r="8" fill="#fff0a6"/><g fill="#dffdf5"><circle cx="25" cy="42" r="2"/><circle cx="94" cy="48" r="2"/><circle cx="87" cy="18" r="1.5"/></g></svg>'''
    (assets/f'flower-{name}-growing.svg').write_text(growing)
    if name=='moonflower':
        petals=''.join(f'<ellipse cx="60" cy="38" rx="12" ry="26" fill="{petal}" stroke="#fff3d5" stroke-width="2" transform="rotate({a} 60 63)"/>' for a in range(0,360,45))
    elif name=='chorus':
        petals=''.join(f'<path d="M60 67 Q{60+dx} {36+dy} {60+dx*1.15} {18+dy} Q{60+dx*1.6} 48 60 67Z" fill="{petal if i%2==0 else inner}" stroke="#fff0df" stroke-width="2"/>' for i,(dx,dy) in enumerate([(0,0),(-23,7),(23,7),(-35,22),(35,22)]))
    elif name=='starmoss':
        petals=''.join(f'<path d="M60 65 L{60+dx} {25+dy} L{60+dx*0.55} 64Z" fill="{petal if i%2==0 else inner}" stroke="#e8fff1" stroke-width="2"/>' for i,(dx,dy) in enumerate([(0,0),(-28,6),(28,6),(-18,27),(18,27)]))
    else:
        petals=''.join(f'<path d="M60 69 C{40+dx} {45+dy} {43+dx} {15+dy} {60+dx/2} {20+dy} C{82+dx} {34+dy} {78+dx} 53 60 69Z" fill="{petal if i%2==0 else inner}" stroke="#f9eaff" stroke-width="2"/>' for i,(dx,dy) in enumerate([(0,0),(-15,5),(15,5),(-28,18),(28,18)]))
    bloom=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150"><defs><linearGradient id="s" x2="1" y2="1"><stop stop-color="{leaf}"/><stop offset="1" stop-color="{stem}"/></linearGradient><radialGradient id="gl"><stop stop-color="{petal}" stop-opacity=".8"/><stop offset="1" stop-color="{petal}" stop-opacity="0"/></radialGradient></defs><ellipse cx="60" cy="138" rx="30" ry="6" fill="#071626" opacity=".3"/><circle cx="60" cy="50" r="42" fill="url(#gl)"/><path d="M60 135 Q58 100 60 65" fill="none" stroke="{stem}" stroke-width="8" stroke-linecap="round"/><path d="M59 112 Q19 119 23 84 Q48 84 59 112Z" fill="url(#s)" stroke="#c9fff0" stroke-opacity=".7" stroke-width="2"/><path d="M60 98 Q100 102 98 67 Q73 71 60 98Z" fill="url(#s)" stroke="#c9fff0" stroke-opacity=".7" stroke-width="2"/>{petals}<circle cx="60" cy="62" r="13" fill="#fff0a6" stroke="#fff9d9" stroke-width="3"/><circle cx="60" cy="62" r="5" fill="#fff"/><g fill="#e9fffd"><circle cx="23" cy="30" r="2.5"/><circle cx="95" cy="38" r="2"/><path d="M28 57l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/><path d="M93 13l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/></g></svg>'''
    (assets/f'flower-{name}-bloom.svg').write_text(bloom)
# six visually distinct alien stones
rocks=[('#4c7890','#8ce8dc','#243f64'),('#7763a7','#c8a9ff','#34325e'),('#4c8d82','#b4f4d9','#245653'),('#8d6689','#ffc5df','#493858'),('#8b8064','#f6dba1','#4e4d52'),('#3e6687','#83d8ff','#253a61'),('#687f9a','#c8d9e9','#3b4b68')]
for i,(base,hi,shadow) in enumerate(rocks):
    shapes=[f'<path d="M12 42 L19 19 43 7 68 13 87 30 82 52 61 66 30 62Z"',f'<path d="M8 42 L24 14 51 9 83 22 91 43 68 62 34 65 13 55Z"',f'<path d="M15 47 L11 29 32 8 61 11 84 25 89 46 63 63 32 61Z"'][i%3]
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 75"><defs><linearGradient id="r" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="{hi}"/><stop offset=".48" stop-color="{base}"/><stop offset="1" stop-color="{shadow}"/></linearGradient><radialGradient id="g"><stop stop-color="{hi}" stop-opacity=".7"/><stop offset="1" stop-color="{hi}" stop-opacity="0"/></radialGradient></defs><ellipse cx="51" cy="64" rx="35" ry="7" fill="#061326" opacity=".4"/>{shapes} fill="url(#r)" stroke="{hi}" stroke-opacity=".8" stroke-width="2"/><path d="M25 28 L42 15 61 19 47 29Z" fill="{hi}" opacity=".55"/><path d="M57 37 L73 31 79 42 64 53 53 50Z" fill="{shadow}" opacity=".8"/><circle cx="37" cy="39" r="13" fill="url(#g)"/><path d="M30 48l8-4 4 3" stroke="{hi}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="68" cy="25" r="2" fill="#fff" opacity=".8"/></svg>'''
    (assets/f'rock-{i+1}.svg').write_text(svg)
# butterfly with independent wings and wingbeat via CSS groups
(assets/'glow-butterfly.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 76"><defs><linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b8fff0"/><stop offset=".55" stop-color="#42d9d2"/><stop offset="1" stop-color="#8f8aff"/></linearGradient><filter id="gl"><feGaussianBlur stdDeviation="3"/></filter></defs><ellipse cx="50" cy="39" rx="30" ry="24" fill="#68fff0" opacity=".18" filter="url(#gl)"/><g class="wing wing-left"><path d="M48 37 C26 2 4 8 12 31 C17 44 31 47 48 42Z" fill="url(#w)" stroke="#d6fff7" stroke-width="2"/><path d="M46 42 C22 39 17 51 26 62 C35 68 43 54 48 45Z" fill="#68d9cb" stroke="#d6fff7" stroke-width="2"/><path d="M43 37L17 21M43 44L29 57" stroke="#f0fffd" stroke-opacity=".65" stroke-width="1.5"/></g><g class="wing wing-right"><path d="M52 37 C74 2 96 8 88 31 C83 44 69 47 52 42Z" fill="url(#w)" stroke="#d6fff7" stroke-width="2"/><path d="M54 42 C78 39 83 51 74 62 C65 68 57 54 52 45Z" fill="#a99aff" stroke="#e9ddff" stroke-width="2"/><path d="M57 37L83 21M57 44L71 57" stroke="#f0fffd" stroke-opacity=".65" stroke-width="1.5"/></g><ellipse cx="50" cy="42" rx="4" ry="14" fill="#ffe8a0" stroke="#fff7dc" stroke-width="1.5"/><circle cx="50" cy="28" r="5" fill="#ffe8a0"/><path d="M48 26Q39 12 35 18M52 26Q61 12 65 18" stroke="#ffe8a0" stroke-width="2" fill="none" stroke-linecap="round"/></svg>''')
# Replace garden rendering with deterministic procedural placements and interactive bloom lifecycle
app=p/'js/app.js'; s=app.read_text()
s=s.replace('  const plantArt = {"Moonflower":"plant-moonflower.svg","Chorus Bloom":"plant-chorus.svg","Star-moss":"plant-starmoss.svg","Orbit Orchid":"plant-orchid.svg"};', '''  const plantArt = {"Moonflower":"moonflower","Chorus Bloom":"chorus","Star-moss":"starmoss","Orbit Orchid":"orchid"};
  const rockCount = 7;
  function seeded(n){ const x=Math.sin((n+17)*127.1)*43758.5453; return x-Math.floor(x); }''')
start=s.index('  function renderHabitat(){')
end=s.index('  function setView(view)',start)
new='''  function renderHabitat(){
    ensureWorldData();
    if(!pet.plantBloomed) pet.plantBloomed={};
    const plants=$("habitat-plants"),decor=$("habitat-decor"),base=$("habitat-baseflora"),wildlife=$("habitat-wildlife");
    // Stable procedural garden: seeded placements avoid reshuffling whenever a button is tapped.
    const flora=[];
    for(let i=0;i<19;i++){
      const x=4+seeded(i+1)*92, bottom=25+Math.floor(seeded(i+43)*55), w=17+Math.floor(seeded(i+80)*25), h=23+Math.floor(seeded(i+120)*30), t=i%4;
      flora.push(`<span class="wild-flora flora-${t}" style="left:${x}%;bottom:${bottom}px;width:${w}px;height:${h}px;--sway:${3+Math.floor(seeded(i+8)*4)}s;animation-delay:-${Math.floor(seeded(i+12)*5)}s"><i></i><i></i><i></i><b></b></span>`);
    }
    const stones=[];
    for(let i=0;i<15;i++){
      const x=3+seeded(i+200)*93, bottom=12+Math.floor(seeded(i+240)*35), w=17+Math.floor(seeded(i+280)*32), r=1+Math.floor(seeded(i+320)*rockCount);
      stones.push(`<img class="garden-stone rock-${r}" src="assets/rock-${r}.svg" alt="" style="left:${x}%;bottom:${bottom}px;width:${w}px;z-index:${Math.round(bottom/8)}">`);
    }
    base.innerHTML=stones.join("")+flora.join("");
    plants.innerHTML=pet.planted.map((name,i)=>{
      const plantedAt=pet.plantGrowth[name]||Date.now();
      const progress=Math.min(100,Math.floor((Date.now()-plantedAt)/3600000*20));
      const id=plantArt[name]||"moonflower"; const bloomed=!!pet.plantBloomed[name];
      const stage=bloomed?"bloom":progress>=100?"ready":progress>=20?"growing":"sprout";
      const asset=stage==="ready"?`flower-${id}-growing.svg`: `flower-${id}-${stage==="bloom"?"bloom":stage}.svg`;
      const x=[16,37,62,82,27,73][i%6], bottom=44+(i%3)*7;
      const label=bloomed?"In bloom":stage==="ready"?"Tap to bloom":stage==="growing"?"Growing":"Sprout";
      return `<button class="habitat-plant plant-${i%4} stage-${stage}" data-bloom="${escapeHtml(name)}" ${stage!=="ready"?"disabled":""} style="left:${x}%;bottom:${bottom}px" title="${escapeHtml(name)} · ${label}" aria-label="${escapeHtml(name)}: ${label}"><img src="assets/${asset}" alt=""><small>${label}</small>${stage==="ready"?'<span class="ready-sparkles" aria-hidden="true">✦ ✧ ✦</span>':""}</button>`;
    }).join("");
    plants.querySelectorAll('[data-bloom]').forEach(b=>b.addEventListener('click',()=>bloomPlant(b.dataset.bloom)));
    decor.innerHTML=pet.decorations.map((symbol,i)=>{const x=[27,53,70,42,86][i%5];return `<span class="habitat-decoration decor-${i%4}" style="left:${x}%;bottom:${52+(i%3)*7}px">${symbol}</span>`}).join("");
    const hasButterfly=!!(pet.collection&&pet.collection.glowmoth);
    wildlife.innerHTML=hasButterfly?'<img class="garden-butterfly" src="assets/glow-butterfly.svg" alt="Your glow-moth fluttering around the garden" title="Glow-moth">':'';
    $("planted-count").textContent=pet.planted.length;$("decor-count").textContent=pet.decorations.length;$("habitat-days").textContent=`Day ${Math.max(1,Math.floor(pet.ageHours/24)+1)}`;
    $("habitat-status").textContent=pet.planted.some(n=>pet.plantBloomed[n])?"A tiny alien garden in bloom":pet.planted.length?"Little buds are growing":"A world to make your own";
    const owned=discoveryCatalogue.filter(d=>(pet.collection[d.id]||0)>0 && (d.kind==='seed'||d.kind==='decor'));
    $("habitat-inventory-list").innerHTML=owned.length?owned.map(d=>{const planted=d.plant&&pet.planted.includes(d.plant);const placed=d.decor&&pet.decorations.filter(x=>x===d.decor).length;return `<article class="inventory-item"><span class="inventory-icon">${d.icon}</span><div><strong>${d.name}</strong><small>${d.plant?(planted?(pet.plantBloomed[d.plant]?'Blooming beautifully':'Already planted'):'Can be planted'):d.decor?(placed?'Decoration unlocked':'Habitat keepsake'):'Keepsake'}</small></div>${d.plant?`<button class="mini-button" data-plant="${d.id}" ${planted?'disabled':''}>${planted?'Planted':'Plant'}</button>`:d.decor?`<button class="mini-button" data-decor="${d.id}">Place</button>`:''}</article>`}).join(''):'<p class="empty-inventory">Your first seed or keepsake is out there waiting. Try an expedition!</p>';
    $("habitat-inventory-list").querySelectorAll('[data-plant]').forEach(b=>b.addEventListener('click',()=>plantDiscovery(b.dataset.plant)));
    $("habitat-inventory-list").querySelectorAll('[data-decor]').forEach(b=>b.addEventListener('click',()=>placeDecoration(b.dataset.decor)));
  }
  function bloomPlant(name){
    if(!pet.planted.includes(name)||!pet.plantGrowth[name]||((Date.now()-pet.plantGrowth[name])/3600000)<5||pet.plantBloomed[name]) return;
    pet.plantBloomed[name]=true; note(`${name} opened its petals in a shower of stardust.`); render(); toast(`${name} bloomed! ✨`);
  }
'''
s=s[:start]+new+s[end:]
# add world data
s=s.replace('    if(!pet.plantGrowth) pet.plantGrowth={};','    if(!pet.plantGrowth) pet.plantGrowth={};\n    if(!pet.plantBloomed) pet.plantBloomed={};')
# plant function unchanged, save migration is handled by render
app.write_text(s)
# append CSS
css=p/'styles.css'; c=css.read_text()
c += '''\n/* v0.6: procedural alien rock garden, bespoke flower lifecycle and true wingbeats */
.habitat-plants{pointer-events:none}
.habitat-plant{pointer-events:auto;position:absolute;display:flex;flex-direction:column;align-items:center;gap:1px;padding:0;border:0;background:transparent;color:inherit;cursor:default;transform-origin:bottom center;filter:drop-shadow(0 0 8px #8ef0d133);animation:plantSway 4s ease-in-out infinite}
.habitat-plant:disabled{opacity:1}.habitat-plant[data-bloom]:not(:disabled){cursor:pointer;animation:plantSway 2.7s ease-in-out infinite,bloomReadyPulse 1.5s ease-in-out infinite}
.habitat-plant img{width:44px;height:57px;object-fit:contain;filter:drop-shadow(0 0 8px #8ef0d155)}
.habitat-plant small{font-size:8px;color:#d7f7e9;background:#152b3ddd;padding:3px 6px;border-radius:8px;white-space:nowrap}
.habitat-plant.stage-sprout img{width:34px;height:42px}.habitat-plant.stage-growing img{width:40px;height:51px}.habitat-plant.stage-bloom img{width:52px;height:65px;filter:drop-shadow(0 0 12px #a8f3d988)}
.ready-sparkles{position:absolute;top:-8px;left:50%;width:82px;transform:translateX(-50%);font-size:12px;letter-spacing:5px;color:#fff0a8;text-shadow:0 0 8px #fff0a8;animation:sparkleReady .9s ease-in-out infinite alternate;pointer-events:none}
.garden-stone{position:absolute;height:auto;opacity:.98;filter:drop-shadow(0 4px 4px #07122299)}
.rock-2{filter:hue-rotate(18deg) drop-shadow(0 4px 4px #07122299)}.rock-3{filter:hue-rotate(55deg) drop-shadow(0 4px 4px #07122299)}.rock-4{filter:hue-rotate(100deg) drop-shadow(0 4px 4px #07122299)}.rock-5{filter:hue-rotate(160deg) drop-shadow(0 4px 4px #07122299)}.rock-6{filter:hue-rotate(220deg) drop-shadow(0 4px 4px #07122299)}.rock-7{filter:hue-rotate(280deg) drop-shadow(0 4px 4px #07122299)}
.wild-flora b{position:absolute;left:34%;bottom:48%;width:35%;height:26%;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 40% 30%,#fff1bd,#ffbdcf 50%,#bba4ff);box-shadow:0 0 8px #ffd6f488;transform:rotate(-12deg)}
.flora-1 b{background:radial-gradient(circle at 40% 30%,#fff1bd,#7ee6df 55%,#8f8aff)}.flora-2 b{background:radial-gradient(circle at 40% 30%,#faffd3,#c1a3ff 55%,#7ee6df)}.flora-3 b{background:radial-gradient(circle at 40% 30%,#fff1bd,#ffb5df 55%,#8b8aff)}
.garden-butterfly{width:46px;height:38px;transform-origin:center;animation:butterflyWander 17s ease-in-out infinite}
.garden-butterfly .wing{transform-box:fill-box;transform-origin:center;animation:wingBeat .22s ease-in-out infinite alternate}
.garden-butterfly .wing-left{transform-origin:100% 55%}.garden-butterfly .wing-right{transform-origin:0% 55%}
@keyframes wingBeat{from{transform:scaleX(1) scaleY(1)}to{transform:scaleX(.2) scaleY(.86)}}
@keyframes bloomReadyPulse{0%,100%{filter:drop-shadow(0 0 5px #fff0a855)}50%{filter:drop-shadow(0 0 15px #fff0aadd)}}
@keyframes sparkleReady{from{opacity:.35;transform:translateX(-50%) scale(.85) rotate(-8deg)}to{opacity:1;transform:translateX(-50%) scale(1.12) rotate(8deg)}}
@media(prefers-reduced-motion:reduce){.garden-butterfly .wing,.ready-sparkles,.habitat-plant{animation:none!important}}
'''
css.write_text(c)
# bump SW cache and precache assets
sw=p/'sw.js'; t=sw.read_text().replace('little-orbit-v5-1-living-garden','little-orbit-v6-alien-bloom-garden')
# add new assets to CORE before ];
assetslist=[]
for name in species:
    for stage in ('sprout','growing','bloom'): assetslist.append(f'"./assets/flower-{name}-{stage}.svg"')
assetslist += [f'"./assets/rock-{i}.svg"' for i in range(1,8)]
t=t.replace('"./assets/glow-butterfly.svg"]','"./assets/glow-butterfly.svg",'+','.join(assetslist)+']')
sw.write_text(t)
