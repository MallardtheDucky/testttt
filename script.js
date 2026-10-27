let ghT=null;function gh(t){if(t===ghT)return;ghT=t;const e=document.getElementById("gh");e.innerHTML="";if(!t)return;const s=document.createElement("span");s.textContent=(t+"   ·   ").repeat(8);e.appendChild(s)}
const $=id=>document.getElementById(id),W=ms=>new Promise(r=>setTimeout(r,ms)),R=a=>a[Math.floor(Math.random()*a.length)];
const D=[["Dogmeat","🐕",30],["Canvas Bag","🎒",40],["Horse Armor","🐴",100],["Codsworth","🤖",30],["Preston Garvey","🏘️",40],["Vault Boy","👍",20],["Skyrim Guard","🛡️",20],["Nord Cheese Wheel","🧀",40],["Bucket on Head","🪣",40],["Power Armor","🦾",200]];
const QT={"Dogmeat":"Good boy.","Canvas Bag":"Collector’s Edition. Nylon was not an option.","Horse Armor":"Two dollars fifty. Still worth it.","Codsworth":"Mum? Mum? Mum?","Preston Garvey":"Another settlement needs your help.","Vault Boy":"Thumbs up. Everything is fine.","Skyrim Guard":"I used to be an adventurer like you. Then I took an arrow in the knee.","Nord Cheese Wheel":"It rolls down the hill. It always rolls down the hill.","Bucket on Head":"He can see nothing. Neither can the AI. It just works.","Power Armor":"Fusion core at two percent. Of course."};
const E=[["bugs in the engine","🐛",12,20],["flying spoons","🥄",16,16],["paid mods","💸",20,14],["load screens","⏳",36,10],["radiant quests","📜",40,10],["Skyrim ports","🐉",90,5]];
const ICON={};D.forEach(d=>ICON[d[0]]=d[1]);E.forEach(e=>ICON[e[0]]=e[1]);ICON["Skyrim Port"]="🐉";
function card(u,cls){const e=document.createElement("div");e.className="card "+cls;e.innerHTML='<div class="e">'+(ICON[u.name]||"?")+'</div>'+u.name+'<b>'+Math.max(0,u.hp)+'</b>';return e}
function paint(e,h){e.querySelector("b").textContent=Math.max(0,h);if(h<=0)e.classList.add("dead")}
function show(id){["sb","td","hd"].forEach(s=>$(s).classList.toggle("hide",s!=id))}
function tab(w){if(w==="t"){hardIntro();return}if(typeof hard!=="undefined"&&hard)hardQuit();show("sb");[["S","s"],["T","t"]].forEach(k=>$("t"+k[0]).classList.toggle("on",k[1]===w));gh("")}
$("tS").onclick=()=>tab("s");$("tT").onclick=()=>tab("t");
let last=null,busy=false;
$("se").innerHTML=E.map((e,i)=>'<option value="'+i+'">'+e[1]+" "+e[0]+" ("+e[2]+" a raid)</option>").join("");
$("sr").innerHTML=D.map(d=>'<label>'+d[1]+" "+d[0]+" <b style='color:var(--ac)'>"+d[2]+'</b><input type="number" min="0" max="12" value="0" data-n="'+d[0]+'"></label>').join("");
function roster(){return[...document.querySelectorAll("#sr input")].map(i=>({d:D.find(d=>d[0]==i.dataset.n),n:Math.max(0,Math.min(12,+i.value||0))})).filter(r=>r.n)}
function sums(){const e=E[$("se").value],n=Math.max(1,Math.min(12,+$("sc").value||1)),a=Math.max(1,Math.round(e[2]/Math.min(n,e[3])));const r=roster();
 $("ss").innerHTML="<span>"+n+" x "+e[0]+", "+a+" attack each = <b>"+a*n+"</b> a round</span><span>"+r.reduce((s,x)=>s+x.n,0)+" defenders = <b>"+r.reduce((s,x)=>s+x.d[2]*x.n,0)+"</b> defence</span>"}
