const HARD_MUSIC_ID="2dPaVk4G1jg";
const HARD_SEEK={1:0,2:53,3:77,4:77};
const HARD_ASSETS="assets/hardmode/";
const HARD_YOU_MAX=100;
const HARD_SHOOT_KILLS=20;
const HARD_SHOOT_KINDS=[
{k:"walker",hp:1,speed:0.00085,scale:1.00,drift:0.0013,bite:10,tint:"#ffb642",early:5,late:2,says:"He walked in"},
{k:"runner",hp:1,speed:0.00215,scale:0.74,drift:0.0005,bite:8,tint:"#7ec8f0",early:1,late:4,says:"One of them sprinted"},
{k:"tank",hp:3,speed:0.00042,scale:1.50,drift:0.0008,bite:22,tint:"#ff7a63",early:0,late:3,says:"The big one reached you"},
{k:"weaver",hp:1,speed:0.00098,scale:0.94,drift:0.0068,bite:11,tint:"#c79bf0",early:1,late:4,says:"The weaving one got through"},
{k:"shouter",hp:2,speed:0.00072,scale:1.12,drift:0.0010,bite:14,tint:"#ffd79a",early:0,late:3,says:"He got his word in"}];
const HARD_SHOOT_MAX_UP=2;
const HARD_SHOOT_MAX_UP_LATE=4;
const HARD_SHOUT_AT=0.72;
const HARD_SHOUT_WIND=115;
const HARD_SHOUT_HURT=18;
const HARD_HEAD_BAND=0.34;
const HARD_SHOOT_CLIP=6;
const HARD_DODGE_MS=62000;
const HARD_CHESS_MS=180000;
const HARD_CHESS_DEPTH=1;
const HARD_CHESS_SLIP=0.55;
const HARD_CHESS_SLIP_CP=320;
const HARD_PIECE_ART={"1":"LightPawn.webp","2":"LightKnight.webp","3":"LightBishop.webp","4":"LightRook.webp","5":"skyrimqueen.jpg","6":"../Todd.png","-1":"DarkPawn.webp","-2":"DarkKnight.webp","-3":"DarkBishop.webp","-4":"DarkRook.webp","-5":"DarkQueen.webp","-6":"DarkKing.webp"};
const HARD_PIECE_GLYPH={"1":"♙","2":"♘","3":"♗","4":"♖","5":"♕","6":"♔","-1":"♟","-2":"♞","-3":"♝","-4":"♜","-5":"♛","-6":"♚"};

let hard=null,hardRaf=0,hardKit=null,hardMusicPoll=0,hardFade=0;
const hardArt={chess:false};
(function(){const i=new Image();i.onload=()=>{hardArt.chess=true};i.src=HARD_ASSETS+"chess/DarkPawn.webp"})();
const hardImages={};
function hardImage(src){if(!hardImages[src]){const i=new Image();i.src=src;hardImages[src]=i}return hardImages[src]}
const hardReady=i=>i&&i.complete&&i.naturalWidth;

function hardShootPick(progress){let total=0;
const weights=HARD_SHOOT_KINDS.map(k=>{const w=Math.max(0,k.early+(k.late-k.early)*progress);total+=w;return w});
let roll=Math.random()*total;
for(let i=0;i<HARD_SHOOT_KINDS.length;i++){roll-=weights[i];if(roll<=0)return HARD_SHOOT_KINDS[i]}
return HARD_SHOOT_KINDS[0]}

function hardSound(){if(hardKit)return hardKit;
const files={};["hit","shout"].forEach(n=>{const a=new Audio(HARD_ASSETS+"sfx/"+n+".ogg");a.preload="auto";a.volume=.7;files[n]=a});
hardKit={files:files};return hardKit}
function hardPlayFile(name){const a=hardSound().files[name];if(!a||!aon)return false;if(!a.duration&&a.readyState<2)return false;
try{a.currentTime=0;a.play().catch(()=>{});return true}catch(e){return false}}
function hardBeep(shape,from,to,ms,gain,delay){const ctx=ac();if(!ctx||!aon)return;const t0=ctx.currentTime+(delay||0);
const osc=ctx.createOscillator(),amp=ctx.createGain();osc.type=shape;
osc.frequency.setValueAtTime(from,t0);osc.frequency.exponentialRampToValueAtTime(Math.max(20,to),t0+ms/1000);
amp.gain.setValueAtTime(.0001,t0);amp.gain.exponentialRampToValueAtTime(gain,t0+.012);amp.gain.exponentialRampToValueAtTime(.0001,t0+ms/1000);
osc.connect(amp).connect(ctx.destination);osc.start(t0);osc.stop(t0+ms/1000+.05)}
function hardNoise(ms,gain,cutoff,delay){const ctx=ac();if(!ctx||!aon)return;const t0=ctx.currentTime+(delay||0);
const frames=Math.floor(ctx.sampleRate*(ms/1000)),buf=ctx.createBuffer(1,frames,ctx.sampleRate),d=buf.getChannelData(0);
for(let i=0;i<frames;i++)d[i]=(Math.random()*2-1)*(1-i/frames);
const src=ctx.createBufferSource();src.buffer=buf;
const fl=ctx.createBiquadFilter();fl.type="lowpass";fl.frequency.setValueAtTime(cutoff,t0);fl.frequency.exponentialRampToValueAtTime(Math.max(80,cutoff/6),t0+ms/1000);
const amp=ctx.createGain();amp.gain.setValueAtTime(gain,t0);amp.gain.exponentialRampToValueAtTime(.0001,t0+ms/1000);
src.connect(fl).connect(amp).connect(ctx.destination);src.start(t0)}
function hardSfxHit(){if(hardPlayFile("hit"))return;hardBeep("square",420,60,220,.22);hardNoise(180,.2,2200)}
function hardSfxShout(){if(hardPlayFile("shout"))return;hardBeep("sawtooth",150,42,700,.3);hardNoise(900,.33,900);hardBeep("sawtooth",90,30,900,.22,.12)}
function hardSfxShot(){hardBeep("square",900,180,70,.12);hardNoise(60,.1,5000)}
function hardSfxKill(){hardBeep("triangle",300,900,130,.14)}
function hardSfxClick(){hardBeep("sine",660,880,60,.08)}

