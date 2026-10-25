// Duże oko v2: kąty wymagane w przegubach cięgien S1/S2 (ka) i powiek (kp). Użycie: node duze-oko-katy-przegubow.js <parametry.json>
// --- S1/S2 ---
(()=>{
const P=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
const Rx=(p,a)=>{const c=Math.cos(rad(a)),s=Math.sin(rad(a));return[p[0],p[1]*c+p[2]*s,-p[1]*s+p[2]*c]};
const Ry=(p,a)=>{const c=Math.cos(rad(a)),s=Math.sin(rad(a));return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c]};
const RxI=(p,a)=>Rx(p,-a),RyI=(p,a)=>Ry(p,-a);
const gal=(p,th,ph)=>Rx(Ry(p,th),ph), galInv=(v,th,ph)=>RyI(RxI(v,ph),th);
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const Hx=(s,a)=>[s.xh,s.ys+s.r*Math.cos(rad(a)),s.zs+s.r*Math.sin(rad(a))];
const solve=(s,pkt,L,a0)=>{let best=a0,bd=1e9;for(let a=a0-60;a<=a0+60;a+=0.05){const e=Math.abs(dist(Hx(s,a),pkt)-L);if(e<bd){bd=e;best=a}}return best};
for(const[nm,s,lug]of[['S1',P.s1,P.lug1],['S2',P.s2,P.lug2]]){
 const L=dist(Hx(s,s.a0),lug);let r={hx:[1e9,-1e9],gx:[1e9,-1e9],gy:[1e9,-1e9],gz:[1e9,-1e9]};
 for(let th=-35;th<=35;th+=5)for(let ph=-25;ph<=25;ph+=5){const e=gal(lug,th,ph);const a=solve(s,e,L,s.a0);const h=Hx(s,a);
  const d=[e[0]-h[0],e[1]-h[1],e[2]-h[2]].map(v=>v/L);
  // horn: angle out of plane perpendicular to shaft x
  const hx=deg(Math.asin(d[0]));
  const dg=galInv(d,th,ph); const up=(k,v)=>{r[k][0]=Math.min(r[k][0],v);r[k][1]=Math.max(r[k][1],v)};
  up('hx',hx);up('gx',deg(Math.asin(dg[0])));up('gy',deg(Math.asin(dg[1])));up('gz',deg(Math.asin(dg[2])));}
 console.log(nm,'L',L.toFixed(1),JSON.stringify(Object.fromEntries(Object.entries(r).map(([k,v])=>[k,v.map(x=>x.toFixed(0))]))));
}
})();
// --- powieki ---
(()=>{
const P=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
const s=P.s3,v=P.lev,mid=v.skok/2;const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const U=p=>{const d=p-mid;return[v.xu,v.r*Math.cos(rad(d)),-v.r*Math.sin(rad(d))]};
const D=p=>{const d=p-mid;return[v.xl,-v.r*Math.cos(rad(d)),-v.r*Math.sin(rad(d))]};
const Hy=a=>[s.xs+s.r*Math.cos(rad(a)),s.yh,s.zs+s.r*Math.sin(rad(a))];
for(const[nm,F]of[['PG',U],['PD',D]]){const L=dist(Hy(0),F(mid));let hx=[1e9,-1e9],lx=[1e9,-1e9],sens=null;
 for(let a=-24;a<=24;a+=1){let bp=0,bd=1e9;for(let p=-30;p<=90;p+=0.05){const e=Math.abs(dist(Hy(a),F(p))-L);if(e<bd){bd=e;bp=p}}
  const h=Hy(a),e=F(bp),d=[e[0]-h[0],e[1]-h[1],e[2]-h[2]].map(x=>x/L);
  const oh=deg(Math.asin(d[1])), ol=deg(Math.asin(d[0]));hx=[Math.min(hx[0],oh),Math.max(hx[1],oh)];lx=[Math.min(lx[0],ol),Math.max(lx[1],ol)];
  if(a==0){// sensitivity: change L by 1
   let bp2=0,bd2=1e9;for(let p=-30;p<=90;p+=0.02){const e2=Math.abs(dist(Hy(0),F(p))-(L+1));if(e2<bd2){bd2=e2;bp2=p}}sens=bp2-bp;}}
 console.log(nm,'L',L.toFixed(1),'horn out-of-plane',hx.map(x=>x.toFixed(0)),'lever out-of-plane',lx.map(x=>x.toFixed(0)),'deg lid per +1mm',sens.toFixed(1));}
})();