$("se").onchange=()=>{$("sc").value=Math.max(2,Math.min(6,Math.floor(E[$("se").value][3]/3)));sums()};
$("sc").oninput=sums;$("sr").oninput=sums;$("se").onchange();
const say=t=>$("sl").textContent=t;
async function play(b){
 if(busy)return;busy=true;$("en").innerHTML="";$("me").innerHTML="";$("el").textContent=b.what.toUpperCase();
 const ec=b.en.map(u=>{const c=card(u,"en");$("en").appendChild(c);return c}),mc=b.me.map(u=>{const c=card(u,"me");$("me").appendChild(c);return c});
 const tot=b.me.reduce((s,u)=>s+u.max,0)||1;let stand=tot;$("df").style.width="100%";
 say(b.en.length+" of them, "+b.en.reduce((s,u)=>s+u.atk,0)+" a round, against "+tot+" defence.");await W(900);
 if(!b.me.length){say("Nothing was standing. They walked in.");$("df").style.width="0";busy=false;return}
 for(const r of b.rounds){const t=(r.side=="e"?mc:ec)[r.to];
  t.classList.add("hit");await W(260);t.classList.remove("hit");paint(t,r.after);
  if(r.side=="e"){stand-=r.dmg;$("df").style.width=Math.max(0,stand/tot*100)+"%"}
  say(r.side=="e"?(r.dead?r.tn+" came apart under "+r.atk+".":r.tn+" took "+r.atk+", "+r.after+" left."):(r.dead?"Your "+r.fn+" put one of the "+r.tn+" down.":"One of the "+r.tn+" is bleeding, "+r.after+" left."));await W(480)}
 say(b.held?"The place held. "+Math.max(0,stand)+" still standing.":"Nothing left standing, and "+b.left+" of them still on their feet.");busy=false}
function sim(){
 const e=E[$("se").value],n=Math.max(1,Math.min(12,+$("sc").value||1)),a=Math.max(1,Math.round(e[2]/Math.min(n,e[3]))),hp=a*2;
 const en=[],me=[];for(let i=0;i<n;i++)en.push({name:e[0],atk:a,hp:hp,left:hp});
 roster().forEach(r=>{for(let i=0;i<r.n;i++)me.push({name:r.d[0],atk:Math.max(1,Math.round(r.d[2]/4)),hp:r.d[2],max:r.d[2],left:r.d[2]})});
 const rounds=[],alive=l=>l.map((u,i)=>[u,i]).filter(p=>p[0].left>0);
 for(let k=0;k<8&&alive(me).length&&alive(en).length;k++){
  [["e",en,me],["m",me,en]].forEach(([s,from,to])=>alive(from).forEach(([u,i])=>{const tg=R(alive(to));if(!tg)return;const t=tg[0],bf=t.left;t.left=Math.max(0,t.left-u.atk);
   rounds.push({side:s,fn:u.name,tn:t.name,to:tg[1],atk:u.atk,after:t.left,dead:t.left<=0,dmg:bf-t.left})}))}
 return{what:e[0],en:en.map(u=>({name:u.name,atk:u.atk,hp:u.hp})),me:me.map(u=>({name:u.name,hp:u.hp,max:u.max})),rounds:rounds,held:me.some(u=>u.left>0),left:alive(en).length}}
$("run").onclick=()=>{last=sim();play(last)};$("again").onclick=()=>last&&play(last);
const MAX=460,PH=[
 {at:1,n:"PHASE 1",t:"SIXTEEN TIMES THE DETAIL",o:"So. You want to see it again. It’s the same game you already bought.",l:["Fallout is on your fridge now. You’re welcome.","See that wasteland? You can walk across all of it. You won’t enjoy it.","We reused the engine. It has character.","That bug is a feature of the simulation."]},
 {at:.75,n:"PHASE 2",t:"IT JUST WORKS",o:"Don’t worry about the load order. It just works.",l:["Horse armor is back. Two dollars fifty.","We’re shipping it. We’ll patch the rest.","Day one update. Sixty gigabytes. Trust me.","Paid mods were always about supporting creators."]},
 {at:.5,n:"PHASE 3",t:"YOU'RE BREATHTAKING",o:"You’re breathtaking! Now buy the anniversary edition.",l:["War never changes. Neither does our engine.","I’m porting this fight to another platform mid-fight.","Sixteen times the detail. Sixteen times the damage.","Have you tried it on a smart fridge?"]},
 {at:.2,n:"FINAL PHASE",t:"IT. JUST. WORKS.",rage:1,o:"ENOUGH. IT JUST WORKS. IT JUST WORKS!",l:["WAR NEVER CHANGES! WE’RE RE-RELEASING IT!","SEE THAT VAULT? IT’S DLC NOW.","I AM THE LOAD ORDER.","WE’RE DOING IT AGAIN IN TWO YEARS."]}];
