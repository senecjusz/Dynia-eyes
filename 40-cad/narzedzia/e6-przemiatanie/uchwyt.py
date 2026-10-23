# Uchwyt (układ gałki): płyta okna z_b -4,5..-7,5, okno = window_polar, ścianka w(φ); piasty kulek M2 i ramię do piasty X
import numpy as np, os
from window import window_polar, poly_inside
ZC=-6.0; HALF=1.5
H=np.load(os.environ.get('WIN','okno_-6.npy'))
ph=np.arctan2(H[:,1],H[:,0]); rin=np.hypot(H[:,0],H[:,1])
def wall(phd):
    # 2,0 mm w pasach ±25° wokół 0° i 90° (kulki M2), 3,0 gdzie indziej
    a=np.abs(((phd+180)%360)-180); b=np.abs(((phd-90+180)%360)-180)
    return np.where((a<=25)|(b<=25),float(os.environ.get('WALLN','2.0')),3.0)
rout=rin+wall(np.degrees(ph)); HO=np.stack([rout*np.cos(ph),rout*np.sin(ph)],1)
def edge_d(Q,Hp):
    A=Hp; B=np.roll(Hp,-1,0); AB=B-A
    AP=Q[:,None,:]-A[None]; t=np.clip(np.sum(AP*AB[None],-1)/np.sum(AB*AB,-1)[None],0,1)
    return np.linalg.norm(Q[:,None,:]-(A[None]+t[...,None]*AB[None]),axis=-1).min(1)
def ring_d(Pb):
    Q=Pb[:,:2]; inI=poly_inside(Q,H); inO=poly_inside(Q,HO)
    d2=np.minimum(edge_d(Q,H),edge_d(Q,HO)); inside=inO&~inI
    d2s=np.where(inside,-d2,d2)
    dz=np.abs(Pb[:,2]-ZC)-HALF
    out=np.where((d2s<=0)&(dz<=0),np.maximum(d2s,dz),np.hypot(np.maximum(d2s,0),np.maximum(dz,0)))
    return out
H2=float(os.environ.get('H2','3.5'))   # wys. środka kulki M2 nad czołem piasty (B1)
PK=float(os.environ.get('PKTR','19.5'))
BOSS=[('Uchwyt piasta M2 X',np.array([PK,-H2,-6.0]),np.array([PK,-H2-5.0,-6.0]),3.0),
      ('Uchwyt ramię do piasty X',np.array([14.0,-6.0,-6.0]),np.array([PK,-H2-2.5,-6.0]),1.5),
      ('Uchwyt piasta M2 Y',np.array([0.0,PK-H2,-6.0]),np.array([0.0,PK-H2-4.0,-6.0]),3.0)]
