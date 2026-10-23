import numpy as np
from window import *
zc=-6.0; H=window(zc)
def fits(p,t):
    s=slab_pts(p,t,zc,1.5)
    if len(s)==0: return True
    d,ins=poly_dist(s[:,:2],H); return bool(np.all(ins|(d<0.02)))
out=[]
for ang in range(0,360,15):
    c,s=np.cos(np.radians(ang)),np.sin(np.radians(ang))
    # promień w znormalizowanej przestrzeni (psi/28, theta/18) – kwadrat granicy ma ||.||_inf=1
    lo,hi=0.5,1.6
    for _ in range(30):
        m=(lo+hi)/2
        n=max(abs(c),abs(s)); p=28*m*c/n; t=18*m*s/n
        if fits(p,t): lo=m
        else: hi=m
    n=max(abs(c),abs(s)); out.append((ang,lo,28*lo*c/n,18*lo*s/n))
for o in out: print("kier %3d: skala %.3f  psi %+6.2f theta %+6.2f"%o)