let T=null;
const pidx=hp=>{let p=0;PH.forEach((x,i)=>{if(hp/MAX<=x.at)p=i});return p};
function deck(){const k=[];D.forEach(d=>{const m=d[2]>=100?1:d[2]>=40?2:3;for(let i=0;i<m;i++)k.push({name:d[0],hp:d[2],max:d[2],atk:Math.max(2,Math.round(d[2]/4)),atoms:Math.max(1,Math.ceil(d[2]/30))})});
 for(let i=k.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[k[i],k[j]]=[k[j],k[i]]}return k}
function lg(t,c){const r=document.createElement("div");r.className=c||"";r.textContent=t;$("lg").prepend(r)}
function vig(c,a,ms){const v=document.createElement("div");v.className="sf";v.style.setProperty("--c",c);v.style.setProperty("--a",a);v.style.animationDuration=ms+"ms";document.body.appendChild(v);setTimeout(()=>v.remove(),ms)}
function flash(t,tag,kind,sub){
 if(tag===undefined&&/^-\d/.test(t)){const d=document.createElement("div");d.className="dn";d.textContent=t;d.style.left=(36+Math.random()*24)+"%";document.body.appendChild(d);vig("#ff3b1f",.5,520);setTimeout(()=>d.remove(),1000);return}
 const k=tag!==undefined?[kind||"atk",tag]:/^(PHASE|FINAL)/.test(t)?["ph","New location discovered"]:t=="MINIGAME"?["mg","Speech check"]:t=="HOTFIX"?["hl","Hotfix deployed"]:["atk","Todd uses"];
 document.querySelectorAll(".fl").forEach(x=>x.remove());
 const e=document.createElement("div");e.className="fl "+k[0];e.innerHTML='<i class="tg"></i><b class="tx"></b><em class="sb"></em>';
 e.querySelector(".tg").textContent=k[1];e.querySelector(".tx").textContent=t;e.querySelector(".sb").textContent=sub||"";document.body.appendChild(e);
 vig({ph:"#ffd43b",mg:"#4cc3ff",hl:"#3dff8a",atk:"#ff5a36"}[k[0]],.5,750);setTimeout(()=>e.remove(),1700)}
function shake(){const e=document.querySelector("main");e.classList.remove("shake");void e.offsetWidth;e.classList.add("shake")}

const price=u=>u.atoms||1;
function toddStart(o){
 T={hp:MAX,you:o&&o.you!==undefined?o.you:100,cost:18,credit:0,atoms:4,placed:false,over:false,busy:false,ph:0,turn:1,deck:deck().concat(deck()),hand:[],board:[],min:[]};
 for(let i=0;i<3;i++)T.hand.push(T.deck.pop());
 $("lg").innerHTML="";$("end").classList.add("hide");$("gm").classList.add("hide");$("ts").textContent=PH[0].o;
 lg("He starts with "+MAX+" health. Every "+T.cost+" damage you deal buys a card.");
 lg("You have "+T.you+" health. Anything he swings at an empty board hits you.");
 lg("HARD MODE: every card costs atoms. You get 2 a turn, and 2 more for beating one of his minigames.","p");render()}
