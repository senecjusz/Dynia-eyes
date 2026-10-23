# Ogranicznik gałki: okno w płycie Uchwytu (układ gałki) wokół Słupka (świat). Pełne bryły: grubość płyty, skończony Słupek.
import numpy as np, sys
from geo import Reye, d2r
RP=7.65; ZTOP=-5.5; ZBOT=-33.0
def post_pts(n_phi=180,n_z=60):
    ph=np.linspace(0,2*np.pi,n_phi,endpoint=False); z=np.linspace(ZBOT,ZTOP,n_z)
    P,Z=np.meshgrid(ph,z); pts=np.stack([RP*np.cos(P).ravel(),RP*np.sin(P).ravel(),Z.ravel()],1)
    # krawędź górna (fazka 0,5 pomijam – zachowawczo ostra krawędź)
    return pts
PP=post_pts()
def slab_pts(psi,th,zc,half):
    R=Reye(psi,th); b=(R.T@PP.T).T
    m=(b[:,2]>=zc-half)&(b[:,2]<=zc+half)
    # dodatkowo przecięcia z płaszczyznami brzegowymi płyty (gęściej): punkty na odcinkach tworzących
    return b[m]
def hull(pts):
    pts=sorted(set(map(tuple,np.round(pts,4))))
    if len(pts)<3: return np.array(pts)
    def cross(o,a,b): return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
    lo=[];up=[]
    for p in pts:
        while len(lo)>=2 and cross(lo[-2],lo[-1],p)<=0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(up)>=2 and cross(up[-2],up[-1],p)<=0: up.pop()
        up.append(p)
    return np.array(lo[:-1]+up[:-1])
def poly_dist(Q,H):
    # odległość punktów Q (N,2) od brzegu wielokąta H (M,2); znak + na zewnątrz? zwracamy (d, inside)
    A=H; B=np.roll(H,-1,0); AB=B-A
    AP=Q[:,None,:]-A[None,:,:]; t=np.clip(np.sum(AP*AB[None],-1)/np.sum(AB*AB,-1)[None],0,1)
    C=A[None]+t[...,None]*AB[None]; d=np.linalg.norm(Q[:,None,:]-C,axis=-1).min(1)
    cr=AB[None,:,0]*AP[...,1]-AB[None,:,1]*AP[...,0]; inside=np.all(cr>=-1e-9,1)
    return d,inside
import os
CH=float(os.environ.get('WCH','99'))   # fazka narożników zakresu: 0,6|ψ| + 0,8|θ| <= CH
def boundary(P0,T0,n=16):
    b=[]
    for p in np.linspace(-P0,P0,2*n+1): b+=[(p,T0),(p,-T0)]
    for t in np.linspace(-T0,T0,2*n+1): b+=[(P0,t),(-P0,t)]
    out=[]
    for (p,t) in b:
        v=0.6*abs(p)+0.8*abs(t)
        if v>CH:
            # rzut na linię fazki wzdłuż kierunku do środka
            k=CH/v; p,t=p*k,t*k
        out.append((p,t))
    return out
def window(zc,half=1.5,P0=28,T0=18):
    allp=[]; contact=[]
    for (p,t) in boundary(P0,T0):
        s=slab_pts(p,t,zc,half); allp.append(s[:,:2])
    H=hull(np.vstack(allp)); return H
def margin(H,zc,half,poses):
    worst=(99,None)
    for (p,t) in poses:
        s=slab_pts(p,t,zc,half)
        if len(s)==0: continue
        d,ins=poly_dist(s[:,:2],H); d=np.where(ins,d,-d); i=np.argmin(d)
        if d[i]<worst[0]: worst=(d[i],(p,t))
    return worst
def contact_z(H,zc,half,poses,tol=0.05):
    # z świata punktów Słupka leżących przy oknie (d<tol) w pozycjach granicznych
    zs=[]; ang=[]
    for (p,t) in poses:
        R=Reye(p,t); b=(R.T@PP.T).T; m=(b[:,2]>=zc-half)&(b[:,2]<=zc+half)
        if not m.any(): continue
        d,ins=poly_dist(b[m][:,:2],H); k=d<tol
        w=PP[m][k]; zs+=list(w[:,2]); ang+=list(np.degrees(np.arctan2(w[:,1],w[:,0])))
    return np.array(zs),np.array(ang)
if __name__=='__main__':
    for zc in [float(x) for x in sys.argv[1:]] or [-6.0]:
        H=window(zc)
        r=np.hypot(H[:,0],H[:,1]); a=np.degrees(np.arctan2(H[:,1],H[:,0]))
        def rad_at(deg):
            i=np.argmin(np.abs(((a-deg+180)%360)-180)); return r[i]
        work=[(p,t) for p in np.arange(-25,25.01,1) for t in np.arange(-15,15.01,1)]
        m=margin(H,zc,1.5,work)
        zs,an=contact_z(H,zc,1.5,boundary(28,18,8))
        print("z płyty %.1f (3 mm): okno x %.2f y %.2f  rmax %.2f | zapas w pracy %.2f przy %s | styk na Słupku z %.2f..%.2f"%(zc,rad_at(0),rad_at(90),r.max(),m[0],m[1],zs.min(),zs.max()))
def window_polar(zc,half=1.5,P0=28,T0=18,nb=720):
    rb=np.zeros(nb)
    for (p,t) in boundary(P0,T0,24):
        s=slab_pts(p,t,zc,half)
        a=np.arctan2(s[:,1],s[:,0]); r=np.hypot(s[:,0],s[:,1])
        k=((a+np.pi)/(2*np.pi)*nb).astype(int)%nb
        np.maximum.at(rb,k,r)
    rr=np.maximum(np.maximum(rb,np.roll(rb,1)),np.roll(rb,-1))
    ph=(np.arange(nb)+0.5)/nb*2*np.pi-np.pi
    return np.stack([rr*np.cos(ph),rr*np.sin(ph)],1)
def poly_inside(Q,H):
    # parzystość przecięć (wielokąt niewypukły)
    x,y=Q[:,0],Q[:,1]; ins=np.zeros(len(Q),bool)
    A=H; B=np.roll(H,-1,0)
    for (x1,y1),(x2,y2) in zip(A,B):
        c=((y1>y)!=(y2>y)) & (x < (x2-x1)*(y-y1)/(y2-y1+1e-12)+x1)
        ins^=c
    return ins
