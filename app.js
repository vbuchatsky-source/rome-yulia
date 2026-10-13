let L=localStorage.lang||"he",tab=0,pos=null;const $=s=>document.querySelector(s);
const dirUrl=(a,b)=>`https://www.google.com/maps/dir/?api=1&destination=${a},${b}&travelmode=walking`;
function hav(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,x=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
function hotelCard(t){return `<div class="card hotel"><div class="ph">🏨</div><div class="b"><div class="sub">${t.hotel}</div><h2>Domus Real Cardello</h2>
<div style="direction:ltr;text-align:start">Via del Cardello, 14/B, 00184 Roma</div>
<div>${t.conf}: <span class="code">${HOTEL.conf}</span> ${t.pin}: <span class="code">${HOTEL.pin}</span></div><div class="small">${t.checkin}</div>
<a class="btn" href="${dirUrl(HOTEL.lat,HOTEL.lng)}" target="_blank">${t.navHotel}</a>
<button class="btn alt" onclick="showTaxi()">🚕 ${t.showTaxi}</button>
<a class="btn alt" href="tel:+39064881663">📞 ${t.call} <bdi dir="ltr">${HOTEL.phone}</bdi></a></div></div>`}
function placeCard(p,extra=""){const d=p[L];return `<div class="card" onclick="openP('${p.id}')"><img src="img/${p.id}.jpg" alt="" loading="lazy"><div class="b">${extra}<h2>${d.n}</h2></div></div>`}
function render(){const t=T[L];document.documentElement.dir=t.dir;document.documentElement.lang=L;$("#title").textContent=t.title;$("#lang").textContent=t.lang;
$("#tabs").innerHTML=t.tabs.map((n,i)=>`<button class="${i==tab?'on':''}" onclick="tab=${i};render();scrollTo(0,0)">${["🏛️","📍","🗓️","📄"][i]}<br>${n}</button>`).join("");
let h="";if(tab==0){h=hotelCard(t)+P.map(p=>placeCard(p)).join("")+`<p class="small"><a href="#" onclick="credits();return false">${t.credits}</a></p>`}
else if(tab==1){h=`<button class="btn" onclick="locate()">📍 ${t.near}</button><p class="small">${t.nearNote}</p><div id="near"></div>`}
else if(tab==2){h=t.days.map(([d,it])=>`<div class="day"><h2>${d}</h2><ul>${it.map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("")}
else{h=`<div class="box">${DOCS[L]}</div><div class="box"><h3>🗣️ ${t.phrases}</h3>${PHR.map(r=>`<p><span class="ph-it">${r[0]}</span><br>${L=="he"?r[1]:r[2]}<br><span class="small">${L=="he"?r[3]:r[4]}</span></p>`).join("")}</div>`}
$("#main").innerHTML=h;if(tab==1&&pos)showNear()}
function sheet(html){$("#sheet").innerHTML=`<button class="x" onclick="closeM()">✕ ${T[L].close}</button>`+html;$("#modal").hidden=false;$("#modal").scrollTop=0;history.pushState({m:1},"")}
function closeM(){if(!$("#modal").hidden){$("#modal").hidden=true}}onpopstate=()=>{$("#modal").hidden=true};
function openP(id){const p=P.find(x=>x.id==id),d=p[L],t=T[L];sheet(`<img src="img/${p.id}.jpg" alt=""><div class="in"><h2>${d.n}</h2>
<a class="btn" href="${dirUrl(p.lat,p.lng)}" target="_blank">${t.nav}</a><p class="small">${t.taxi}</p>
<h3>✨ ${t.facts}</h3><ul>${d.f.map(x=>`<li>${x}</li>`).join("")}</ul><h3>🕘 ${t.hours}</h3><p>${d.h}</p><h3>🎟️ ${t.price}</h3><p>${d.p}</p>
${p.ticket?`<a class="btn alt" href="${p.ticket}" target="_blank">${t.tickets}</a>`:""}</div>`)}
function showTaxi(){sheet(`<div class="taxi">Domus Real Cardello\n\nVia del Cardello, 14/B\n00184 Roma\n\n📞 06 488 1663</div>`)}
function credits(){fetch("attribution.json").then(r=>r.json()).then(a=>sheet(`<div class="in"><h2>Photo credits</h2>${Object.values(a).map(x=>`<p class="small" dir="ltr">${x.title.replace("File:","")} — ${x.author}, ${x.license}, <a href="${x.url}" target="_blank">Wikimedia Commons</a></p>`).join("")}</div>`))}
function locate(){if(!navigator.geolocation){alert(T[L].geoErr);return}navigator.geolocation.getCurrentPosition(g=>{pos=g.coords;showNear()},()=>alert(T[L].geoErr),{enableHighAccuracy:true,timeout:15000})}
function showNear(){const t=T[L],list=[...P,{id:"hotel",lat:HOTEL.lat,lng:HOTEL.lng}].map(p=>({p,k:hav(pos.latitude,pos.longitude,p.lat,p.lng)})).sort((a,b)=>a.k-b.k);
$("#near").innerHTML=list.map(({p,k})=>{const w=Math.round(k*1.3/4*60),tag=`<span class="dist">${k.toFixed(1)} ${t.km} · ~${w} ${t.min}</span>`;
return p.id=="hotel"?`<div class="card hotel"><div class="b">${tag}<h2>🏨 Domus Real Cardello</h2><a class="btn" href="${dirUrl(HOTEL.lat,HOTEL.lng)}" target="_blank">${t.navHotel}</a></div></div>`:placeCard(p,tag)}).join("")}
$("#lang").onclick=()=>{L=L=="he"?"ru":"he";localStorage.lang=L;render()};render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");
