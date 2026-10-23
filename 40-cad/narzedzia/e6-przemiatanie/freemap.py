import numpy as np, sys
A=sys.argv[1:]; sys.argv=[sys.argv[0],"4"]
import full
from full import *
# zbiór ruchomych kapsuł (gałka krok 2, powieki krok 1) + stałe serwa
mov=[]
for p in np.arange(-28,28.1,2):
    pX=pY=0
    for t in np.arange(-18,18.1,2):
        R,PX,PY=eye_points(p,t); aX=geo.solve_horn('X',PX,pX); aY=geo.solve_horn('Y',PY,pY); pX,pY=aX,aY
        mov+=rod_caps('X',R,PX,aX)+rod_caps('Y',R,PY,aY)
prev=None
for t in np.append(np.arange(-0.25,58,1),58):
    c,b=lid_caps(LG,'G',t,prev,0.4,-1,1); prev=b; mov+=c
prev=None
for t in np.append(np.arange(-0.25,34,1),34):
    c,b=lid_caps(LD,'D',t,prev,0.15,-1,-1); prev=b; mov+=c
mov+= [c for c in fixed_caps() if 'słupek' not in c[0] and 'wspornika' not in c[0]]
P1=np.array([c[1] for c in mov]);Q1=np.array([c[2] for c in mov]);R1=np.array([c[3] for c in mov]);lab=[c[0] for c in mov]
boxes=fixed_boxes()
def clr(caps):
    out=[]
    for nm,p,q,r in caps:
        D=seg_seg_v(np.array([p]),np.array([q]),P1,Q1)[0]-R1-r; i=np.argmin(D)
        pts,rad,_=sample_caps([(nm,p,q,r)],0.5); bb=min(((box_d(pts,b)-rad).min(),n) for n,b in boxes)
        out.append((min(D[i],bb[0]), lab[i] if D[i]<bb[0] else bb[1]))
    return min(out)
Rs=float(A[0]) if A else 33
zA=float(A[1]) if len(A)>1 else -39
print("kąt  słupek R%.0f z-41..-68 r3 | ramię z%.0f r2 od R8"%(Rs,zA))
for a in range(0,360,10):
    ca,sa=np.cos(a*d2r),np.sin(a*d2r)
    s=clr([('s',np.array([Rs*ca,Rs*sa,-41]),np.array([Rs*ca,Rs*sa,-68]),3.0)])
    r=clr([('r',np.array([8*ca,8*sa,zA]),np.array([Rs*ca,Rs*sa,zA]),2.0)])
    print("%3d  %6.2f %-28s | %6.2f %s"%(a,s[0],s[1],r[0],r[1]))
