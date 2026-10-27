let ghT=null;function gh(t){if(t===ghT)return;ghT=t;const e=document.getElementById("gh");e.innerHTML="";if(!t)return;const s=document.createElement("span");s.textContent=(t+"   ·   ").repeat(8);e.appendChild(s)}
const $=id=>document.getElementById(id),W=ms=>new Promise(r=>setTimeout(r,ms)),R=a=>a[Math.floor(Math.random()*a.length)];
const D=[["Dogmeat","🐕",30],["Lydia","🎒",40],["Skyrim Guard","🏹",100],["Preston Garvey","🏘️",40],["Nazeem","🧐",20],["Dragonborn","🗣️",200]];
const QT={"Dogmeat":"Good boy.","Lydia":"I am sworn to carry your burdens.","Skyrim Guard":"Used to be an adventurer. Then, the knee.","Preston Garvey":"Another settlement needs your help.","Nazeem":"Do you get to the Cloud District very often?","Dragonborn":"FUS RO DAH."};
const E=[["skeevers","🐀",12,20],["mudcrabs","🦀",16,16],["cliff racers","🦅",20,14],["roof horses","🐴",36,10],["bandits","🏴‍☠️",40,10],["dragons","🐉",90,5]];
const ICON={};D.forEach(d=>ICON[d[0]]=d[1]);E.forEach(e=>ICON[e[0]]=e[1]);ICON["Skyrim Port"]="🏔️";
function card(u,cls){const e=document.createElement("div");e.className="card "+cls;e.innerHTML='<div class="e">'+(ICON[u.name]||"?")+'</div>'+u.name+'<b>'+Math.max(0,u.hp)+'</b>';return e}
function paint(e,h){e.querySelector("b").textContent=Math.max(0,h);if(h<=0)e.classList.add("dead")}
function show(id){["sb","td","hd"].forEach(s=>$(s).classList.toggle("hide",s!=id))}
function tab(w){stopLoop();H=null;show({s:"sb",t:"td",h:"td"}[w]);["S","T"].forEach(k=>$("t"+k).classList.toggle("on",k.toLowerCase()==w));if(w=="t")hardStart()}
$("tS").onclick=()=>tab("s");$("tT").onclick=()=>tab("t");

/* sandbox */
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

/* Todd Howard */
const MAX=460,PH=[
 {at:1,n:"PHASE 1",t:"SIXTEEN TIMES THE DETAIL",o:"So. You want to see it again. It’s the same game you already bought.",l:["Skyrim is on your fridge now. You’re welcome.","See that mountain? You can climb it. You won’t enjoy it.","We reused the engine. It has character.","That bug is a feature of the simulation."]},
 {at:.75,n:"PHASE 2",t:"IT JUST WORKS",o:"Don’t worry about the load order. It just works.",l:["Horse armor is back. Two dollars fifty.","We’re shipping it. We’ll patch the rest.","Day one update. Sixty gigabytes. Trust me.","Paid mods were always about supporting creators."]},
 {at:.5,n:"PHASE 3",t:"YOU'RE BREATHTAKING",o:"You’re breathtaking! Now buy the anniversary edition.",l:["Fus Ro Dah is a feature, not a bug.","I’m porting this fight to another platform mid-fight.","Sixteen times the detail. Sixteen times the damage.","Have you tried it on a smart fridge?"]},
 {at:.2,n:"FINAL PHASE",t:"IT. JUST. WORKS.",rage:1,o:"ENOUGH. IT JUST WORKS. IT JUST WORKS!",l:["FUS RO DAH! FUS RO DAH! BUY IT AGAIN!","SEE THAT MOUNTAIN? IT'S DLC NOW.","I AM THE LOAD ORDER.","WE'RE DOING IT AGAIN IN TWO YEARS."]}];
let T=null;
const pidx=hp=>{let p=0;PH.forEach((x,i)=>{if(hp/MAX<=x.at)p=i});return p};
function deck(){const k=[];D.forEach(d=>{const m=d[2]>=100?1:d[2]>=40?2:3;for(let i=0;i<m;i++)k.push({name:d[0],hp:d[2],max:d[2],atk:Math.max(2,Math.round(d[2]/4))})});
 for(let i=k.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[k[i],k[j]]=[k[j],k[i]]}return k}
