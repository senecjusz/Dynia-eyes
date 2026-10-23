import sys; sys.argv=[sys.argv[0],"4"]
import numpy as np
import full; from full import *
def ang(p,t):
    R,PX,PY=eye_points(p,t); return np.array([geo.solve_horn('X',PX,0.0),geo.solve_horn('Y',PY,0.0)])
def leff(nm,p,t,a):
    R,PX,PY=eye_points(p,t); Pt=PX if nm=='X' else PY
    A,H,d=geo.horn_H(nm,a); u=(Pt-H)/np.linalg.norm(Pt-H)
    e=1e-5; dH=(geo.horn_H(nm,a+e)[1]-geo.horn_H(nm,a-e)[1])/(2*e)   # mm/rad
    return abs(u@dH)   # moment serwa = F * leff
res={'w':[0,0,0,0],'s':[0,0,0,0]}
for p in np.arange(-28,28.1,1):
    for t in np.arange(-18,18.1,1):
        k='w' if (abs(p)<=25 and abs(t)<=15) else 's'
        a=ang(p,t); e=0.05
        J=np.zeros((2,2)); J[:,0]=(ang(p+e,t)-ang(p-e,t))/(2*e*d2r); J[:,1]=(ang(p,t+e)-ang(p,t-e))/(2*e*d2r)
        lx=leff('X',p,t,a[0]); ly=leff('Y',p,t,a[1])
        # zablokowane serwo 0,18 N·m -> siła w pręcie
        fx=0.18e3/lx; fy=0.18e3/ly
        # ręka 0,5 N·m na gałce (dowolny kierunek w płaszczyźnie psi/theta)
        Ji=np.linalg.inv(J); best=[0,0]
        for phi in np.linspace(0,2*np.pi,36,endpoint=False):
            M=0.5*np.array([np.cos(phi),np.sin(phi)]); T=Ji.T@M
            best=[max(best[0],abs(T[0])*1e3/lx),max(best[1],abs(T[1])*1e3/ly)]
        r=res[k]; res[k]=[max(r[0],fx),max(r[1],fy),max(r[2],best[0]),max(r[3],best[1])]
for k,v in res.items(): print(("praca" if k=='w' else "ograniczniki")+": siła w pręcie przy zablokowanym serwie 0,18 N·m: X %.1f N, Y %.1f N; przy 0,5 N·m ręką: X %.1f N, Y %.1f N"%tuple(v))
