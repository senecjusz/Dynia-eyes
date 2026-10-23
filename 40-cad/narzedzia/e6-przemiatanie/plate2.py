# Szerokość płyty okna Uchwytu między oknem a wycięciem na pręty (wycięcie = obszar zamiatany przez pręty + 0,5)
import sys; A=sys.argv[1:]; sys.argv=[sys.argv[0],"4"]
import numpy as np, json
import full; from full import *
import uchwyt
exec(open('sweep.py').read().split("psis=")[0].split("RT=np.array")[1].join(["RT=np.array",""]) if False else "")
RT=np.array(json.load(open('reach.json')))
def reach_ok(p,t):
    a=np.degrees(np.arctan2(t/18.0,p/28.0))%360; n=max(abs(p)/28.0,abs(t)/18.0)
    return n<=np.interp(a,np.append(RT[:,0],360),np.append(RT[:,1],RT[0,1]))+1e-6
ZL=float(A[0]); ZH=float(A[1])
nb=360; cut=np.full(nb,99.0); cutw=np.full(nb,99.0)
for p in np.arange(-28,28.01,1):
    pX=pY=0
    for t in np.arange(-18,18.01,1):
        R,PX,PY=eye_points(p,t); pX=geo.solve_horn('X',PX,pX); pY=geo.solve_horn('Y',PY,pY)
        if not reach_ok(p,t): continue
        caps=[c for c in rod_caps('X',R,PX,pX)+rod_caps('Y',R,PY,pY) if 'Ramię' not in c[0] and 'czop' not in c[0]]
        # próbkuj przekrój kapsuł w płaszczyznach płyty: punkty powierzchni kapsuł
        for nm,a,b,r in caps:
            ab=b-a; L=np.linalg.norm(ab); e=ab/L; n1=np.cross(e,[0.3,0.5,0.81]); n1/=np.linalg.norm(n1); n2=np.cross(e,n1)
            s=np.linspace(-r,L+r,int((L+2*r)/0.3)+2); ang=np.linspace(0,2*np.pi,48,endpoint=False)
            S,A=np.meshgrid(s,ang); S=S.ravel(); A=A.ravel()
            sc=np.clip(S,0,L); rr=np.where((S<0)|(S>L),np.sqrt(np.maximum(r*r-(S-sc)**2,0)),r)
            pts=a+np.outer(sc,e)+np.outer(S-sc,e)+np.outer(rr*np.cos(A),n1)+np.outer(rr*np.sin(A),n2)
            pb=(R.T@pts.T).T
            m=(pb[:,2]>=ZL)&(pb[:,2]<=ZH)
            if not m.any(): continue
            q=pb[m]; ph=np.degrees(np.arctan2(q[:,1],q[:,0])); rad=np.hypot(q[:,0],q[:,1])
            k=((ph+180)/360*nb).astype(int)%nb
            np.minimum.at(cut,k,rad)
            if abs(p)<=25 and abs(t)<=15: np.minimum.at(cutw,k,rad)
H=uchwyt.H; a=np.degrees(np.arctan2(H[:,1],H[:,0])); rin=np.hypot(H[:,0],H[:,1])
win=np.array([rin[np.argmin(np.abs(((a-((i+0.5)/nb*360-180))+180)%360-180))] for i in range(nb)])
w=cut-0.5-win
print("szerokość płyty między oknem a wycięciem (cały zakres osiągalny, luz 0,5):")
for d in range(-180,180,10):
    i=int((d+180)/360*nb); print("  φ %+4d: okno %.2f  wycięcie od %.2f  szer. %.2f"%(d,win[i],cut[i]-0.5 if cut[i]<90 else 99,w[i] if cut[i]<90 else 99))
bad=[(i/nb*360-180,w[i]) for i in range(nb) if w[i]<4]
print("φ z szerokością < 4 mm:",bad[0][0] if bad else None,"…",bad[-1][0] if bad else None,"min %.2f"%min(w))
np.save('plate_cut.npy',np.stack([cut,cutw,win]))