function lg(t,c){const r=document.createElement("div");r.className=c||"";r.textContent=t;$("lg").prepend(r)}
function vig(c,a,ms){const v=document.createElement("div");v.className="sf";v.style.setProperty("--c",c);v.style.setProperty("--a",a);v.style.animationDuration=ms+"ms";document.body.appendChild(v);setTimeout(()=>v.remove(),ms)}
function flash(t){
 if(/^-\d/.test(t)){const d=document.createElement("div");d.className="dn";d.textContent=t;d.style.left=(36+Math.random()*24)+"%";document.body.appendChild(d);vig("#ff3b1f",.5,520);setTimeout(()=>d.remove(),1000);return}
 const k=/^(PHASE|FINAL)/.test(t)?["ph","New location discovered"]:t=="MINIGAME"?["mg","Speech challenge"]:t=="HOTFIX"?["hl","Hotfix deployed"]:["atk","Todd uses"];
 document.querySelectorAll(".fl").forEach(x=>x.remove());
 const e=document.createElement("div");e.className="fl "+k[0];e.innerHTML='<i class="tg"></i><b class="tx"></b>';e.firstChild.textContent=k[1];e.lastChild.textContent=t;document.body.appendChild(e);
 vig({ph:"#f2c230",mg:"#5ec8ff",hl:"#9fd3ff",atk:"#ff5a3c"}[k[0]],.5,750);setTimeout(()=>e.remove(),1700)}
function shake(){const e=$("td");e.classList.remove("shake");void e.offsetWidth;e.classList.add("shake")}
function toddStart(o){
 T={hard:!!o,hp:MAX,you:o?o.you:100,cost:20,credit:0,placed:false,over:false,busy:false,ph:0,deck:o?deck().concat(deck()):deck(),hand:[],board:[],min:[]};
 for(let i=0;i<3;i++)T.hand.push(T.deck.pop());
 $("lg").innerHTML="";$("end").classList.add("hide");$("ts").textContent=PH[0].o;
 lg("He has "+MAX+" health. Every 20 damage you deal buys a card.");lg("You have 100 health.");render()}
function render(){if(!T)return;const ph=PH[pidx(T.hp)];
 $("th").style.width=Math.max(0,T.hp/MAX*100)+"%";$("tn").textContent=Math.max(0,T.hp)+" / "+MAX;
 $("ph").textContent=ph.n+" - "+ph.t;gh(ph.t);$("tp").classList.toggle("rage",!!ph.rage);
 $("yh").style.width=Math.max(0,T.you)+"%";$("yn").textContent=Math.max(0,T.you)+" / 100";
 $("meta").innerHTML="Deck <b>"+T.deck.length+"</b> &nbsp; Draw cost <b>"+T.cost+"</b>";$("bk").style.width=Math.min(100,T.credit/T.cost*100)+"%";$("bn").textContent=T.credit+" / "+T.cost;
 $("tm").innerHTML="";T.min.forEach(u=>$("tm").appendChild(card(u,"en")));
 $("tb").innerHTML="";T.board.forEach((u,i)=>{const c=card(u,"me"),x=document.createElement("button");x.className="x";x.textContent="x";x.title="Retire card";x.onclick=()=>{if(T.busy||T.over)return;T.board.splice(i,1);render()};c.appendChild(x);$("tb").appendChild(c)});
 for(let i=T.board.length;i<4;i++){const s=document.createElement("div");s.className="slot";$("tb").appendChild(s)}
 $("th2").innerHTML="";T.hand.forEach((u,i)=>{const c=card(u,"me"),x=document.createElement("button");x.className="x";x.textContent="x";x.title="Discard";x.onclick=e=>{e.stopPropagation();if(T.busy||T.over)return;T.hand.splice(i,1);render()};c.onclick=()=>play1(i);c.appendChild(x);$("th2").appendChild(c)});
 $("bc").textContent=T.board.length+" / 4";$("hc").textContent=T.hand.length+" / 5";
 $("dr").disabled=T.over||T.busy||T.credit<T.cost||T.hand.length>=5||!T.deck.length;$("bell").disabled=T.over||T.busy}