function hardMusicReady(){return ytOK&&yp&&typeof yp.loadVideoById==="function"}
function hardVolumeTo(target,ms,then){
if(!hardMusicReady()){if(then)then();return}
clearInterval(hardFade);let now=100;try{now=yp.getVolume()}catch(e){}
const steps=Math.max(1,Math.round(ms/40));let step=0;
hardFade=setInterval(()=>{step++;const v=now+(target-now)*(step/steps);
try{yp.setVolume(Math.max(0,Math.min(100,Math.round(v))))}catch(e){}
if(step>=steps){clearInterval(hardFade);if(then)then()}},40)}
function hardMusicPhase(phase,immediate){if(!hardMusicReady()||!aon)return;
const at=HARD_SEEK[phase]||0;
const jump=()=>{try{yp.seekTo(at,true);yp.playVideo()}catch(e){}hardVolumeTo(100,immediate?150:900)};
if(immediate)jump();else hardVolumeTo(0,500,jump)}
function hardMusicStart(phase){
if(!hardMusicReady()){ytStatus();return}
if(!aon)return;
try{yp.loadVideoById(HARD_MUSIC_ID,HARD_SEEK[phase||1]);yp.setPlaybackRate(1);yp.setVolume(100);yp.playVideo()}catch(e){return}
clearInterval(hardMusicPoll);
hardMusicPoll=setInterval(()=>{if(!hard||!hardMusicReady())return;
try{const dur=yp.getDuration(),at=yp.getCurrentTime();if(dur>1&&at>dur-.6)yp.seekTo(HARD_SEEK[hard.phase]||0,true)}catch(e){}},500)}
function hardMusicStop(){clearInterval(hardMusicPoll);clearInterval(hardFade);hardMusicPoll=0;
if(!hardMusicReady())return;try{yp.stopVideo();yp.setVolume(100)}catch(e){}}

function hardShake(){shake()}
function hardFlash(tone){vig(tone==="gold"?"#ffd43b":"#ff3b1f",.5,700)}
function hardGlitch(ms){const m=document.querySelector("main");m.classList.remove("soft");void m.offsetWidth;m.classList.add("soft");setTimeout(()=>m.classList.remove("soft"),ms||500)}
function hardFloat(text,tone,x,y){const box=$("hfl");if(!box)return;
const t=document.createElement("span");t.className="hfl-i hfl-"+tone;t.textContent=text;
t.style.left=(x!==undefined?x:50)+"%";t.style.top=(y!==undefined?y:50)+"%";box.appendChild(t);setTimeout(()=>t.remove(),1100)}
function hardBanner(big,small,kind,tag){flash(big,tag||"Todd Howard says",kind||"atk",small||"")}
function hardSay(line){$("hq").textContent=line;$("ts").textContent=line}
function hardLog(line,tone){const box=$("hlg");if(!box)return;
const row=document.createElement("div");row.className=tone||"";row.textContent=line;box.prepend(row);
while(box.childElementCount>60)box.lastChild.remove()}
function hardHurt(amount,why){if(!hard||hard.over)return;
hard.you-=amount;hardSfxHit();flash("-"+amount);shake();hardLog(why+"  (-"+amount+")","r");hardPaintBars();
if(hard.you<=0)hardLose(why)}
function hardPaintBars(){if(!hard)return;
const frac=Math.max(0,hard.you/HARD_YOU_MAX),f=$("hy");
f.style.width=(frac*100)+"%";f.className=frac<.25?"hf-dire":frac<.55?"hf-warn":"hf-ok";
$("hn").textContent="Phase "+hard.phase+" of 4  |  "+Math.max(0,Math.round(hard.you))+" / "+HARD_YOU_MAX;
if(hard.phase>=2)gh(["","","HE’S COMING FOR YOU","HOLD STILL","IT. JUST. WORKS."][hard.phase]||"")}

