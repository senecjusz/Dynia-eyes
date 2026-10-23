import sys,json; sys.argv=[sys.argv[0],"4"]
import numpy as np
import full; from full import *
from window import poly_inside
RT=np.array(json.load(open('reach.json')))
def ik(p,t,g=(0,0)):
    R,PX,PY=eye_points(p,t); return np.degrees(np.array([geo.solve_horn('X',PX,g[0]),geo.solve_horn('Y',PY,g[1])]))
# brzeg S (osiągalny zakres okna) i brzeg prostokąta pracy w przestrzeni serw
def poly_of(points):
    out=[]; g=(0,0)
    for p,t in points:
        a=ik(p,t,np.radians(g) if False else (0,0)); out.append(a)
    return np.array(out)
Sb=[]
for ang,sc in RT:
    c,s=np.cos(np.radians(ang)),np.sin(np.radians(ang)); n=max(abs(c),abs(s)); Sb.append((28*sc*c/n,18*sc*s/n))
Wb=[(p,15) for p in np.linspace(25,-25,26)]+[(-25,t) for t in np.linspace(15,-15,16)]+[(p,-15) for p in np.linspace(-25,25,26)]+[(25,t) for t in np.linspace(-15,15,16)]
SP=poly_of(Sb); WP=poly_of(Wb)
print("obraz S w kątach serw: X %.1f..%.1f, Y %.1f..%.1f"%(SP[:,0].min(),SP[:,0].max(),SP[:,1].min(),SP[:,1].max()))
print("obraz pracy: X %.1f..%.1f, Y %.1f..%.1f"%(WP[:,0].min(),WP[:,0].max(),WP[:,1].min(),WP[:,1].max()))
# jakobian – znak stały (brak złożenia)
dets=[]
for p in np.arange(-28,28.1,2):
    for t in np.arange(-18,18.1,2):
        e=0.1; J=np.array([(ik(p+e,t)-ik(p-e,t))/(2*e),(ik(p,t+e)-ik(p,t-e))/(2*e)]).T; dets.append(np.linalg.det(J))
dets=np.array(dets); print("det J: %.3f..%.3f (stały znak = brak złożenia)"%(dets.min(),dets.max()))
rng=np.random.default_rng(2)
def path(aA,aB,n=60):
    d=aB-aA; m=np.max(np.abs(d)); s=np.linspace(0,m,n)[:,None]
    return aA+np.clip(np.abs(d)[None,:],0,s)*np.sign(d)[None,:]
def run(A,B,lab):
    hit=0; maxout=0
    for a,b in zip(A,B):
        pts=path(a,b); ins=poly_inside(pts,SP)
        if not ins.all():
            hit+=1
    print("%s: %d z %d torów dochodzi do okna Słupka (reszta mieści się w S)"%(lab,hit,len(A)))
# punkty pracy w kątach serw
def rnd_work(n): return [ik(rng.uniform(-25,25),rng.uniform(-15,15)) for _ in range(n)]
def rnd_S(n):
    out=[]
    while len(out)<n:
        p,t=rng.uniform(-28.3,28.3),rng.uniform(-18.4,18.4)
        a=np.degrees(np.arctan2(t/18,p/28))%360; sc=np.interp(a,np.append(RT[:,0],360),np.append(RT[:,1],RT[0,1]))
        if max(abs(p)/28,abs(t)/18)<=sc: out.append(ik(p,t))
    return out
A=rnd_work(1000); B=rnd_work(1000); run(A,B,"skok praca→praca, oba serwa tą samą prędkością")
A2=rnd_S(1000); run(A2,B,"skok położenie ręczne (cały S)→NVS")
# najgorsze: narożniki
C=[ik(p,t) for p,t in ((25,15),(25,-15),(-25,15),(-25,-15))]
for i in range(4):
    for j in range(4):
        if i!=j:
            pts=path(C[i],C[j]); ins=poly_inside(pts,SP); 
            if not ins.all(): print("  narożnik %d→%d: wychodzi poza S (oparcie na oknie)"%(i,j))
# przykład Astry: tor po rampie w kątach serw liniowo
for (A_,B_) in (((25,-15),(-25,15)),((25,15),(-25,-15))):
    a=ik(*A_); b=ik(*B_); lin=np.array([a+(b-a)*s for s in np.linspace(0,1,50)])
    print("  rampa liniowa w kątach serw %s→%s: poza pracą %s, poza S %s"%(A_,B_, (~poly_inside(lin,WP)).any(), (~poly_inside(lin,SP)).any()))