function play1(i){if(!T||T.over||T.busy)return;if(T.board.length>=4)return lg("No room on the board.","r");if(T.placed)return lg("One card a turn. Ring the bell.","r");
 const c=T.hand.splice(i,1)[0];T.board.push(c);T.placed=true;lg(c.name+" takes the field. "+(QT[c.name]||""));render()}
$("dr").onclick=()=>{if(!T||T.credit<T.cost||T.hand.length>=5||!T.deck.length)return;T.credit-=T.cost;const c=T.deck.pop();T.hand.push(c);lg("Drew "+c.name+".","g");render()};
$("rs").onclick=$("eb").onclick=()=>T&&T.hard?hardStart():toddStart();
function hurt(n,why){T.you-=n;shake();lg(why+" hit YOU for "+n+".","r")}
function hit(n,why){const a=T.board.filter(c=>c.hp>0);if(!a.length)return hurt(n,why);const c=R(a);c.hp=Math.max(0,c.hp-n);shake();lg(why+(c.hp<=0?" destroyed your ":" hit your ")+c.name+" for "+n+".","r")}
function hitAll(n,why){T.board.forEach(c=>c.hp=Math.max(0,c.hp-n));shake();lg(why+" hit everything you had for "+n+".","r")}
function game(){return new Promise(res=>{
 const z=18+Math.random()*50,w=14;$("gz").style.left=z+"%";$("gz").style.width=w+"%";$("gn").textContent="";$("gm").classList.remove("hide");
 let at=0,dir=1;const iv=setInterval(()=>{at+=dir*1.7;if(at>=100){at=100;dir=-1}if(at<=0){at=0;dir=1}$("gp").style.left=at+"%"},16);
 const done=(won,t)=>{clearInterval(iv);clearTimeout(to);$("gb").onclick=null;$("gn").textContent=t;setTimeout(()=>{$("gm").classList.add("hide");res(won)},800)};
 $("gb").onclick=()=>{const h=at>=z&&at<=z+w;done(h,h?"Doubted correctly.":"You doubted the wrong part.")};
 const to=setTimeout(()=>done(false,"You said nothing. He took that as agreement."),5500)})}
async function bell(){
 if(!T||T.over||T.busy)return;T.busy=true;render();let dealt=0;
 for(const c of T.board.filter(c=>c.hp>0)){
  if(T.min.length){const m=T.min[0];m.hp-=c.atk;lg("Your "+c.name+(m.hp<=0?" broke his ":" hit ")+m.name+".","g");if(m.hp<=0)T.min.shift()}
  else{T.hp-=c.atk;dealt+=c.atk;lg("Your "+c.name+" hit Todd for "+c.atk+".","g")}
  render();await W(220)}
 T.credit+=dealt;T.placed=false;
 if(T.hp<=0){T.hp=0;return finish(true)}
 const p=pidx(T.hp),ph=PH[p];
 if(p!=T.ph){T.ph=p;$("ts").textContent=ph.o;lg("-- "+ph.n+": "+ph.t+" --","p");flash(ph.n);shake();render();await W(900)}
 else $("ts").textContent=R(ph.l);
 await W(300);await act(p);
 T.board=T.board.filter(c=>c.hp>0);
 if(T.you<=0){T.you=0;return finish(false)}
 T.busy=false;render()}