function render(){if(!T)return;const ph=PH[pidx(T.hp)];
 $("th").style.width=Math.max(0,T.hp/MAX*100)+"%";$("tn").textContent=Math.max(0,T.hp)+" / "+MAX;
 $("ph").textContent=ph.n+" - "+ph.t;gh(ph.t);$("tp").classList.toggle("rage",!!ph.rage);
 $("yh").style.width=Math.max(0,T.you)+"%";$("yn").textContent=Math.max(0,T.you)+" / 100";
 $("meta").innerHTML="Deck <b>"+T.deck.length+"</b> &nbsp; Draw cost <b>"+T.cost+"</b> &nbsp; Atoms <b class=\"at\">"+T.atoms+"</b>";
 $("bk").style.width=Math.min(100,T.credit/T.cost*100)+"%";$("bn").textContent=T.credit+" / "+T.cost;
 $("tm").innerHTML="";T.min.forEach(u=>$("tm").appendChild(card(u,"en")));
 $("tb").innerHTML="";T.board.forEach((u,i)=>{const c=card(u,"me"),x=document.createElement("button");x.className="x";x.textContent="x";x.title="Retire card";x.onclick=()=>{if(T.busy||T.over)return;T.board.splice(i,1);render()};c.appendChild(x);$("tb").appendChild(c)});
 for(let i=T.board.length;i<4;i++){const s=document.createElement("div");s.className="slot";$("tb").appendChild(s)}
 $("th2").innerHTML="";T.hand.forEach((u,i)=>{const c=card(u,"me"),x=document.createElement("button"),p=document.createElement("u");
  x.className="x";x.textContent="x";x.title="Discard";x.onclick=e=>{e.stopPropagation();if(T.busy||T.over)return;T.hand.splice(i,1);render()};
  p.className="pr"+(T.atoms<price(u)?" no":"");p.textContent=price(u);p.title=price(u)+" atoms to play";
  c.onclick=()=>play1(i);c.append(p,x);$("th2").appendChild(c)});
 $("bc").textContent=T.board.length+" / 4";$("hc").textContent=T.hand.length+" / 5";
 $("dr").disabled=T.over||T.busy||T.credit<T.cost||T.hand.length>=5||!T.deck.length;$("bell").disabled=T.over||T.busy}
function play1(i){if(!T||T.over||T.busy)return;if(T.board.length>=4)return lg("No room on the board.","r");if(T.placed)return lg("One card a turn. Ring the bell.","r");
 const c=T.hand[i],p=price(c);if(T.atoms<p)return lg(c.name+" costs "+p+" atoms and you have "+T.atoms+". Win one of his minigames.","r");
 T.atoms-=p;T.hand.splice(i,1);T.board.push(c);T.placed=true;lg(c.name+" takes the field. "+(QT[c.name]||""));render()}
$("dr").onclick=()=>{if(!T||T.over||T.busy||T.credit<T.cost||T.hand.length>=5||!T.deck.length)return;T.credit-=T.cost;const c=T.deck.pop();T.hand.push(c);lg("Drew "+c.name+".","g");render()};
$("rs").onclick=$("eb").onclick=()=>hardStart();

function hurt(n,why){T.you-=n;shake();flash("-"+n);lg(why+" went straight through and hit YOU for "+n+".","r")}
function hit(n,why){const a=T.board.filter(c=>c.hp>0);if(!a.length)return hurt(n,why);const c=R(a);c.hp=Math.max(0,c.hp-n);shake();flash("-"+n);lg(why+(c.hp<=0?" destroyed your ":" hit your ")+c.name+" for "+n+".","r")}
function hitAll(n,why){if(!T.board.some(c=>c.hp>0))return;T.board.forEach(c=>c.hp=Math.max(0,c.hp-n));shake();flash("-"+n);lg(why+" hit everything you had for "+n+".","r")}
function mill(n,why){if(!T.deck.length)return hurt(Math.max(6,n*4),why+" (nothing left to take)");
 const g=T.deck.splice(Math.max(0,T.deck.length-n),n);shake();lg(why+" took "+g.length+" card"+(g.length==1?"":"s")+" off your deck: "+g.map(c=>c.name).join(", ")+".","r")}
