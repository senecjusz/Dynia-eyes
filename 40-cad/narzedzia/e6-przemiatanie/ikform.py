import sys; H=sys.argv[1] if len(sys.argv)>1 else "4"; sys.argv=[sys.argv[0],H]
import numpy as np
import full; from full import *
for nm in ('X','Y'):
    C,r,v0=geo.horn_frame(nm); w=r*v0+P['h']*STUD[nm]; L=STUD[nm+'_L']
    print("%s: C = (%.3f; %.3f; %.3f), w = (%.3f; %.3f; %.3f), L = %.3f, P0 = (%s)"%(nm,*C,*w,L,"pktR %.1f, pktZ %.1f"%(P['pktR'],P['pktZ'])))
    errs=[]
    for p in (-28,-10,0,15,28):
        for t in (-18,-5,0,9,18):
            R,PX,PY=eye_points(p,t); Pt=PX if nm=='X' else PY
            q=Pt-C; K=(w@w+q@q-L*L)/2
            A=q[1]*w[1]+q[2]*w[2]; B=q[2]*w[1]-q[1]*w[2]
            base=np.arctan2(B,A); da=np.arccos((K-q[0]*w[0])/np.hypot(A,B))
            cands=[base+da,base-da]; cands=[((c+np.pi)%(2*np.pi))-np.pi for c in cands]
            a=min(cands,key=abs); ref=geo.solve_horn(nm,Pt,0.0)
            errs.append(abs(a-ref))
    # która gałąź
    R,PX,PY=eye_points(0,0); Pt=PX if nm=='X' else PY; q=Pt-C; K=(w@w+q@q-L*L)/2
    A=q[1]*w[1]+q[2]*w[2]; B=q[2]*w[1]-q[1]*w[2]; base=np.arctan2(B,A); da=np.arccos((K-q[0]*w[0])/np.hypot(A,B))
    print("   max błąd wzoru %.2e rad; gałąź w zerze: %s (base %.2f°, da %.2f°)"%(max(errs),'+' if abs(base+da)<abs(base-da) else '−',np.degrees(base),np.degrees(da)))
print("STUD X",np.round(STUD['X'],4),"Y",np.round(STUD['Y'],4))
print("xh X %.2f Y %.2f (płaszczyzna orczyka fabrycznego), Ramię od xh-1 do xh+5"%(P['X']['xh'],P['Y']['xh']))
for nm in ('X','Y'):
    A0,H0,d=geo.horn_H(nm,0.0); print(nm,"kulka M5 w zerze H0 = (%.2f; %.2f; %.2f), podstawa czopu A0 = (%.2f; %.2f; %.2f)"%(*H0,*A0))