$("bell").onclick=bell;
async function act(p){
 if(T.hard?Math.random()<.45:p>=2&&Math.random()<.5){flash("MINIGAME");$("ts").textContent="Let’s make this interesting. Earn it.";
  await W(900);if(await game()){T.credit+=15;lg("You cleared it and banked 15 damage.","g")}else hurt(T.hard?16:p==3?20:14,"Failing his minigame");
  render();if(T.you<=0)return;await W(300)}
 const sw=[1,1,2,3][p]+(T.hard?1:0);
 for(let i=0;i<sw&&T.you>0;i++){const r=Math.random();
  if(p==0){flash("PATCH NOTES");if(r<.25){T.deck.splice(Math.max(0,T.deck.length-2),2);lg("A patch note took 2 cards off your deck.","r")}else hit(14,"A quiet patch note")}
  else if(p==1){if(r<.3){T.hp=Math.min(MAX,T.hp+22);lg("Todd shipped a hotfix and healed 22.","r");flash("HOTFIX")}else if(r<.5){T.cost+=5;flash("CREATION CLUB");lg("Cards now cost "+T.cost+" damage to draw.","r")}else{flash("DAY ONE UPDATE");hit(11,"Day one update");hit(11,"Day one update")}}
  else if(p==2){if(r<.34){flash("16x THE DETAIL");hitAll(11,"Sixteen times the detail")}else if(r<.67&&T.min.length<2){T.min.push({name:"Skyrim Port",hp:50,max:50,atk:11});lg("Todd ported Skyrim onto the board.","r");flash("PORT")}else{flash("SEASON PASS");hit(18,"A season pass")}}
  else{if(r<.35){flash("IT JUST WORKS");hitAll(15,"IT JUST WORKS")}else if(r<.7&&T.board.some(c=>c.hp>0)){const c=R(T.board.filter(c=>c.hp>0));c.hp=0;flash("DELISTED");lg("Todd delisted your "+c.name+" outright.","r")}else{flash("REMASTER");hit(22,"A remaster")}}
  T.board=T.board.filter(c=>c.hp>0);render();await W(500)}
 for(const m of T.min){if(T.you<=0)break;hit(m.atk,m.name);T.board=T.board.filter(c=>c.hp>0);render();await W(250)}}
function finish(win){T.over=true;T.busy=false;render();if(T.hard)return win?hardNext(T.you):hardLose("He out-detailed you at cards");
 $("et").textContent=win?"It didn’t just work.":"Hey, you. You’re finally awake.";
 $("ee").textContent=win?"Todd Howard is down. Take the win. He’ll re-release it anyway.":"You are down. He suggests trying it on a smart fridge.";
 $("end").className="ov "+(win?"win":"lose")}

/* hard mode: cards, then shooter, then two dodge rounds */
const FACE=new Image();FACE.src=$("tf").src;
const cv=$("cv"),g=cv.getContext("2d"),CW=640,CH=400,M={x:320,y:300};
let H=null,raf=0;
const stopLoop=()=>cancelAnimationFrame(raf);
function hbars(){if(!H)return;const gt=["","","HE’S COMING FOR YOU","HOLD STILL","THE LEFT HALF IS DLC"][H.p]||"";gh(gt);$("hy").style.width=Math.max(0,H.you)+"%";$("hn").textContent="Phase "+H.p+" of 4  |  "+Math.max(0,Math.round(H.you))+" / 100"}
function hardStart(){stopLoop();H={p:1,you:100,over:false};show("td");["S","T"].forEach(k=>$("t"+k).classList.toggle("on",k=="T"));toddStart({you:100})}
function hardHurt(n,why){if(!H||H.over)return;H.you-=n;flash("-"+n);shake();hbars();if(H.you<=0)hardLose(why)}
function hardLose(why){H.over=true;stopLoop();$("et").textContent="Hey, you. You’re finally awake.";$("ee").textContent=why;$("end").className="ov lose"}
function hardWin(){H.over=true;stopLoop();$("et").textContent="It didn’t just work.";$("ee").textContent="You beat Todd Howard with "+Math.round(H.you)+" health left.";$("end").className="ov win"}
function hardNext(y){H.you=Math.min(100,y+(H.p>1?18:0));H.p++;stopLoop();show("hd");hbars();
 if(H.p==2)shoot();else if(H.p==3)dodge(25000,1);else if(H.p==4)dodge(25000,1.7);else return hardWin();flash("PHASE "+H.p)}
