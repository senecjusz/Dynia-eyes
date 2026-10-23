import numpy as np, sys
from window import *
zc=float(sys.argv[1]) if len(sys.argv)>1 else -6.0
H=window_polar(zc)
def dist_in(s):
    A=H; B=np.roll(H,-1,0); AB=B-A
    AP=s[:,None,:]-A[None]; t=np.clip(np.sum(AP*AB[None],-1)/np.sum(AB*AB,-1)[None],0,1)
    d=np.linalg.norm(s[:,None,:]-(A[None]+t[...,None]*AB[None]),axis=-1).min(1)
    return np.where(poly_inside(s,H),d,-d)
def fits(p,t):
    s=slab_pts(p,t,zc,1.5)[:,:2]
    return len(s)==0 or dist_in(s).min()>-0.02
for ang in range(0,91,15):
    c,s=np.cos(np.radians(ang)),np.sin(np.radians(ang)); lo,hi=0.5,1.6
    for _ in range(25):
        m=(lo+hi)/2; n=max(abs(c),abs(s))
        if fits(28*m*c/n,18*m*s/n): lo=m
        else: hi=m
    n=max(abs(c),abs(s)); print("kier %3d: psi %+6.2f theta %+6.2f"%(ang,28*lo*c/n,18*lo*s/n))
work=[(p,t) for p in np.arange(-25,25.01,1) for t in np.arange(-15,15.01,1)]
w=min((dist_in(slab_pts(p,t,zc,1.5)[:,:2]).min(),(p,t)) for p,t in work)
r=np.hypot(H[:,0],H[:,1]); print("zapas w pracy %.2f przy %s; okno r %.2f..%.2f, x %.2f, y %.2f"%(w[0],w[1],r.min(),r.max(),r[np.argmin(np.abs(np.arctan2(H[:,1],H[:,0])))],r[np.argmin(np.abs(np.arctan2(H[:,1],H[:,0])-np.pi/2))]))
import os
np.save(os.environ.get('WOUT','okno_%g.npy'%zc),H)
