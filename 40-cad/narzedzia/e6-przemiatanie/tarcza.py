import sys; sys.argv=[sys.argv[0],"4"]
import numpy as np
import full; from full import *
Z0=-68.3  # przód tarczy = tył klatek serw
res={}
def add(caps,tag):
    pts,rad,lab=sample_caps(caps,0.3)
    for p,r,l in zip(pts,rad,lab):
        if p[2]-r<Z0:
            k=l; x0,x1,y0,y1,zm=res.get(k,(99,-99,99,-99,0))
            res[k]=(min(x0,p[0]-r),max(x1,p[0]+r),min(y0,p[1]-r),max(y1,p[1]+r),min(zm,p[2]-r))
prev=None
for t in np.append(np.arange(-0.25,56.75,0.5),56.75):
    c,b=lid_caps(LG,'G',t,prev,0.4,-1,1); prev=b; add(c,'G')
prev=None
for t in np.append(np.arange(-0.25,32.75,0.5),32.75):
    c,b=lid_caps(LD,'D',t,prev,0.15,-1,-1); prev=b; add(c,'D')
for p in np.arange(-28,28.1,2):
    pX=pY=0
    for t in np.arange(-18,18.1,2):
        R,PX,PY=eye_points(p,t); pX=geo.solve_horn('X',PX,pX); pY=geo.solve_horn('Y',PY,pY)
        add(rod_caps('X',R,PX,pX)+rod_caps('Y',R,PY,pY),'E')
for k,v in res.items(): print("%-28s x %.1f..%.1f y %.1f..%.1f  z min %.1f"%((k,)+v))
for k,s in SERV.items(): print(k,'klatka z',s['cage']['z'],'x',np.round(s['cage']['x'],1),'y',s['cage']['y'])