function reRel(why){if(!T.hand.length)return hurt(10,why+" (your hand was empty)");const n=T.hand.length;
 while(T.hand.length)T.deck.push(T.hand.pop());for(let i=T.deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[T.deck[i],T.deck[j]]=[T.deck[j],T.deck[i]]}
 lg(why+" shuffled all "+n+" cards in your hand back into the deck.","r")}
function port(why){const p=T.deck.filter(c=>c.atk>2||c.max>10);if(!p.length)return hurt(10,why+" (your deck had nothing worth porting)");
 const c=R(p);c.atk=Math.max(1,Math.round(c.atk/2));c.max=Math.max(5,Math.round(c.max/2));c.hp=c.max;
 lg(why+" A "+c.name+" in your deck came back as "+c.atk+" attack, "+c.max+" health.","r")}

function gOpen(t,h){$("gt").textContent=t;$("gh2").textContent=h;$("gbody").innerHTML="";$("gn").textContent="";$("gn").className="";$("gclk").style.width="100%";$("gm").classList.remove("hide");return $("gbody")}
function gClose(w,t){$("gn").textContent=t;$("gn").className=w?"gw":"gl";return W(820).then(()=>{$("gm").classList.add("hide");return w})}
function gClock(ms,out){const f=$("gclk"),s=Date.now();let on=1;(function st(){if(!on)return;const l=Math.max(0,1-(Date.now()-s)/ms);f.style.width=l*100+"%";if(l<=0){on=0;out();return}requestAnimationFrame(st)})();return()=>{on=0}}
function mgDoubt(){const b=gOpen("PRESS X TO DOUBT","Stop the marker inside the lit band.");
 const tr=document.createElement("div");tr.className="track";const z=18+Math.random()*54,w=13;
 tr.innerHTML='<i class="zone"></i><b class="pin"></b>';const zn=tr.firstChild,pn=tr.lastChild;zn.style.left=z+"%";zn.style.width=w+"%";
 const bt=document.createElement("button");bt.className="b go";bt.textContent="Doubt";b.append(tr,bt);
 return new Promise(res=>{let at=0,dir=1,on=1,last=Date.now(),stop=()=>{};
  (function fr(){if(!on)return;const n=Date.now(),t=Math.min(50,n-last);last=n;at+=dir*1.55*(t/16.7);if(at>=100){at=100;dir=-1}if(at<=0){at=0;dir=1}pn.style.left=at+"%";requestAnimationFrame(fr)})();
  const fin=(ok,t)=>{if(!on)return;on=0;stop();res(gClose(ok,t))};
  bt.onclick=()=>{const h=at>=z&&at<=z+w;fin(h,h?"Doubted correctly.":"You doubted the wrong part.")};
  stop=gClock(5200,()=>fin(false,"You said nothing. He took that as agreement."))})}
function mgDetail(){const need=6,b=gOpen("SIXTEEN TIMES THE DETAIL","Watch the "+need+" tiles, then click them back.");
 const g=document.createElement("div");g.className="dg";const cells=[];
 for(let i=0;i<16;i++){const c=document.createElement("button");c.className="dc";g.appendChild(c);cells.push(c)}b.appendChild(g);
 const o=cells.map((_,i)=>i);for(let i=15;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}
 const want=o.slice(0,need);want.forEach(i=>cells[i].classList.add("lit"));
 return new Promise(res=>{let on=1,got=0,stop=null;const fin=(ok,t)=>{if(!on)return;on=0;if(stop)stop();res(gClose(ok,t))};
  W(1250).then(()=>{if(!on)return;want.forEach(i=>cells[i].classList.remove("lit"));g.classList.add("live");
   cells.forEach((c,i)=>c.onclick=()=>{if(!on||c.classList.contains("ok"))return;
    if(want.indexOf(i)<0){c.classList.add("bad");return fin(false,"That one was never in the trailer.")}
    c.classList.add("ok");if(++got>=need)fin(true,"Every last detail.")});
   stop=gClock(6000,()=>fin(false,"Too slow. It shipped without them."))})})}
