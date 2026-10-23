import sys; sys.argv=[sys.argv[0],"4"]
import numpy as np, os
os.environ.setdefault('HYT','19')
import full; from full import *
# moduł Płyty w położeniu montażowym: gałka 0,0, powieki zamknięte t 0,5 (ramiona serw powiek), serwa X/Y w zerze
R,PX,PY=eye_points(0,0); aX=geo.solve_horn('X',PX,0); aY=geo.solve_horn('Y',PY,0)
caps=rod_caps('X',R,PX,aX)+rod_caps('Y',R,PY,aY)+fixed_caps()
for which,c in (('G',LG),('D',LD)):
    cc,b=lid_caps(c,which,0.5,None,0.4 if which=='G' else 0.15,-1,-1 if which=='D' else 1)
    caps+=[x for x in cc if 'ramię orczyka' in x[0]]
pts,rad,lab=sample_caps(caps,0.3)
# rozszerz kapsuły o promień (próbki na powierzchni w płaszczyźnie xy)
P=[];L=[]
for p,r,l in zip(pts,rad,lab):
    for a in np.linspace(0,2*np.pi,12,endpoint=False):
        for dz in (-r,0,r):
            P.append(p+np.array([r*np.cos(a),r*np.sin(a),dz])); L.append(l)
for nm,b in fixed_boxes():
    xs=np.linspace(*b['x'],12); ys=np.linspace(*b['y'],8); zs=np.linspace(*b['z'],12)
    for x in xs:
        for y in ys:
            for z in zs: P.append(np.array([x,y,z])); L.append(nm)
for nm,cy in fixed_cyls():
    p,q,r=cy
    for s in np.linspace(0,1,10):
        for a in np.linspace(0,2*np.pi,16,endpoint=False):
            P.append(p+s*(q-p)+np.array([0,r*np.cos(a),r*np.sin(a)])); L.append(nm)
P=np.array(P); rho=np.hypot(P[:,0],P[:,1]); ang=np.degrees(np.arctan2(P[:,1],P[:,0]))%360
m=(rho>=30.0)&(P[:,2]>=-41.0)
print("kąty zajęte przez moduł przy R>=30, z>=-41:")
occ={}
for a,l in zip(ang[m],np.array(L)[m]): occ.setdefault(int(a//5)*5,set()).add(l.split(' – ')[0])
for k in range(0,360,5): print(" %3d: %s"%(k,', '.join(sorted(occ.get(k,[])))[:90]))