function hardShow(which){["hcw","hch"].forEach(id=>$(id).classList.toggle("hide",id!==which));
$("hr").classList.toggle("hide",which!=="hcw"||!hard||hard.phase!==2)}
function setTab(t){["S","T"].forEach(k=>$("t"+k).classList.toggle("on",k===t))}
function hardStop(){cancelAnimationFrame(hardRaf);hardRaf=0;
if(hard){clearInterval(hard.tick);clearInterval(hard.clock);hard.tick=0;hard.clock=0}
const cv=$("cv");cv.onpointermove=null;cv.onpointerdown=null;window.onkeydown=null;window.onkeyup=null}
function hardStart(){hardStop();
hard={phase:1,you:HARD_YOU_MAX,over:false,tick:0,clock:0,advancing:false};
$("end").className="ov hide";$("hlg").innerHTML="";$("hq").textContent="";
hardSound();setTab("T");show("td");hardPaintBars();hardMusicStart(1);
hardLog("-- HARD MODE. One health bar for all four phases. --","p");
hardPhase1()}
function hardQuit(){hardStop();hard=null;T=null;hardMusicStop();gh("");$("end").className="ov hide"}

function hardWin(){if(!hard||hard.over)return;
hard.over=true;hardStop();hardShow("");
$("et").textContent="It didn’t just work.";
$("ee").textContent="You beat Todd Howard with "+Math.max(0,Math.round(hard.you))+" health left. He will re-release it anyway.";
$("end").className="ov win";hardFlash("gold");hardBeep("triangle",660,990,400,.1);
hardLog("-- HARD MODE CLEARED --","p");
hardVolumeTo(0,1800,hardMusicStop)}
function hardLose(why){if(!hard||hard.over)return;
hard.over=true;hardStop();hardShow("");
$("et").textContent="War never changes.";
$("ee").textContent=why||"You are down. Back to phase one.";
$("end").className="ov lose";hardShake();
hardLog("-- YOU ARE DOWN. Back to phase one. --","p");
hardVolumeTo(0,1400,hardMusicStop)}

function hardWipe(then){const c=$("hwipe");
c.classList.remove("hwipe-go");void c.offsetWidth;c.classList.add("hwipe-go");
setTimeout(()=>{if(then)then()},420);setTimeout(()=>c.classList.remove("hwipe-go"),900)}
function hardNextPhase(){if(!hard||hard.over||hard.advancing)return;
hard.advancing=true;hardStop();hard.phase++;
const back=Math.min(18,HARD_YOU_MAX-hard.you);
if(back>0){hard.you+=back;hardLog("You patch yourself up for "+back+".","g")}
hardPaintBars();hardMusicPhase(hard.phase);
hardWipe(()=>{if(!hard||hard.over)return;hard.advancing=false;
if(hard.phase===2)hardPhase2();else if(hard.phase===3)hardPhase3();else if(hard.phase===4)hardPhase4();else hardWin()})}

function hardPhase1(){show("td");
hardBanner("PHASE 1","SIXTEEN TIMES THE DETAIL","ph","New location discovered");
hardLog("Phase 1: the card fight, atoms on from turn one.","p");
toddStart({you:hard.you})}
function hardPhase1Done(carried){if(!hard||hard.over)return;
if(carried!==undefined)hard.you=carried;hardPaintBars();
hardLog("Phase 1 cleared with "+Math.max(0,Math.round(hard.you))+" health left.","g");
hardNextPhase()}
function hardPhase1Lost(){if(!hard||hard.over)return;
hard.you=0;hardPaintBars();hardLose("He out-detailed you at cards")}

function hardFitCanvas(c){const w=c.clientWidth,h=c.clientHeight;if(c.width!==w)c.width=w;if(c.height!==h)c.height=h;return c.width}
function hardPointer(cv,s,ev){const r=cv.getBoundingClientRect();s.mx=(ev.clientX-r.left)/r.width;s.my=(ev.clientY-r.top)/r.height}