function loop(){stopLoop();const f=()=>{if(!H||H.over)return;const p=H.p;H.mode=="s"?fs():fd();hbars();if(H&&!H.over&&H.p==p)raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f)}
function cross(){g.strokeStyle="#f2c230";g.beginPath();g.arc(M.x,M.y,14,0,6.3);g.moveTo(M.x-22,M.y);g.lineTo(M.x+22,M.y);g.moveTo(M.x,M.y-22);g.lineTo(M.x,M.y+22);g.stroke()}
function shoot(){H.s={k:0,clip:6,rl:0,t:[],sp:40};H.mode="s";$("hq").textContent="Click him before he reaches you. A head shot drops anything and refunds the round. R reloads. Down 15.";loop()}
function reload(){const s=H&&H.s;if(H&&H.mode=="s"&&!s.rl&&s.clip<6)s.rl=50}
function fire(){const s=H.s;if(s.rl)return;if(s.clip<=0)return reload();s.clip--;let b=null;
 s.t.forEach(t=>{if(M.x>=t.x-t.z/2&&M.x<=t.x+t.z/2&&M.y>=t.y-t.z&&M.y<=t.y&&(!b||t.y>b.y))b=t});if(!b)return;
 const head=M.y<b.y-b.z*.66;b.hp=head?0:b.hp-1;if(head)s.clip=Math.min(6,s.clip+1);
 if(b.hp<=0){s.t.splice(s.t.indexOf(b),1);s.k++;if(s.k>=15)hardNext(H.you)}}
function fs(){const s=H.s;g.fillStyle="#0b0f13";g.fillRect(0,0,CW,CH);g.strokeStyle="rgba(242,194,48,.15)";
 for(let i=0;i<=12;i++){g.beginPath();g.moveTo(CW*i/12,CH);g.lineTo(CW/2,150);g.stroke()}
 if(s.rl&&--s.rl==0)s.clip=6;
 if(--s.sp<=0){if(s.t.length<2+Math.floor(s.k/5)){s.t.push({x:60+Math.random()*520,y:150,v:.5+Math.random()*.4+s.k*.03,hp:Math.random()<.25?3:1,z:30});s.sp=60}else s.sp=15}
 for(const t of s.t.slice()){t.y+=t.v;t.z=30+(t.y-150)*.6;
  if(t.y>CH-8){s.t.splice(s.t.indexOf(t),1);hardHurt(10,"He reached you");if(H.over)return;continue}
  g.drawImage(FACE,t.x-t.z/2,t.y-t.z,t.z,t.z);if(t.hp>1){g.strokeStyle="#ff5a3c";g.strokeRect(t.x-t.z/2,t.y-t.z,t.z,t.z)}}
 cross();g.fillStyle="#e6e9ec";g.font="14px monospace";g.fillText("DOWN "+s.k+"/15   "+(s.rl?"RELOADING":"AMMO "+"|".repeat(s.clip)),10,20)}
function dodge(ms,k){H.d={x:320,y:300,orbs:[],ring:[],beam:[],end:Date.now()+ms,k:k,a:50,b:150,c:240,gr:0};H.mode="d";
 $("hq").textContent=H.p==4?"THE LEFT HALF IS DLC NOW. Survive. Move with the mouse or your finger.":"Hold still. This is the part we playtested. Move with the mouse or your finger.";loop()}
