let L=localStorage.lang||"he",tab=0,pos=null;const $=s=>document.querySelector(s);
const dirUrl=(a,b)=>`https://www.google.com/maps/dir/?api=1&destination=${a},${b}&travelmode=walking`;
function hav(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,x=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
function hotelCard(t){return `<div class="card hotel"><div class="ph">🏨</div><div class="b"><div class="sub">${t.hotel}</div><h2>Domus Real Cardello</h2>
<div style="direction:ltr;text-align:start">Via del Cardello, 14/B, 00184 Roma</div>
<div>${t.conf}: <span class="code">${HOTEL.conf}</span> ${t.pin}: <span class="code">${HOTEL.pin}</span></div><div class="small">${t.checkin}</div>
${navBtns()}
<button class="btn alt" onclick="showTaxi()">🚕 ${t.showTaxi}</button>
<a class="btn alt" href="tel:+39064881663">📞 ${t.call} <bdi dir="ltr">${HOTEL.phone}</bdi></a></div></div>`}
function placeCard(p,extra=""){const d=p[L];return `<div class="card" onclick="openP('${p.id}')"><img src="img/${p.id}.jpg" alt="" loading="lazy"><div class="b">${extra}<h2>${d.n}</h2></div></div>`}
function render(){sosBtn();const t=T[L];document.documentElement.dir=t.dir;document.documentElement.lang=L;$("#title").textContent=t.title;$("#lang").textContent=t.lang;
$("#tabs").innerHTML=t.tabs.map((n,i)=>`<button class="${i==tab?'on':''}" onclick="tab=${i};render();scrollTo(0,0)">${["🏛️","📍","🗓️","📄","🛂"][i]}<br>${n}</button>`).join("");
let h="";if(tab==0){h=homeNav()+wxMini()+hotelCard(t)+P.map(p=>placeCard(p)).join("")+`<p class="small"><a href="#" onclick="credits();return false">${t.credits}</a></p>`}
else if(tab==1){h=`<button class="btn" onclick="locate()">📍 ${t.near}</button><p class="small">${t.nearNote}</p><div id="near"></div>`}
else if(tab==2){h=t.days.map(([d,it])=>`<div class="day"><h2>${d}</h2><ul>${it.map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("")}
else if(tab==4){h=ppView()}
else{h=hotelCard(t)+`<div class="box">${DOCS[L]}</div>`}
$("#main").innerHTML=h;if(tab==1&&pos)showNear();if(tab==4)ppLoad()}
function sheet(html,rep){const open=!$("#modal").hidden;$("#sheet").innerHTML=`<button class="x" onclick="history.back()">✕ ${T[L].close}</button>`+html;$("#modal").hidden=false;$("#modal").scrollTop=0;if(!(rep&&open))history.pushState({m:1},"")}
function closeM(){if(!$("#modal").hidden){$("#modal").hidden=true}}onpopstate=()=>{$("#modal").hidden=true};
function openP(id){const p=P.find(x=>x.id==id),d=p[L],t=T[L];sheet(`<img src="img/${p.id}.jpg" alt=""><div class="in"><h2>${d.n}</h2>
<a class="btn" href="${dirUrl(p.lat,p.lng)}" target="_blank">${t.nav}</a><p class="small">${t.taxi}</p>
<h3>✨ ${t.facts}</h3><ul>${d.f.map(x=>`<li>${x}</li>`).join("")}</ul><h3>🕘 ${t.hours}</h3><p>${d.h}</p><h3>🎟️ ${t.price}</h3><p>${d.p}</p>
${p.ticket?`<a class="btn alt" href="${p.ticket}" target="_blank">${t.tickets}</a>`:""}</div>`)}
function showTaxi(){const d=document.createElement("div");d.style.cssText="position:fixed;inset:0;background:#fff;color:#000;z-index:9999;padding:24px;overflow:auto;direction:ltr;text-align:left;display:flex;flex-direction:column;justify-content:center";d.innerHTML=`<div style="font-size:30px;line-height:1.3">Per favore, mi porti a:</div><div style="font-size:40px;font-weight:800;line-height:1.2;margin:16px 0">Hotel Domus Real Cardello</div><div style="font-size:34px;line-height:1.3">Via del Cardello 14/B<br>00184 Roma</div><div style="font-size:28px;margin-top:12px">(vicino al Colosseo)</div><div style="font-size:30px;margin-top:20px">📞 <a href="tel:+39064881663">+39 06 488 1663</a></div><div style="color:#888;margin-top:24px;text-align:center">${L=="he"?"הקישו לסגירה":"Нажмите, чтобы закрыть"}</div>`;d.onclick=e=>{if(e.target.tagName!="A")d.remove()};document.body.appendChild(d)}
function credits(){fetch("attribution.json").then(r=>r.json()).then(a=>sheet(`<div class="in"><h2>Photo credits</h2>${Object.values(a).map(x=>`<p class="small" dir="ltr">${x.title.replace("File:","")} — ${x.author}, ${x.license}, <a href="${x.url}" target="_blank">Wikimedia Commons</a></p>`).join("")}</div>`))}
function locate(){if(!navigator.geolocation){alert(T[L].geoErr);return}navigator.geolocation.getCurrentPosition(g=>{pos=g.coords;showNear()},()=>alert(T[L].geoErr),{enableHighAccuracy:true,timeout:15000})}
function showNear(){const t=T[L],list=[...P,{id:"hotel",lat:HOTEL.lat,lng:HOTEL.lng}].map(p=>({p,k:hav(pos.latitude,pos.longitude,p.lat,p.lng)})).sort((a,b)=>a.k-b.k);
$("#near").innerHTML=list.map(({p,k})=>{const w=Math.round(k*1.3/4*60),tag=`<span class="dist">${k.toFixed(1)} ${t.km} · ~${w} ${t.min}</span>`;
return p.id=="hotel"?`<div class="card hotel"><div class="b">${tag}<h2>🏨 Domus Real Cardello</h2>${navBtns()}</div></div>`:placeCard(p,tag)}).join("")}
$("#lang").onclick=()=>{L=L=="he"?"ru":"he";localStorage.lang=L;render()};render();
if("serviceWorker" in navigator){let rl=false;const hadCtrl=!!navigator.serviceWorker.controller;
navigator.serviceWorker.addEventListener("controllerchange",()=>{if(hadCtrl&&!rl){rl=true;location.reload()}});
navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(reg=>{reg.update();document.addEventListener("visibilitychange",()=>{if(!document.hidden)reg.update()})}).catch(()=>{})}

let ppUrls=null;
function idb(){return new Promise((r,j)=>{const q=indexedDB.open("roma",1);q.onupgradeneeded=()=>q.result.createObjectStore("kv");q.onsuccess=()=>r(q.result);q.onerror=j})}
async function kv(k,v){const d=await idb();return new Promise(r=>{const t=d.transaction("kv",v===undefined?"readonly":"readwrite").objectStore("kv");const q=v===undefined?t.get(k):v===null?t.delete(k):t.put(v,k);q.onsuccess=()=>r(q.result)})}
function ppView(){const t=T[L].pp;return `<div class="box"><h3>${t.h}</h3><div id="pp"><input id="pw" type="password" inputmode="numeric" autocomplete="off" placeholder="${t.pw}" style="width:100%;font-size:22px;padding:12px;border-radius:12px;border:1px solid #ccc" onkeydown="if(event.key=='Enter')ppOpen()">
<label style="display:block;margin-top:10px"><input type="checkbox" id="rem" checked> ${t.rem}</label><button class="btn" onclick="ppOpen()">${t.open}</button><p id="pperr" style="color:#c00;font-weight:700"></p></div></div>`}
function ppShow(blobs){const t=T[L].pp;ppUrls=ppUrls||blobs.map(b=>URL.createObjectURL(b));$("#pp").innerHTML=`<p class="small">${t.tap}</p>`+ppUrls.map(u=>`<img src="${u}" style="width:100%;border-radius:10px;margin-bottom:12px" onclick="ppFull('${u}')">`).join("")+`<button class="btn alt" onclick="ppForget()">${t.forget}</button>`}
function ppFull(u){sheet(`<div style="overflow:auto;touch-action:pinch-zoom"><img src="${u}" style="width:100%;max-height:none"></div>`)}
async function ppLoad(){if(ppUrls)return ppShow();try{const b=await kv("pp");if(b)ppShow(b)}catch(e){}}
async function ppForget(){await kv("pp",null);ppUrls=null;render()}
async function ppOpen(){const t=T[L].pp,e=$("#pperr");e.style.color="#555";e.textContent=t.wait;await new Promise(r=>setTimeout(r,30));
try{const m=await (await fetch("sec/meta.json")).json(),s=Uint8Array.from(atob(m.salt),c=>c.charCodeAt(0));
const base=await crypto.subtle.importKey("raw",new TextEncoder().encode($("#pw").value),"PBKDF2",false,["deriveKey"]);
const key=await crypto.subtle.deriveKey({name:"PBKDF2",salt:s,iterations:m.iter,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["decrypt"]);
const blobs=[];for(const n of ["p1","p2"]){const d=new Uint8Array(await (await fetch(`sec/${n}.bin`)).arrayBuffer());blobs.push(new Blob([await crypto.subtle.decrypt({name:"AES-GCM",iv:d.slice(0,12)},key,d.slice(12))],{type:"image/jpeg"}))}
if($("#rem").checked)await kv("pp",blobs);ppShow(blobs)}catch(x){e.style.color="#c00";e.textContent=t.bad}}

function navBtns(){const he=L=="he",ll=HOTEL.lat+","+HOTEL.lng;return `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0"><a class="btn" style="flex:1;text-align:center" href="https://waze.com/ul?ll=${ll}&navigate=yes" target="_blank">🚗 ${he?"ברכב – Waze":"На машине – Waze"}</a><a class="btn" style="flex:1;text-align:center" href="https://www.google.com/maps/dir/?api=1&destination=${ll}&travelmode=walking" target="_blank">🚶 ${he?"ברגל – Google Maps":"Пешком – Google Maps"}</a></div>`}
function homeNav(){const he=L=="he";return `<div class="box"><h3>🏨 ${he?"חזרה למלון":"Назад в отель"}</h3><div class="small" style="direction:ltr;text-align:start">Domus Real Cardello · Via del Cardello 14/B</div>${navBtns()}</div>`}

function sosBtn(){let b=document.getElementById("sos");if(!b){b=document.createElement("button");b.id="sos";b.onclick=showSOS;b.style.cssText="position:fixed;bottom:84px;inset-inline-end:14px;z-index:900;background:#d10000;color:#fff;border:none;border-radius:50%;width:64px;height:64px;font-weight:800;font-size:17px;box-shadow:0 4px 14px rgba(0,0,0,.35)";b.textContent="SOS";document.body.appendChild(b)}}
function showSOS(){const he=L=="he",r=(ic,t,s,tel)=>`<a href="tel:${tel}" style="display:block;background:${tel=="112"?"#d10000":"#fff"};color:${tel=="112"?"#fff":"#000"};border:2px solid #d10000;border-radius:14px;padding:14px;margin:10px 0;text-decoration:none"><div style="font-size:21px;font-weight:800">${ic} ${t}</div><div style="direction:ltr;text-align:start;font-size:18px">${s}</div></a>`;
sheet(`<div class="in"><h2 style="color:#d10000">🆘 ${he?"חירום":"Экстренная помощь"}</h2><p class="small">${he?"הקישו להתקשרות":"Нажмите, чтобы позвонить"}</p>
${r("🚨",he?"112 – חירום (משטרה, אמבולנס, כיבוי)":"112 – экстренная служба (полиция, скорая, пожарные)","112","112")}
${r("🇮🇱",he?"שגרירות ישראל ברומא":"Посольство Израиля в Риме","+39 06 3619 8500 · Via Michele Mercati 14, 00197 Roma","+390636198500")}
${r("🛂",he?"המחלקה הקונסולרית (דרכונים)":"Консульский отдел (паспорта)","+39 06 3619 8541","+390636198541")}
${r("🏨",he?"המלון – Domus Real Cardello":"Отель – Domus Real Cardello","+39 06 488 1663","+39064881663")}
<h3>${he?"להראות לאנשים:":"Показать людям:"}</h3><div style="font-size:42px;font-weight:800;text-align:center;direction:ltr;background:#fff3f3;border-radius:14px;padding:20px">Ho bisogno di aiuto!</div><p class="small" style="text-align:center">${he?"„אני צריכה עזרה” (הו בִּיזוֹנְיוֹ די אַיוּטוֹ)":"«Мне нужна помощь» (о бизоньо ди аюто)"}</p></div>`)}
new MutationObserver(()=>{const b=document.getElementById("sos");if(!b)return;const m=document.getElementById("modal");const ov=[...document.body.children].some(e=>e.style&&e.style.zIndex=="9999");b.style.display=(m&&!m.hidden)||ov?"none":""}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden"]});