function hardPhase2(){show("hd");hardShow("hcw");
const cv=$("cv");
hardBanner("PHASE 2","IT JUST WORKS","ph","New location discovered");
hardSay("I'm coming to tell you about the engine.");
$("hq").textContent="Click him before he reaches you. Aim high: a head shot drops anything and refunds the round. R reloads. Down "+HARD_SHOOT_KILLS+".";
hardLog("Phase 2: "+HARD_SHOOT_KILLS+" of him, five sorts. R reloads.","p");
hardLog("Hit him high and he goes down whatever he is, and you get the round back.","p");
hardLog("The pale one winds up a shout if you let it stop. Deal with that one first.","p");
hard.shoot={kills:0,clip:HARD_SHOOT_CLIP,reloading:0,heads:0,done:false,todds:[],shots:[],sparks:[],spawnIn:50,mx:.5,my:.5};
cv.style.cursor="none";
cv.onpointermove=ev=>hardPointer(cv,hard.shoot,ev);
cv.onpointerdown=ev=>{hardPointer(cv,hard.shoot,ev);hardShootFire()};
window.onkeydown=ev=>{if(!hard||hard.phase!==2)return;if(ev.key==="r"||ev.key==="R")hardShootReload()};
hardShow("hcw");
hardRaf=requestAnimationFrame(hardShootFrame)}

function hardShootReload(){const s=hard&&hard.shoot;
if(!s||hard.phase!==2||s.reloading>0||s.clip>=HARD_SHOOT_CLIP)return;
s.reloading=52;hardSfxClick()}

function hardShootFire(){const s=hard&&hard.shoot;
if(!s||hard.over||s.done||hard.phase!==2)return;
if(s.reloading>0)return;
if(s.clip<=0){hardShootReload();return}
s.clip--;hardSfxShot();hardShake();
s.shots.push({x:s.mx,y:s.my,life:10});
const cv=$("cv"),mx=s.mx*cv.width,my=s.my*cv.height;
let hitIndex=-1,bestDist=Infinity;
s.todds.forEach((t,i)=>{if(!t.box)return;
const pad=t.box.w*.08;
if(mx<t.box.x-pad||mx>t.box.x+t.box.w+pad)return;
if(my<t.box.y-pad||my>t.box.y+t.box.h+pad)return;
const cx=t.box.x+t.box.w/2,cy=t.box.y+t.box.h/2,d=Math.hypot(mx-cx,my-cy);
if(d<bestDist){bestDist=d;hitIndex=i}});
if(hitIndex<0)return;
const t=s.todds[hitIndex],head=my<=t.box.y+t.box.h*HARD_HEAD_BAND;
if(head){t.hp=0;s.heads++;s.clip=Math.min(HARD_SHOOT_CLIP,s.clip+1);
hardFloat("SIXTEEN TIMES THE DETAIL","warn",t.x*100,(t.box.y/cv.height)*100)}
else t.hp--;
const hitY=(t.box.y+t.box.h/2)/cv.height;
for(let i=0;i<12;i++)s.sparks.push({x:t.x,y:hitY,life:18+Math.random()*14,vx:(Math.random()-.5)*.02,vy:(Math.random()-.5)*.02});
if(t.hp<=0){s.todds.splice(hitIndex,1);s.kills++;hardSfxKill();
if(!head)hardFloat("IT JUST WORKS","good",t.x*100,hitY*100);
if(s.kills>=HARD_SHOOT_KILLS&&!s.done){s.done=true;hardLog("Phase 2 cleared.","p");setTimeout(hardNextPhase,500)}}}