function mgInstall(){const need=24,b=gOpen("MASH TO INSTALL","Click "+need+" times before the download stalls.");
 const bar=document.createElement("div");bar.className="ib";const f=document.createElement("i");bar.appendChild(f);
 const bt=document.createElement("button");bt.className="b go";bt.textContent="INSTALL";b.append(bar,bt);
 return new Promise(res=>{let n=0,on=1,stop=()=>{};const fin=(ok,t)=>{if(!on)return;on=0;stop();res(gClose(ok,t))};
  bt.onclick=()=>{if(!on)return;n++;f.style.width=Math.min(100,n/need*100)+"%";if(n>=need)fin(true,"Installed. All 90 gigabytes of it.")};
  stop=gClock(5000,()=>fin(false,"The download stalled at 99 percent."))})}
const minigame=()=>R([mgDoubt,mgDetail,mgInstall])();

async function bell(){
 if(!T||T.over||T.busy)return;T.busy=true;render();let dealt=0;
 for(const c of T.board.filter(c=>c.hp>0)){
  if(T.min.length){const m=T.min[0];m.hp-=c.atk;lg("Your "+c.name+(m.hp<=0?" broke his "+m.name+".":" hit "+m.name+" for "+c.atk+"."),"g");if(m.hp<=0)T.min.shift()}
  else{T.hp-=c.atk;dealt+=c.atk;lg("Your "+c.name+" hit Todd for "+c.atk+".","g")}
  render();await W(230)}
 T.credit+=dealt;T.turn++;T.placed=false;T.atoms+=2;lg("+2 atoms.","g");
 if(T.hp<=0){T.hp=0;return finish(true)}
 const p=pidx(T.hp),ph=PH[p];
 if(p!=T.ph){T.ph=p;$("ts").textContent=ph.o;lg("-- "+ph.n+": "+ph.t+" --","p");flash(ph.n);shake();render();await W(1100)}
 else $("ts").textContent=R(ph.l);
 await W(420);await act(p);
 T.board=T.board.filter(c=>c.hp>0);
 if(T.you<=0){T.you=0;return finish(false)}
 T.busy=false;render()}
$("bell").onclick=bell;
async function act(p){
 if(Math.random()<.45){flash("MINIGAME");$("ts").textContent="Let’s make this interesting. Earn it.";await W(900);
  if(await minigame()){T.atoms+=2;lg("You cleared it and took 2 atoms off him.","g")}else hurt(p==3?22:16,"Failing his minigame");
  render();if(T.you<=0)return;await W(460)}
 const sw=[1,1,2,3][p]+1;
 for(let i=0;i<sw&&T.you>0;i++){const r=Math.random();
  if(p==0){flash("PATCH NOTES");if(r<.25)mill(2,"A quiet patch note.");else hit(14,"A quiet patch note")}
  else if(p==1){
   if(r<.3){T.hp=Math.min(MAX,T.hp+22);lg("Todd shipped a hotfix and healed 22.","r");flash("HOTFIX")}
   else if(r<.5){T.cost+=5;flash("CREATION CLUB");lg("Todd put your cards on the Creation Club. Drawing a card now costs "+T.cost+" damage.","r")}
   else{flash("DAY ONE UPDATE");hit(11,"Day one update");await W(260);hit(11,"Day one update")}}
  else if(p==2){
   if(r<.34){flash("16x THE DETAIL");hitAll(11,"Sixteen times the detail")}
   else if(r<.67&&T.min.length<2){T.min.push({name:"Skyrim Port",hp:50,max:50,atk:11});lg("Todd ported Skyrim onto the board.","r");flash("PORT")}
   else if(T.hand.length){const t=T.hand.splice(Math.floor(Math.random()*T.hand.length),1)[0];flash("PAYWALL");await W(420);lg("Todd put your "+t.name+" behind a paywall.","r")}
   else if(r<.86){flash("RE-RELEASE");reRel("Todd re-released the whole thing.")}
   else{flash("SEASON PASS");hit(18,"A season pass")}}
  else{
   if(r<.35){flash("IT JUST WORKS");hitAll(15,"IT JUST WORKS")}
   else if(r<.7&&T.board.some(c=>c.hp>0)){const c=R(T.board.filter(c=>c.hp>0));c.hp=0;flash("DELISTED");shake();await W(460);lg("Todd delisted your "+c.name+" outright.","r")}
   else if(r<.85){flash("DELISTED");mill(4,"Todd delisted the back catalogue.");await W(200);port("And ported what was left.")}
   else{flash("REMASTER");hit(22,"A remaster")}}
  T.board=T.board.filter(c=>c.hp>0);render();if(T.you<=0)break;await W(520)}
 for(const m of T.min){if(T.you<=0)break;hit(m.atk,m.name);T.board=T.board.filter(c=>c.hp>0);render();await W(260)}}