function fd(){const d=H.d,left=d.end-Date.now();g.fillStyle="#07090c";g.fillRect(0,0,CW,CH);if(left<=0)return hardNext(H.you);
 d.x+=(M.x-d.x)*.2;d.y+=(M.y-d.y)*.2;if(d.gr>0)d.gr--;
 const hit=(n,w)=>{if(d.gr>0)return;d.gr=45;hardHurt(n,w)};
 if(--d.a<=0){d.orbs.push({x:Math.random()<.5?0:CW,y:Math.random()*CH,vx:0,vy:0,l:420});d.a=Math.round(55/d.k)}
 if(--d.b<=0){const cx=100+Math.random()*440,cy=60+Math.random()*160;for(let i=0;i<14;i++){const a=i/14*6.283;d.ring.push({x:cx,y:cy,vx:Math.cos(a)*2.6*d.k,vy:Math.sin(a)*2.6*d.k,l:300})}d.b=Math.round(200/d.k)}
 if(--d.c<=0){d.beam.push({y:40+Math.random()*320,ch:70,f:30});d.c=Math.round(290/d.k)}
 g.fillStyle="#5ec8ff";d.orbs.forEach(o=>{const dx=d.x-o.x,dy=d.y-o.y,n=Math.hypot(dx,dy)||1;o.vx=(o.vx+dx/n*.07)*.985;o.vy=(o.vy+dy/n*.07)*.985;o.x+=o.vx;o.y+=o.vy;o.l--;g.beginPath();g.arc(o.x,o.y,7,0,6.3);g.fill();if(n<18){o.l=0;hit(9,"A homing bug found you")}});
 d.orbs=d.orbs.filter(o=>o.l>0);
 g.fillStyle="#f2c230";d.ring.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.l--;g.beginPath();g.arc(b.x,b.y,4,0,6.3);g.fill();if(Math.hypot(b.x-d.x,b.y-d.y)<13){b.l=0;hit(7,"Caught in the patch notes")}});
 d.ring=d.ring.filter(b=>b.l>0&&b.x>-10&&b.x<CW+10&&b.y>-10&&b.y<CH+10);
 d.beam.forEach(m=>{if(m.ch>0){m.ch--;g.strokeStyle="rgba(255,111,94,.6)";g.setLineDash([8,6]);g.beginPath();g.moveTo(0,m.y);g.lineTo(CW,m.y);g.stroke();g.setLineDash([])}else{m.f--;g.fillStyle="rgba(255,230,210,.9)";g.fillRect(0,m.y-14,CW,28);if(Math.abs(d.y-m.y)<20)hit(13,"The re-release swept through you")}});
 d.beam=d.beam.filter(m=>m.ch>0||m.f>0);
 g.save();if(d.gr>0&&d.gr%8<4)g.globalAlpha=.35;g.drawImage(FACE,d.x-20,d.y-20,40,40);g.restore();
 g.fillStyle="#e6e9ec";g.font="14px monospace";g.fillText("SURVIVE "+(left/1000).toFixed(1)+"s",10,20)}
cv.onpointermove=cv.onpointerdown=e=>{const r=cv.getBoundingClientRect();M.x=(e.clientX-r.left)/r.width*CW;M.y=(e.clientY-r.top)/r.height*CH;if(e.type=="pointerdown"&&H&&H.mode=="s"&&!H.over)fire()};
addEventListener("keydown",e=>{if(e.key=="r"||e.key=="R")reload()});
$("hr").onclick=reload;$("hx").onclick=()=>tab("s");
/* audio */
let AC=null,yp=null,ytOK=false,mode=null,aon=true,tim=0;
const SCALE=[0,3,5,7,10,12,15,17];
function note(f,t,d,ty,v){const o=AC.createOscillator(),a=AC.createGain();o.type=ty;o.frequency.value=f;a.gain.setValueAtTime(v,t);a.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(a);a.connect(AC.destination);o.start(t);o.stop(t+d+.02)}
function sfx(f,d,ty,v){if(!aon||!AC)return;try{note(f,AC.currentTime,d,ty||"square",v||.08)}catch(e){}}
function tick(){if(!aon||!mode||!AC)return;const p=(typeof H!=="undefined"&&H)?H.p:1,bpm=mode=="t"?120:[128,136,148,164][Math.min(3,p-1)],sp=60/bpm/2,t=AC.currentTime+.05,root=mode=="t"?110:98;
 for(let i=0;i<8;i++){const f=root*Math.pow(2,[0,0,3,5,0,7,5,3][i]/12);note(f,t+i*sp,sp*.9,"sawtooth",.05);if(i%2==0)note(f*2,t+i*sp,sp*.5,"square",.025);if(Math.random()<.6)note(root*4*Math.pow(2,SCALE[Math.floor(Math.random()*8)]/12),t+i*sp,sp*.7,"triangle",.03)}
 for(let i=0;i<4;i++)note(60,t+i*sp*2,.12,"sine",.12);
 tim=setTimeout(tick,sp*8*1000-100)}