function hardShootFrame(){if(!hard||hard.over||hard.phase!==2)return;
const cv=$("cv"),s=hard.shoot;if(!cv||!s)return;
const w=hardFitCanvas(cv),h=cv.height,g=cv.getContext("2d");
g.fillStyle="#030a06";g.fillRect(0,0,w,h);
g.strokeStyle="rgba(61,255,138,.14)";g.lineWidth=1;
for(let i=0;i<=12;i++){g.beginPath();g.moveTo(w*(i/12),h);g.lineTo(w*.5,h*.42);g.stroke()}
for(let i=1;i<7;i++){const y=h*.42+(h*.58)*Math.pow(i/7,2.2);g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
if(s.reloading>0)s.reloading--;
if(s.reloading===1){s.clip=HARD_SHOOT_CLIP;hardSfxClick()}
const progress=Math.min(1,s.kills/HARD_SHOOT_KILLS);
const maxUp=Math.round(HARD_SHOOT_MAX_UP+(HARD_SHOOT_MAX_UP_LATE-HARD_SHOOT_MAX_UP)*progress);
if(s.done){}
else if(--s.spawnIn<=0&&s.todds.length<maxUp){const kind=hardShootPick(progress);
s.todds.push({kind:kind,x:.14+Math.random()*.72,y:.44+Math.random()*.03,size:.05,speed:kind.speed*(.9+Math.random()*.25),hp:kind.hp,sway:Math.random()*6.28,wind:0});
s.spawnIn=Math.max(46,104-Math.round(progress*52))}
else if(s.spawnIn<=0)s.spawnIn=14;
s.todds.forEach(t=>{const kind=t.kind||HARD_SHOOT_KINDS[0],winding=(kind.k==="shouter"&&t.y>=HARD_SHOUT_AT);
if(winding){t.wind++;
if(t.wind===1)hardSfxClick();
if(t.wind===HARD_SHOUT_WIND-26)hardSfxShout();
if(t.wind>=HARD_SHOUT_WIND){t.dead=true;hardShake();hardGlitch(420);hardHurt(HARD_SHOUT_HURT,kind.says)}}
else{t.y+=t.speed;t.sway+=(kind.k==="weaver")?.11:.06;t.x+=Math.sin(t.sway)*kind.drift;t.x=Math.max(.06,Math.min(.94,t.x))}
t.size=(.05+(t.y-.44)*.42)*kind.scale;
if(t.y>.95){t.dead=true;hardHurt(kind.bite,kind.says)}
const px=t.x*w,py=t.y*h,size=t.size*h*2.2;
t.box={x:px-size/2,y:py-size,w:size,h:size};
g.save();g.strokeStyle=kind.tint;g.globalAlpha=.55;g.lineWidth=2;g.beginPath();g.ellipse(px,py,size*.3,size*.09,0,0,6.3);g.stroke();g.restore();
g.save();g.shadowColor=kind.tint;g.shadowBlur=winding?34:(t.hp>1?24:14);
if(hardReady(FACE))g.drawImage(FACE,px-size/2,py-size,size,size);
else{g.fillStyle=kind.tint;g.fillRect(px-size/4,py-size,size/2,size)}
g.restore();
if(kind.hp>1)for(let i=0;i<kind.hp;i++){g.fillStyle=i<t.hp?kind.tint:"rgba(255,255,255,.18)";g.fillRect(px-size*.22+i*(size*.16),py-size-10,size*.11,4)}
if(winding){const done=Math.min(1,t.wind/HARD_SHOUT_WIND);g.save();g.strokeStyle="#fff";g.lineWidth=4;g.beginPath();g.arc(px,py-size*.6,size*.62,-1.57,-1.57+done*6.283);g.stroke();g.restore()}});
s.todds=s.todds.filter(t=>!t.dead);
s.sparks.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;g.fillStyle="rgba(255,182,66,"+Math.max(0,p.life/32)+")";g.fillRect(p.x*w,p.y*h,3,3)});
s.sparks=s.sparks.filter(p=>p.life>0);
s.shots.forEach(sh=>{sh.life--;g.strokeStyle="rgba(255,255,255,"+(sh.life/12)+")";g.lineWidth=2;g.beginPath();g.arc(sh.x*w,sh.y*h,(12-sh.life)*3,0,6.3);g.stroke()});
s.shots=s.shots.filter(sh=>sh.life>0);
const hands=hardImage(HARD_ASSETS+"1stpersonidle.png");
if(hardReady(hands)){const hh=h*.46;g.globalAlpha=.96;g.drawImage(hands,w*.5-hh*.75,h-hh,hh*1.5,hh);g.globalAlpha=1}
const aim=hardImage(HARD_ASSETS+"aim.png"),cx=s.mx*w,cy=s.my*h;
if(hardReady(aim)){const a=Math.min(90,h*.14);g.drawImage(aim,cx-a/2,cy-a/2,a,a)}
else{g.strokeStyle="#3dff8a";g.lineWidth=2;g.beginPath();g.arc(cx,cy,16,0,6.3);g.stroke();g.beginPath();g.moveTo(cx-24,cy);g.lineTo(cx+24,cy);g.moveTo(cx,cy-24);g.lineTo(cx,cy+24);g.stroke()}
g.font="600 15px 'Share Tech Mono',ui-monospace,monospace";
g.fillStyle=s.reloading>0?"#ff7a63":"#7dffb0";
g.fillText(s.reloading>0?"RELOADING":("AMMO "+"|".repeat(s.clip)),16,h-16);
g.fillStyle="#e6fff0";g.fillText("DOWN "+s.kills+" / "+HARD_SHOOT_KILLS,16,26);
if(s.heads){g.fillStyle="#ffd79a";g.fillText(s.heads+" high",16,46)}
hardRaf=requestAnimationFrame(hardShootFrame)}

function hardPhase3(){show("hd");hardShow("hcw");
const cv=$("cv");
hardBanner("PHASE 3","YOU'RE BREATHTAKING","ph","New location discovered");
hardSay("Hold still. This is the part we playtested.");
$("hq").textContent="Hold still. This is the part we playtested. Arrow keys, or move the mouse or your finger.";
hardLog("Phase 3: dodge for "+Math.round(HARD_DODGE_MS/1000)+" seconds. Arrows or mouse.","p");
hard.dodge={x:.5,y:.78,vx:0,vy:0,keys:{},useMouse:false,mx:.5,my:.78,orbs:[],rings:[],beams:[],shout:null,until:Date.now()+HARD_DODGE_MS,done:false,nextOrb:70,nextRing:190,nextBeam:320,nextShout:520,grace:0,hits:0};
cv.style.cursor="crosshair";
const move=ev=>{const r=cv.getBoundingClientRect(),d=hard.dodge;d.useMouse=true;d.mx=(ev.clientX-r.left)/r.width;d.my=(ev.clientY-r.top)/r.height};
cv.onpointermove=move;cv.onpointerdown=move;
window.onkeydown=ev=>{if(!hard||hard.phase!==3)return;hard.dodge.keys[ev.key]=true;hard.dodge.useMouse=false;
if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(ev.key)>=0)ev.preventDefault()};
window.onkeyup=ev=>{if(hard&&hard.dodge)hard.dodge.keys[ev.key]=false};
hardRaf=requestAnimationFrame(hardDodgeFrame)}

