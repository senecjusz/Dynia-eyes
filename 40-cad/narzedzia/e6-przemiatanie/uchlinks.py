import numpy as np, window as W
from geo import Reye
ph=np.linspace(0,2*np.pi,180,endpoint=False)
def cyl(R,z0,z1,nz):
    P,Z=np.meshgrid(ph,np.linspace(z0,z1,nz)); return np.stack([R*np.cos(P).ravel(),R*np.sin(P).ravel(),Z.ravel()],1)
PTS=np.vstack([cyl(7.65,-33,-5.5,120),cyl(5.5,-5.5,5.5,50)])
B=W.boundary(28,18,12)
for zb in (-4.5,-3,-1.5,0,1.5,3,4.5,5.5):
    rmax=0
    for p,t in B:
        b=(Reye(p,t).T@PTS.T).T; m=np.abs(b[:,2]-zb)<0.3
        if m.any(): rmax=max(rmax,np.hypot(b[m,0],b[m,1]).max())
    print("z_b %+5.1f: materiał nieruchomy do r %.2f"%(zb,rmax))
