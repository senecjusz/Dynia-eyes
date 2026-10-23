import numpy as np, sys
import geo
from geo import *
if len(sys.argv)>1: P['h']=float(sys.argv[1]); setup_studs()
print("czopy M5: X",np.round(STUD['X'],3),"pochylenie %.1f"%np.degrees(np.arccos(STUD['X'][0])),"L %.2f"%STUD['X_L'],"| Y",np.round(STUD['Y'],3),"pochylenie %.1f"%np.degrees(np.arccos(STUD['Y'][0])),"L %.2f"%STUD['Y_L'])
rows=[]; prevX=prevY=0.0
grid=[(p,t) for p in np.arange(-28,28.01,1) for t in np.arange(-18,18.01,1)]
for p,t in grid:
    R,PX,PY=eye_points(p,t)
    aX=solve_horn('X',PX,0.0); aY=solve_horn('Y',PY,0.0)
    if aX is None or aY is None: print("BRAK",p,t); continue
    out=[p,t,np.degrees(aX),np.degrees(aY)]
    for nm,Pt,a in (('X',PX,aX),('Y',PY,aY)):
        A,H,d=horn_H(nm,a); u=(Pt-H)/np.linalg.norm(Pt-H)
        misH=np.degrees(np.arcsin(abs(u@d)))
        misB=np.degrees(np.arcsin(abs(u@(R@np.array([0,1.0,0])))))
        C,r,v0=horn_frame(nm); tang=rot_x(np.array([0,0,1.0]) if v0[1]>0 else np.array([0,0,-1.0]),a)
        # styczna do ruchu H: dH/da
        e=1e-4; dH=(horn_H(nm,a+e)[1]-horn_H(nm,a-e)[1]); dH/=np.linalg.norm(dH)
        pressH=np.degrees(np.arccos(min(1,abs(u@dH))))
        out+= [misH,misB,pressH]
    rows.append(out)
r=np.array(rows)
w=(abs(r[:,0])<=25)&(abs(r[:,1])<=15)
print("serwo X: praca %.1f..%.1f, ogr ±28/±18 %.1f..%.1f"%(r[w,2].min(),r[w,2].max(),r[:,2].min(),r[:,2].max()))
print("serwo Y: praca %.1f..%.1f, ogr %.1f..%.1f"%(r[w,3].min(),r[w,3].max(),r[:,3].min(),r[:,3].max()))
print("X: kulka M5 max %.1f, M2 max %.1f, nacisk orczyk %.1f | Y: M5 %.1f, M2 %.1f, nacisk %.1f"%(r[:,4].max(),r[:,5].max(),r[:,6].max(),r[:,7].max(),r[:,8].max(),r[:,9].max()))
for (p,t) in [(0,0),(25,0),(-25,0),(0,15),(0,-15),(25,15),(25,-15),(-25,15),(-25,-15),(28,18),(-28,-18),(28,-18),(-28,18)]:
    q=r[(r[:,0]==p)&(r[:,1]==t)][0]; print("  psi %+3d theta %+3d: serwo X %+6.1f Y %+6.1f"%(p,t,q[2],q[3]))
# momenty
def ang(p,t):
    R,PX,PY=eye_points(p,t); return np.array([solve_horn('X',PX,0.0),solve_horn('Y',PY,0.0)])
W=[]
for p in np.arange(-25,25.1,2.5):
    for t in np.arange(-15,15.1,2.5):
        e=0.05; J=np.zeros((2,2)); J[:,0]=(ang(p+e,t)-ang(p-e,t))/(2*e*d2r); J[:,1]=(ang(p,t+e)-ang(p,t-e))/(2*e*d2r)
        Ji=np.linalg.inv(J)
        for M in (np.array([0.5,0]),np.array([0,0.5])):
            T=Ji.T@M; W.append((abs(T[0]),abs(T[1]),p,t))
print("moment przy 0,5 N·m: X %.3f, Y %.3f"%(max(w_[0] for w_ in W),max(w_[1] for w_ in W)))