function hardDodgeHit(amount,why){const d=hard.dodge;if(d.grace>0)return;d.grace=48;d.hits++;hardHurt(amount,why)}

function hardDodgeFrame(){if(!hard||hard.over||hard.phase!==3)return;
const cv=$("cv"),d=hard.dodge;if(!cv||!d)return;
const w=hardFitCanvas(cv),h=cv.height,g=cv.getContext("2d"),left=Math.max(0,d.until-Date.now());
if(left<=0){if(!d.done){d.done=true;hardLog("Phase 3 cleared. You outlasted the patch notes.","p");setTimeout(hardNextPhase,500)}return}
g.fillStyle="#030a06";g.fillRect(0,0,w,h);
const pulse=.5+.5*Math.sin(Date.now()/420);
g.strokeStyle="rgba(61,255,138,"+(.06+pulse*.07)+")";g.lineWidth=1;
for(let i=0;i<=16;i++){g.beginPath();g.moveTo(w*i/16,0);g.lineTo(w*i/16,h);g.stroke();g.beginPath();g.moveTo(0,h*i/16);g.lineTo(w,h*i/16);g.stroke()}
if(d.useMouse){d.x+=(d.mx-d.x)*.24;d.y+=(d.my-d.y)*.24}
else{const a=.0016;
if(d.keys.ArrowLeft)d.vx-=a;if(d.keys.ArrowRight)d.vx+=a;if(d.keys.ArrowUp)d.vy-=a;if(d.keys.ArrowDown)d.vy+=a;
d.vx*=.9;d.vy*=.9;d.x+=d.vx;d.y+=d.vy}
d.x=Math.max(.04,Math.min(.96,d.x));d.y=Math.max(.08,Math.min(.94,d.y));
if(d.grace>0)d.grace--;
if(--d.nextOrb<=0){d.orbs.push({x:Math.random()<.5?0:1,y:Math.random(),vx:0,vy:0,life:420});d.nextOrb=52;hardSfxClick()}
if(--d.nextRing<=0){const cx=.15+Math.random()*.7,cy=.15+Math.random()*.4;
for(let i=0;i<14;i++){const ang=(i/14)*6.283+Math.random()*.1;d.rings.push({x:cx,y:cy,vx:Math.cos(ang)*.0042,vy:Math.sin(ang)*.0042,life:320})}
d.nextRing=210;hardFloat("DAY ONE PATCH","warn",cx*100,cy*100);hardSfxShot()}
if(--d.nextBeam<=0){d.beams.push({y:Math.random()*.8+.1,charge:70,fire:34});d.nextBeam=300}
if(--d.nextShout<=0){const fromLeft=Math.random()<.5;
d.shout={charge:96,fire:46,fromLeft:fromLeft};d.nextShout=470;
hardBanner("FUS RO DAH",fromLeft?"get right":"get left","mg","Shout incoming");
hardSay(fromLeft?"THE LEFT HALF IS DLC NOW.":"THE RIGHT HALF IS DLC NOW.");hardGlitch(900)}
d.orbs.forEach(o=>{const dx=d.x-o.x,dy=d.y-o.y,len=Math.max(.001,Math.hypot(dx,dy));
o.vx+=(dx/len)*.00013;o.vy+=(dy/len)*.00013;o.vx*=.995;o.vy*=.995;o.x+=o.vx;o.y+=o.vy;o.life--;
g.save();g.shadowColor="#c79bf0";g.shadowBlur=18;g.fillStyle="#c79bf0";g.beginPath();g.arc(o.x*w,o.y*h,h*.016,0,6.3);g.fill();g.restore();
if(Math.abs(o.x-d.x)<.028&&Math.abs(o.y-d.y)<.028){o.life=0;hardDodgeHit(9,"A homing bug found you")}});
d.orbs=d.orbs.filter(o=>o.life>0&&o.x>-.1&&o.x<1.1&&o.y>-.1&&o.y<1.1);
d.rings.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.life--;g.fillStyle="#ffd43b";g.beginPath();g.arc(b.x*w,b.y*h,h*.009,0,6.3);g.fill();
if(Math.abs(b.x-d.x)<.022&&Math.abs(b.y-d.y)<.022){b.life=0;hardDodgeHit(7,"Caught in the patch notes")}});
d.rings=d.rings.filter(b=>b.life>0&&b.x>-.05&&b.x<1.05&&b.y>-.05&&b.y<1.05);
d.beams.forEach(bm=>{
if(bm.charge>0){bm.charge--;g.strokeStyle="rgba(255,122,99,"+(.25+.4*pulse)+")";g.lineWidth=2;g.setLineDash([10,8]);
g.beginPath();g.moveTo(0,bm.y*h);g.lineTo(w,bm.y*h);g.stroke();g.setLineDash([]);
if(bm.charge===1){hardSfxShot();hardShake()}}
else if(bm.fire>0){bm.fire--;const thick=h*.07,gr=g.createLinearGradient(0,bm.y*h-thick,0,bm.y*h+thick);
gr.addColorStop(0,"rgba(255,122,99,0)");gr.addColorStop(.5,"rgba(255,230,210,.95)");gr.addColorStop(1,"rgba(255,122,99,0)");
g.fillStyle=gr;g.fillRect(0,bm.y*h-thick,w,thick*2);
if(Math.abs(d.y-bm.y)<.055)hardDodgeHit(13,"The re-release swept through you")}});
d.beams=d.beams.filter(bm=>bm.charge>0||bm.fire>0);
if(d.shout){const sh=d.shout;
if(sh.charge>0){sh.charge--;const grow=1-sh.charge/96;
g.fillStyle="rgba(76,195,255,"+(.05+grow*.16)+")";
if(sh.fromLeft)g.fillRect(0,0,w*.56,h);else g.fillRect(w*.44,0,w*.56,h);
g.strokeStyle="rgba(255,255,255,"+(.3+grow*.6)+")";g.lineWidth=3+grow*5;
const edge=sh.fromLeft?w*.56:w*.44;g.beginPath();g.moveTo(edge,0);g.lineTo(edge,h);g.stroke();
if(sh.charge===24)hardSfxShout()}
else if(sh.fire>0){sh.fire--;const sweep=1-sh.fire/46;
g.fillStyle="rgba(255,255,255,"+(.5*sh.fire/46+.25)+")";
if(sh.fromLeft)g.fillRect(0,0,w*(.56+sweep*.1),h);else g.fillRect(w*(.44-sweep*.1),0,w,h);
hardShake();
const caught=sh.fromLeft?(d.x<.56):(d.x>.44);
if(caught){d.x=sh.fromLeft?Math.min(.96,d.x+.28):Math.max(.04,d.x-.28);d.vx=0;d.vy=0;hardDodgeHit(26,"FUS RO DAH")}}
else d.shout=null}
const size=h*.14;
g.save();if(d.grace>0&&Math.floor(d.grace/4)%2===0)g.globalAlpha=.35;
g.shadowColor="#7ef0a0";g.shadowBlur=16;
if(hardReady(FACE))g.drawImage(FACE,d.x*w-size/2,d.y*h-size/2,size,size);
else{g.fillStyle="#7ef0a0";g.beginPath();g.arc(d.x*w,d.y*h,size/2,0,6.3);g.fill()}
g.restore();
g.font="600 15px 'Share Tech Mono',ui-monospace,monospace";
g.fillStyle="#7dffb0";g.fillText("SURVIVE  "+(left/1000).toFixed(1)+"s",16,26);
g.fillStyle="#6fb38b";g.fillText("hit "+d.hits+" time(s)",16,h-16);
hardRaf=requestAnimationFrame(hardDodgeFrame)}

