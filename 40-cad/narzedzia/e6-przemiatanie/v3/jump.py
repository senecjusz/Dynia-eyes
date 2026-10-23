import sys,json; sys.argv=[sys.argv[0],"4"]
import numpy as np
import full; from full import *
RT=np.array(json.load(open('reach.json')))
def scale_lim(p,t):
    a=np.degrees(np.arctan2(t/18.0,p/28.0))%360
    return np.interp(a,np.append(RT[:,0],360),np.append(RT[:,1],RT[0,1]))
def ik(p,t,g=(0,0)):
    R,PX,PY=eye_points(p,t); return np.array([geo.solve_horn('X',PX,g[0]),geo.solve_horn('Y',PY,g[1])])
def fk(a,g):
    x=np.array(g,float)
    for _ in range(30):
        f=ik(*x)-a; 
        if np.max(np.abs(f))<1e-7: return x
        e=0.01; J=np.zeros((2,2))
        for k in range(2):
            d=np.zeros(2); d[k]=e; J[:,k]=(ik(*(x+d))-ik(*(x-d)))/(2*e)
        x=x-np.linalg.solve(J,f)
        if np.max(np.abs(x))>60: return None
    return x
rng=np.random.default_rng(1)
def run(starts,targets,lab):
    over=0; worst=(0,None); n=0; out_work=0
    for A,B in zip(starts,targets):
        aA=ik(*A); aB=ik(*B); d=aB-aA; m=np.max(np.abs(d))
        g=np.array(A,float); hit=False; mx=0
        for s in np.linspace(0,m,40):
            a=aA+np.clip(np.abs(d),0,s)*np.sign(d)
            x=fk(a,g)
            if x is None: hit=True; break
            g=x; n_=max(abs(x[0])/28,abs(x[1])/18)/scale_lim(*x)
            mx=max(mx,n_)
            if abs(x[0])>25.001 or abs(x[1])>15.001: out_work+=0  # policz niżej
        if mx>1.0 or hit: over+=1
        if mx>worst[0]: worst=(mx,(A,B))
        n+=1
    print("%s: %d torów, %d dochodzi do okna (Słupek); największe wychylenie względem granicy okna %.3f przy %s"%(lab,n,over,worst[0],worst[1]))
# 1) skok między dowolnymi pozycjami pracy
S=[(rng.uniform(-25,25),rng.uniform(-15,15)) for _ in range(400)]; T=[(rng.uniform(-25,25),rng.uniform(-15,15)) for _ in range(400)]
run(S,T,"skok praca→praca (zanik prądu w ruchu)")
# 2) z dowolnego położenia ręcznego (do granicy okna) do pozycji z NVS (praca)
S2=[]
while len(S2)<400:
    p,t=rng.uniform(-28.3,28.3),rng.uniform(-18.4,18.4)
    if max(abs(p)/28,abs(t)/18)<=scale_lim(p,t): S2.append((p,t))
run(S2,T,"skok ręczne→NVS")
# 3) rampa w (ψ,θ): z NVS do celu po prostej – pozostaje w prostokącie pracy (wypukły)
print("rampa w (ψ,θ) z kinematyką odwrotną: tor = odcinek w prostokącie ±25/±15 (zbiór wypukły), czyli wewnątrz przemiatania 'praca'")
# przykład Astry
for A,B in (((27.4,-21.6),(0,0)),((25,15),(-25,-15)),((-25,15),(25,-15))):
    pass
