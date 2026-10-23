import sys,os; sys.argv=[sys.argv[0],"4"]
import full; from full import *
import numpy as np
res={}
for p in np.arange(-28,28.1,2):
    pY=0
    for t in np.arange(-18,18.1,2):
        R,PX,PY=eye_points(p,t); pY=geo.solve_horn('Y',PY,pY)
        if pY is None: print("brak",p,t); sys.exit()
        cy=rod_caps('Y',R,PY,pY)
        sel=[c for c in cy if 'Ramię' not in c[0] and 'czop' not in c[0]]
        pts,rad,lab=sample_caps(sel,0.3)
        work=abs(p)<=25 and abs(t)<=15
        for tv in (51.0,56.0,56.75):
            lo,hi=lidG_range(tv); d=lid_d(pts,lo,hi,(G_CUT['x1'],G_CUT['x2'],lo+G_CUT['span']),lo)-rad
            i=np.argmin(d); k=(tv,work)
            if k not in res or d[i]<res[k][0]: res[k]=(round(float(d[i]),2),lab[i],(p,t))
        d=ball_d((R.T@pts.T).T)-rad; i=np.argmin(d); k=('kula',work)
        if k not in res or d[i]<res[k][0]: res[k]=(round(float(d[i]),2),lab[i],(p,t))
for k in sorted(res,key=str): print(k,res[k])
# t 56.75 tylko dla theta>=0