function finish(win){T.over=true;T.busy=false;render();if(win)hardPhase1Done(T.you);else hardPhase1Lost()}
const FACE=new Image();FACE.src=$("tf").src;
let AC=null,yp=null,ytOK=true,aon=true;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){AC=null}}if(AC&&AC.state==="suspended")AC.resume();return AC}
function ytStatus(){if(!ytOK&&aon)$("au").textContent="AUDIO: OFFLINE"}
const MUSIC_SRC=window.PHASE_ONLY?"../assets/hardmode/music.m4a":"assets/hardmode/music.m4a";
const MUSIC_VOL=.3;
function musicEl(){if(!yp){yp=new Audio(MUSIC_SRC);yp.loop=true;yp.preload="auto";yp.onerror=()=>{ytOK=false;ytStatus()}}return yp}
$("au").onclick=()=>{aon=!aon;$("au").textContent="AUDIO: "+(aon?"ON":"OFF");$("au").setAttribute("aria-pressed",aon);
if(!aon){try{musicEl().pause()}catch(e){}}else if(hard&&!hard.over)hardMusicStart(hard.phase)};
(function(){const e=$("em");for(let i=0;i<70;i++){const s=document.createElement("i");s.style.left=Math.random()*100+"%";s.style.top="-4%";s.style.width=s.style.height=(1+Math.random()*3)+"px";s.style.animationDuration=(8+Math.random()*10)+"s";s.style.animationDelay=(-Math.random()*14)+"s";e.appendChild(s)}})();
$("cmpt").textContent="N   ·   TODD HOWARD ◆   ·   NE   ·   YOUR FRIDGE ◆   ·   E   ·   SE   ·   VAULT 76 ◆   ·   S   ·   ANOTHER SETTLEMENT ◆   ·   SW   ·   YOUR WATCH ◆   ·   W   ·   NW   ·   ".repeat(6);
const TIPS=["Did you know? Fallout is also available on your smart fridge.","It just works.","Sixteen times the detail. Zero times the fixes.","Fallout 3 is Oblivion with guns. And that is fine.","Paid mods are about supporting creators.","Horse armor is only two dollars fifty. Again.","Every NPC in the world can be crushed by a bucket.","Starfield has over a thousand planets. Most of them are empty.","Fallout 76 is now fully working. Probably.","Remember to buy Skyrim again.","Tip: save often. The game will not.","Collector’s Edition canvas bag. Nylon not included.","Another settlement needs your help.","Please stand by. Your game is loading. Again.","You can now play Skyrim on your watch. You should not."];
function tipNow(){const e=$("lts");e.style.opacity=0;setTimeout(()=>{e.textContent=R(TIPS);e.style.opacity=1},500)}
$("lts").textContent=R(TIPS);setInterval(tipNow,9000);
function roll(){const c=document.createElement("div");c.className="cw";c.textContent="\u2622\uFE0F";document.body.appendChild(c);setTimeout(()=>c.remove(),9200)}
setTimeout(roll,5000);setInterval(roll,28000);
$("tf").onclick=()=>{if(T)lg("Todd Howard tried to hack a terminal. He is now locked out. It just works.","g")};