function hardPhase4(){show("hd");hardShow("hch");
hardBanner("FINAL PHASE","CHESS. IT JUST WORKS.","ph","New location discovered");
hardSay("I've been playing this since before you were born. Three minutes.");
$("hq").textContent="Real chess. He is white and opens. Survive three minutes on your clock, draw, or mate him. Only being mated loses.";
hardLog("Final phase: chess. He is white and opens. You are black.","p");
hardLog("Survive three minutes, draw, or mate him. Only being mated loses it.","p");
hardLog("He is a beginner on purpose. Take whatever he leaves lying about.","p");
const c=hard.chess={pos:CH.start(),pick:-1,legal:[],ms:HARD_CHESS_MS,thinking:true,done:false,last:null};
hardChessBuild();hardChessPaint();
setTimeout(()=>{if(hard&&!hard.over&&hard.chess===c)hardChessTodd()},700);
hard.clock=setInterval(()=>{const c=hard&&hard.chess;
if(!c||c.done||hard.over)return;
if(c.thinking||c.pos.white)return;
c.ms-=200;hardChessClock();
if(c.ms<=0){c.done=true;hardLog("Three minutes survived. He never got you.","g");setTimeout(hardWin,600)}},200)}

function hardChessClock(){const c=hard&&hard.chess,box=$("hck");if(!c||!box)return;
const left=Math.max(0,c.ms),m=Math.floor(left/60000),s=Math.floor((left%60000)/1000);
box.textContent=m+":"+(s<10?"0":"")+s;box.className="hclock"+(left<30000?" hclock-dire":"")}