function music(m){mode=m;clearTimeout(tim);if(!aon)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume()}catch(e){return}
 if(ytOK){try{yp.loadVideoById("PybNVFzlkow");yp.setVolume(60);yp.playVideo();return}catch(e){ytOK=false}}
 ytStatus()}
function ytStatus(){if(!ytOK&&aon)$("au").textContent="AUDIO: OFFLINE"}
function musicStop(){mode=null;clearTimeout(tim);if(ytOK)try{yp.stopVideo()}catch(e){}}
window.onYouTubeIframeAPIReady=()=>{try{yp=new YT.Player("yt",{height:"1",width:"1",playerVars:{playsinline:1},events:{onReady:()=>{ytOK=true;$("au").textContent="AUDIO: ON";if(aon&&mode)music(mode)},onError:()=>{ytOK=false;ytStatus()},onStateChange:e=>{if(e.data===0&&mode){try{yp.seekTo(0,true);yp.playVideo()}catch(x){}}}}})}catch(e){}};
try{const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";s.onerror=()=>{};document.head.appendChild(s)}catch(e){}
$("au").onclick=()=>{aon=!aon;$("au").textContent="AUDIO: "+(aon?"ON":"OFF");$("au").setAttribute("aria-pressed",aon);if(!aon){clearTimeout(tim);if(ytOK)try{yp.pauseVideo()}catch(e){}}else if(mode)music(mode)};
const _ts=toddStart;toddStart=function(o){_ts(o);music(o?"h":"t")};
const _hl=hardLose;hardLose=function(w){_hl(w);musicStop();sfx(90,.5,"sawtooth",.12)};
const _hw=hardWin;hardWin=function(){_hw();musicStop();sfx(660,.4,"triangle",.1)};
const _fin=finish;finish=function(w){_fin(w);if(!T.hard)musicStop()};
const _tb=tab;tab=function(w){_tb(w);if(w=="s"){musicStop();gh("")}};
const _hh=hardHurt;hardHurt=function(n,w){_hh(n,w);sfx(120,.2,"square",.1)};
const _fi=fire;fire=function(){_fi();sfx(900,.06,"square",.06)};

(function(){const e=$("em");for(let i=0;i<70;i++){const s=document.createElement("i");s.style.left=Math.random()*100+"%";s.style.top="-4%";s.style.width=s.style.height=(1+Math.random()*3)+"px";s.style.animationDuration=(8+Math.random()*10)+"s";s.style.animationDelay=(-Math.random()*14)+"s";e.appendChild(s)}})();
$("cmpt").textContent="N   ·   TODD HOWARD ◆   ·   NE   ·   YOUR FRIDGE ◆   ·   E   ·   SE   ·   CHEESE WHEEL ◆   ·   S   ·   ANOTHER SETTLEMENT ◆   ·   SW   ·   YOUR WATCH ◆   ·   W   ·   NW   ·   ".repeat(6);
const TIPS=["Did you know? Skyrim is also available on your smart fridge.","It just works.","Sixteen times the detail. Zero times the fixes.","Fus Ro Dah can launch a cheese wheel into orbit.","Paid mods are about supporting creators.","Horse armor is only two dollars fifty. Again.","Every NPC in the world can be crushed by a bucket.","Starfield has over a thousand planets. Most of them are empty.","Fallout 76 is now fully working. Probably.","Remember to buy Skyrim again.","Tip: save often. The game will not.","You can now play Skyrim on your watch. You should not."];
function tipNow(){const e=$("lts");e.style.opacity=0;setTimeout(()=>{e.textContent=R(TIPS);e.style.opacity=1},500)}
$("lts").textContent=R(TIPS);setInterval(tipNow,9000);
function cheese(){const c=document.createElement("div");c.className="cw";c.textContent="\u{1F9C0}";document.body.appendChild(c);setTimeout(()=>c.remove(),9200)}
setTimeout(cheese,5000);setInterval(cheese,28000);
$("tf").onclick=()=>{if(T)lg("Todd Howard took an arrow to the knee. He is now a guard.","g")};
