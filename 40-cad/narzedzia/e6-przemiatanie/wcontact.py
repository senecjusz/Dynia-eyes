import numpy as np, sys, window as W
from geo import Reye
zc=float(sys.argv[1]) if len(sys.argv)>1 else -6.0
W.PP=W.post_pts(720,280)
H=W.window_polar(zc)
ph=np.linspace(0,2*np.pi,720,endpoint=False)
res=[]
for (p,t) in W.boundary(28,18,12):
    R=Reye(p,t); b=(R.T@W.PP.T).T; m=(b[:,2]>=zc-1.5)&(b[:,2]<=zc+1.5)
    if not m.any(): continue
    q=b[m][:,:2]; d=W.edge_d(q,H) if hasattr(W,'edge_d') else None
    A=H; B=np.roll(H,-1,0); AB=B-A; AP=q[:,None,:]-A[None]; tt=np.clip(np.sum(AP*AB[None],-1)/np.sum(AB*AB,-1)[None],0,1)
    d=np.linalg.norm(q[:,None,:]-(A[None]+tt[...,None]*AB[None]),axis=-1).min(1)
    k=d<0.04; w=W.PP[m][k]
    for x in w: res.append((p,t,x[2],np.degrees(np.arctan2(x[1],x[0]))%360))
res=np.array(res)
print("styk: z %.2f..%.2f"%(res[:,2].min(),res[:,2].max()))
for az in (0,90,180,270):
    sel=res[np.abs(((res[:,3]-az+180)%360)-180)<=12]
    if len(sel): print(" azymut %3d±12: z %.2f..%.2f"%(az,sel[:,2].min(),sel[:,2].max()))
    else: print(" azymut %3d±12: brak styku"%az)
hist=np.histogram(res[:,2],bins=np.arange(-14,-5,0.5))
print(" histogram z:",list(zip(np.round(hist[1][:-1],1),hist[0])))