function hardPieceNode(piece){const side=piece>0?"hg-w":"hg-b";
if(hardArt.chess&&HARD_PIECE_ART[String(piece)]){const img=document.createElement("img");
img.src=HARD_ASSETS+"chess/"+HARD_PIECE_ART[String(piece)];img.alt="";
img.onerror=()=>{const sp=document.createElement("span");sp.className="hg "+side;sp.textContent=(HARD_PIECE_GLYPH[String(piece)]||"?")+"\uFE0E";if(img.parentNode)img.parentNode.replaceChild(sp,img)};
return img}
const sp=document.createElement("span");sp.className="hg "+side;sp.textContent=(HARD_PIECE_GLYPH[String(piece)]||"?")+"\uFE0E";return sp}

function hardChessBuild(){const c=hard&&hard.chess,board=$("hbd");if(!c||!board)return;
board.innerHTML="";c.cells=[];c.shown=[];
for(let r=0;r<8;r++)for(let f=7;f>=0;f--){const i=CH.idx(r,f),sq=document.createElement("button");
sq.className="hsq "+(((r+f)%2)?"hsq-light":"hsq-dark");
sq.addEventListener("click",()=>hardChessClick(i));board.appendChild(sq);c.cells[i]=sq;c.shown[i]=null}}

function hardChessPaint(){const c=hard&&hard.chess;if(!c||!c.cells)return;
for(let i=0;i<64;i++){const sq=c.cells[i];if(!sq)continue;
const r=CH.rankOf(i),f=CH.fileOf(i);
sq.className="hsq "+(((r+f)%2)?"hsq-light":"hsq-dark")+(c.last&&(c.last.from===i||c.last.to===i)?" hsq-last":"")+(c.legal.some(m=>m.to===i)?" hsq-can":"")+(c.pick===i?" hsq-pick":"");
const piece=c.pos.b[i];
if(c.shown[i]!==piece){c.shown[i]=piece;sq.textContent="";if(piece!==0)sq.appendChild(hardPieceNode(piece))}}
hardChessClock();hardPaintBars()}

function hardChessClick(i){const c=hard&&hard.chess;
if(!c||c.done||c.thinking||hard.over)return;
if(c.pos.white)return;
const taking=c.legal.find(m=>m.to===i);
if(taking){hardChessPlay(taking);return}
if(c.pos.b[i]<0){c.pick=i;c.legal=CH.moves(c.pos).filter(m=>m.from===i);hardSfxClick()}
else{c.pick=-1;c.legal=[]}
hardChessPaint()}

function hardChessPlay(mv){const c=hard.chess;
if(mv.promo)mv=Object.assign({},mv,{promo:CH.Q});
const took=c.pos.b[mv.to]!==0||mv.ep;
c.pos=CH.make(c.pos,mv);c.last=mv;c.pick=-1;c.legal=[];
if(took){hardSfxKill();hardShake();hardFlash("gold")}else hardSfxClick();
hardChessPaint();
const over=CH.result(c.pos);
if(over==="mate"){c.done=true;hardLog("Mate. He is out of re-releases.","g");setTimeout(hardWin,600);return}
if(over==="stalemate"||over==="draw"){c.done=true;hardLog("Drawn, which is good enough. He did not beat you.","g");setTimeout(hardWin,600);return}
hardChessTodd()}

function hardChessTodd(){const c=hard&&hard.chess;
if(!c||c.done||hard.over)return;
c.thinking=true;const think=$("hth");if(think)think.textContent="He is thinking...";
setTimeout(()=>{if(!hard||hard.over||c.done)return;
let reply=null;
try{reply=CH.search(c.pos,HARD_CHESS_DEPTH,HARD_CHESS_SLIP,HARD_CHESS_SLIP_CP)}catch(e){reply=CH.moves(c.pos)[0]||null}
if(!reply){c.thinking=false;return}
if(reply.promo)reply=Object.assign({},reply,{promo:CH.Q});
const grabbed=c.pos.b[reply.to]!==0||reply.ep;
c.pos=CH.make(c.pos,reply);c.last=reply;c.thinking=false;
if(think)think.textContent="";
if(grabbed){hardSfxHit();hardShake();hardFlash("red");hardFloat("TAKEN","bad",50,40)}
hardChessPaint();
const mine=CH.result(c.pos);
if(mine==="mate"){c.done=true;hardLose("Mated. He has done this before")}
else if(mine==="stalemate"||mine==="draw"){c.done=true;hardLog("Drawn, which is good enough. He did not beat you.","g");setTimeout(hardWin,600)}
else if(CH.inCheck(c.pos,false)){hardFloat("CHECK","warn",50,50);hardSay("Check. Have you tried it on a smart fridge?")}},60)}

$("hr").onclick=()=>hardShootReload();
$("hx").onclick=()=>tab("s");
