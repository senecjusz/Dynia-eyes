import sys; A=sys.argv[1:]; sys.argv=[sys.argv[0],"4"]
import full; from full import *
import numpy as np
print("X xh %.2f Y xh %.2f  STUD X %s Y %s L %.2f %.2f"%(P['X']['xh'],P['Y']['xh'],STUD['X'],STUD['Y'],STUD['X_L'],STUD['Y_L']))
for (p,t) in ((-24,-14),(24,14),(28,18),(0,0)):
    pX=pY=0
    for tt in np.linspace(0,t,10):
        for pp in [p*tt/t if t else p]:
            R,PX,PY=eye_points(pp,tt); pX=geo.solve_horn('X',PX,pX); pY=geo.solve_horn('Y',PY,pY)
    R,PX,PY=eye_points(p,t)
    cy=rod_caps('Y',R,PY,pY)
    print((p,t),'aY %.1f'%np.degrees(pY))
    for c in cy:
        q=c[1]; r=c[2]
        def pol(v): 
            vb=R.T@v; return np.degrees(np.arccos(vb[2]/np.linalg.norm(vb))),np.degrees(np.arctan2(vb[1],vb[0])),np.linalg.norm(v),np.degrees(np.arctan2(v[1],v[2]))
        print("  %-22s p=%s q=%s  |p|=%.1f |q|=%.1f  ang_yz p %.0f q %.0f  ball-frame pol/fi p %.0f/%.0f q %.0f/%.0f"%(c[0],np.round(q,1),np.round(r,1),np.linalg.norm(q),np.linalg.norm(r),pol(q)[3],pol(r)[3],pol(q)[0],pol(q)[1],pol(r)[0],pol(r)[1]))
