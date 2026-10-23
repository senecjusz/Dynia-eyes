import sys; sys.argv=[sys.argv[0],"4"]
import numpy as np
import full; from full import *
mx={'w':[0,0,0,0,0,0],'s':[0,0,0,0,0,0]}
for p in np.arange(-28,28.1,1):
    for t in np.arange(-18,18.1,1):
        k='w' if abs(p)<=25 and abs(t)<=15 else 's'
        R,PX,PY=eye_points(p,t)
        for j,(nm,Pt) in enumerate((('X',PX),('Y',PY))):
            a=geo.solve_horn(nm,Pt,0.0); A,H,d=geo.horn_H(nm,a); u=(Pt-H)/np.linalg.norm(Pt-H)
            m5=np.degrees(np.arcsin(abs(u@d))); m2=np.degrees(np.arcsin(abs(u@(R@np.array([0,1.0,0])))))
            e=1e-5; dH=(geo.horn_H(nm,a+e)[1]-geo.horn_H(nm,a-e)[1]); dH/=np.linalg.norm(dH)
            pr=np.degrees(np.arccos(min(1,abs(u@dH))))
            v=mx[k]; v[j*3]=max(v[j*3],m5); v[j*3+1]=max(v[j*3+1],m2); v[j*3+2]=max(v[j*3+2],pr)
for k,v in mx.items(): print(k,"X: M5 %.1f M2 %.1f nacisk %.1f | Y: M5 %.1f M2 %.1f nacisk %.1f"%tuple(v))
