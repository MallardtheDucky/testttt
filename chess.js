const CH=(function(){
const P=1,N=2,B=3,R=4,Q=5,K=6;
const idx=(r,f)=>r*8+f,rankOf=i=>i>>3,fileOf=i=>i&7;
const KN=[[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
const KG=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
const DI=[[1,1],[1,-1],[-1,1],[-1,-1]],OR=[[1,0],[-1,0],[0,1],[0,-1]];
const VAL=[0,100,320,330,500,900,0];
const MATE=100000,INF=1e9;
const PST=[null,
[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]];
function key(p){return p.b.join(",")+(p.white?"w":"b")+p.c+p.ep}
function start(){const b=new Int8Array(64),back=[R,N,B,Q,K,B,N,R];
for(let f=0;f<8;f++){b[f]=back[f];b[8+f]=P;b[48+f]=-P;b[56+f]=-back[f]}
const p={b:b,white:true,c:15,ep:-1,half:0,full:1,hist:[]};p.hist=[key(p)];return p}
function fromFen(fen){const t=fen.split(" "),b=new Int8Array(64),rows=t[0].split("/"),map={p:1,n:2,b:3,r:4,q:5,k:6};
for(let i=0;i<8;i++){const r=7-i;let f=0;for(const ch of rows[i]){if(/\d/.test(ch))f+=+ch;else{const lo=ch.toLowerCase();b[r*8+f]=(ch===lo?-1:1)*map[lo];f++}}}
let c=0;if(t[2].indexOf("K")>=0)c|=1;if(t[2].indexOf("Q")>=0)c|=2;if(t[2].indexOf("k")>=0)c|=4;if(t[2].indexOf("q")>=0)c|=8;
const ep=t[3]==="-"?-1:(t[3].charCodeAt(1)-49)*8+(t[3].charCodeAt(0)-97);
const p={b:b,white:t[1]==="w",c:c,ep:ep,half:+(t[4]||0),full:+(t[5]||1),hist:[]};p.hist=[key(p)];return p}
function attacked(b,sq,byWhite){const r=sq>>3,f=sq&7,s=byWhite?1:-1,pr=r-s;
if(pr>=0&&pr<8){if(f>0&&b[pr*8+f-1]===s*P)return true;if(f<7&&b[pr*8+f+1]===s*P)return true}
for(let i=0;i<8;i++){let rr=r+KN[i][0],ff=f+KN[i][1];if(rr>=0&&rr<8&&ff>=0&&ff<8&&b[rr*8+ff]===s*N)return true;
rr=r+KG[i][0];ff=f+KG[i][1];if(rr>=0&&rr<8&&ff>=0&&ff<8&&b[rr*8+ff]===s*K)return true}
for(let d=0;d<4;d++){let rr=r+DI[d][0],ff=f+DI[d][1];while(rr>=0&&rr<8&&ff>=0&&ff<8){const v=b[rr*8+ff];if(v){if(v===s*B||v===s*Q)return true;break}rr+=DI[d][0];ff+=DI[d][1]}
rr=r+OR[d][0];ff=f+OR[d][1];while(rr>=0&&rr<8&&ff>=0&&ff<8){const v=b[rr*8+ff];if(v){if(v===s*R||v===s*Q)return true;break}rr+=OR[d][0];ff+=OR[d][1]}}
return false}
function findK(b,white){const k=white?K:-K;for(let i=0;i<64;i++)if(b[i]===k)return i;return -1}
function inCheck(pos,white){return attacked(pos.b,findK(pos.b,white),!white)}
function gen(pos,caps){const b=pos.b,w=pos.white,s=w?1:-1,out=[];
const add=(from,to,x)=>{const m={from:from,to:to,promo:0,ep:false,castle:null,cap:Math.abs(b[to])};if(x)Object.assign(m,x);out.push(m)};
for(let i=0;i<64;i++){const v=b[i]*s;if(v<=0)continue;const r=i>>3,f=i&7;
if(v===P){const nr=r+s,pRank=w?7:0,sRank=w?1:6;
const pushP=(a,t)=>{if((t>>3)===pRank){for(const pr of [Q,R,B,N])add(a,t,{promo:pr})}else add(a,t)};
const t=nr*8+f;
if(!b[t]){if(!caps||nr===pRank)pushP(i,t);if(!caps&&r===sRank&&!b[t+8*s])add(i,t+8*s)}
for(const df of [-1,1]){const ff=f+df;if(ff<0||ff>7)continue;const t2=nr*8+ff;
if(b[t2]*s<0)pushP(i,t2);else if(t2===pos.ep)add(i,t2,{ep:true,cap:1})}}
else if(v===N||v===K){const D=v===N?KN:KG;
for(let d=0;d<8;d++){const rr=r+D[d][0],ff=f+D[d][1];if(rr<0||rr>7||ff<0||ff>7)continue;const t=rr*8+ff;
if(caps?b[t]*s<0:b[t]*s<=0)add(i,t)}
if(v===K&&!caps){const home=w?4:60,kb=w?1:4,qb=w?2:8,en=!w;
if(i===home){
if((pos.c&kb)&&!b[home+1]&&!b[home+2]&&b[home+3]===s*R&&!attacked(b,home,en)&&!attacked(b,home+1,en)&&!attacked(b,home+2,en))add(home,home+2,{castle:"k"});
if((pos.c&qb)&&!b[home-1]&&!b[home-2]&&!b[home-3]&&b[home-4]===s*R&&!attacked(b,home,en)&&!attacked(b,home-1,en)&&!attacked(b,home-2,en))add(home,home-2,{castle:"q"})}}}
else{const dirs=v===B?DI:v===R?OR:DI.concat(OR);
for(let d=0;d<dirs.length;d++){let rr=r+dirs[d][0],ff=f+dirs[d][1];
while(rr>=0&&rr<8&&ff>=0&&ff<8){const t=rr*8+ff,o=b[t]*s;if(o>0)break;if(o<0){add(i,t);break}if(!caps)add(i,t);rr+=dirs[d][0];ff+=dirs[d][1]}}}}
return out}
function makeLite(pos,mv){const b=Int8Array.from(pos.b),w=pos.white,s=w?1:-1,pc=b[mv.from],cap=b[mv.to];let c=pos.c,ep=-1;
b[mv.to]=mv.promo?s*mv.promo:pc;b[mv.from]=0;
if(mv.ep)b[mv.to-8*s]=0;
if(mv.castle==="k"){b[mv.to-1]=b[mv.to+1];b[mv.to+1]=0}else if(mv.castle==="q"){b[mv.to+1]=b[mv.to-2];b[mv.to-2]=0}
const ap=Math.abs(pc);
if(ap===K)c&=(w?~3:~12);
if(mv.from===0||mv.to===0)c&=~2;if(mv.from===7||mv.to===7)c&=~1;if(mv.from===56||mv.to===56)c&=~8;if(mv.from===63||mv.to===63)c&=~4;
if(ap===P&&Math.abs(mv.to-mv.from)===16)ep=(mv.from+mv.to)>>1;
return{b:b,white:!w,c:c,ep:ep,half:(ap===P||cap)?0:pos.half+1,full:pos.full+(w?0:1),hist:pos.hist}}
function make(pos,mv){const n=makeLite(pos,mv);n.hist=pos.hist.concat(key(n));return n}
function legal(pos,caps){const out=[],s=pos.white;
for(const m of gen(pos,caps)){const n=makeLite(pos,m);if(!attacked(n.b,findK(n.b,s),!s))out.push(m)}
return out}
function moves(pos){return legal(pos,false)}
function insufficient(b){let minors=0;for(let i=0;i<64;i++){const a=Math.abs(b[i]);if(!a||a===K)continue;if(a===P||a===R||a===Q)return false;minors++}return minors<=1}
function result(pos){const ms=moves(pos);
if(!ms.length)return inCheck(pos,pos.white)?"mate":"stalemate";
if(pos.half>=100||insufficient(pos.b))return "draw";
const last=pos.hist[pos.hist.length-1];let n=0;for(const k of pos.hist)if(k===last)n++;
return n>=3?"draw":null}
function evaluate(pos){const b=pos.b;let sc=0;
for(let i=0;i<64;i++){const p=b[i];if(!p)continue;const a=p>0?p:-p,r=i>>3,f=i&7;
if(p>0)sc+=VAL[a]+PST[a][(7-r)*8+f];else sc-=VAL[a]+PST[a][r*8+f]}
return pos.white?sc:-sc}
function order(ms,b){ms.sort((x,y)=>(y.cap*10+(y.promo?8:0)-Math.abs(b[y.from]))-(x.cap*10+(x.promo?8:0)-Math.abs(b[x.from])))}
function qs(pos,alpha,beta,d){const stand=evaluate(pos);if(d<=0||stand>=beta)return stand;if(stand>alpha)alpha=stand;
const ms=legal(pos,true);order(ms,pos.b);
for(const m of ms){const sc=-qs(makeLite(pos,m),-beta,-alpha,d-1);if(sc>=beta)return sc;if(sc>alpha)alpha=sc}
return alpha}
function negamax(pos,depth,alpha,beta,ply){if(depth<=0)return qs(pos,alpha,beta,6);
const ms=moves(pos);if(!ms.length)return inCheck(pos,pos.white)?-MATE+ply:0;
order(ms,pos.b);let best=-INF;
for(const m of ms){const sc=-negamax(makeLite(pos,m),depth-1,-beta,-alpha,ply+1);if(sc>best)best=sc;if(sc>alpha)alpha=sc;if(alpha>=beta)break}
return best}
function search(pos,depth,slip,slipCp){const ms=moves(pos);if(!ms.length)return null;
const scored=ms.map(m=>{const n=makeLite(pos,m),nm=moves(n);let sc;
if(!nm.length)sc=inCheck(n,n.white)?MATE:0;else sc=-negamax(n,Math.max(0,depth-1),-INF,INF,1);
return{m:m,sc:sc}});
let best=-INF;scored.forEach(x=>{if(x.sc>best)best=x.sc});
let pool=scored.filter(x=>x.sc===best);
if(best<MATE/2&&Math.random()<slip)pool=scored.filter(x=>x.sc>=best-slipCp);
return pool[Math.floor(Math.random()*pool.length)].m}
function perft(pos,d){if(d===0)return 1;const ms=moves(pos);if(d===1)return ms.length;let n=0;for(const m of ms)n+=perft(makeLite(pos,m),d-1);return n}
return{P:P,N:N,B:B,R:R,Q:Q,K:K,idx:idx,rankOf:rankOf,fileOf:fileOf,start:start,fromFen:fromFen,moves:moves,make:make,result:result,inCheck:inCheck,search:search,perft:perft}
})();
if(typeof module!=="undefined")module.exports=CH;
