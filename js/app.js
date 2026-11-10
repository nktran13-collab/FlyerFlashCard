let topic=Object.keys(DATA)[0],mode="flash",deck=[],i=0,known=JSON.parse(localStorage.flyerKnown||"{}");
const $=id=>document.getElementById(id);
function say(t){if(!speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-GB";u.rate=.8;speechSynthesis.speak(u)}
function save(){localStorage.flyerKnown=JSON.stringify(known)}
function load(shuffle){deck=[...DATA[topic]];if(shuffle)deck.sort(()=>Math.random()-.5);i=0;render()}
function renderTopics(){$("topics").innerHTML="";Object.keys(DATA).forEach(t=>{const b=document.createElement("button");const n=DATA[t].filter(w=>known[w[1]]).length;b.textContent=t+" "+n+"/"+DATA[t].length;if(t==topic)b.className="on";b.onclick=()=>{topic=t;renderTopics();load()};$("topics").appendChild(b)})}
function render(){const n=DATA[topic].filter(w=>known[w[1]]).length;$("bar").style.width=n/DATA[topic].length*100+"%";$("stat").firstChild.textContent="Đã thuộc "+n+"/"+DATA[topic].length;mode=="flash"?flash():quiz()}
function flash(){const w=deck[i];$("main").innerHTML=`<div class="card" id="c"><div class="in"><div class="f"><div class="emoji">${w[0]}</div><div class="word">${w[1]}</div><small>Chạm để lật</small></div><div class="b"><div class="vi">${w[2]}</div><div class="word">${w[1]}</div></div></div></div>
<div class="row"><button id="sp">🔊 Nghe</button></div>
<div class="row"><button class="r" id="no">😅 Chưa thuộc</button><button class="g" id="yes">😄 Đã thuộc</button></div>
<div class="row"><button id="pv">⬅️</button><span>${i+1}/${deck.length}</span><button id="nx">➡️</button></div>`;
$("c").onclick=()=>$("c").classList.toggle("flip");$("sp").onclick=()=>say(w[1]);
$("yes").onclick=()=>{known[w[1]]=1;save();renderTopics();next()};$("no").onclick=()=>{delete known[w[1]];save();renderTopics();next()};
$("pv").onclick=()=>{i=(i-1+deck.length)%deck.length;flash()};$("nx").onclick=next;say(w[1])}
function next(){i=(i+1)%deck.length;render()}
function quiz(){const w=deck[i];const pool=Object.values(DATA).flat().filter(x=>x[1]!=w[1]);const opts=[w,...pool.sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
$("main").innerHTML=`<div class="card" style="height:auto"><div class="f" style="position:static;padding:20px;height:240px"><div class="emoji">${w[0]}</div><small>${w[2]}</small><button id="sp">🔊</button></div></div>`+opts.map((o,k)=>`<button class="opt" data-k="${k}">${o[1]}</button>`).join("")+`<small>${i+1}/${deck.length}</small>`;
$("sp").onclick=()=>say(w[1]);
document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const ok=opts[b.dataset.k]==w;b.classList.add(ok?"ok":"no");if(ok){known[w[1]]=1;save();renderTopics();say(w[1]);setTimeout(next,800)}else say("Try again")})}
$("mFlash").onclick=()=>{mode="flash";$("mFlash").className="on";$("mQuiz").className="";render()};
$("mQuiz").onclick=()=>{mode="quiz";$("mQuiz").className="on";$("mFlash").className="";render()};
$("shuf").onclick=()=>load(true);
renderTopics();load();
function setTheme(t){document.documentElement.dataset.theme=t;localStorage.flyerTheme=t;$("theme").textContent=t=="dark"?"\u2600\uFE0F":"\uD83C\uDF19"}
$("theme").onclick=()=>setTheme(document.documentElement.dataset.theme=="dark"?"light":"dark");
setTheme(document.documentElement.dataset.theme);
