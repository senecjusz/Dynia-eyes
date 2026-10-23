import sys; sys.argv=[sys.argv[0],"4"]
import numpy as np
import full; from full import *
for which,c,ts,sg in (('G',LG,[-0.25,0.5,51.0,56.0,56.75],1),('D',LD,[-0.25,0.5,27.0,32.0,32.75],-1)):
    prev=None; out=[]
    tt=np.append(np.arange(-0.25,ts[-1],0.25),ts[-1])
    bs={}
    for t in tt:
        J,H,b=geo.lid_state(c,t,sg,prev); prev=b; bs[round(t,2)]=(np.degrees(b),H)
    b0=bs[0.5][0]
    for t in ts:
        b,H=bs[round(t,2)]
        edge=(-9+t) if which=='G' else (-11-t)
        print("%s t %6.2f (krawędź %+6.1f°): kąt ramienia b %7.2f°, od zamknięcia %+7.2f°, H (y %.1f z %.1f)"%(which,t,edge,b,b-b0,H[1],H[2]))
    # przełożenie lokalne
    for t in (0.5,28 if which=='G' else 16,ts[-2]):
        b1=bs[round(t,2)][0]; b2=bs[round(t+0.25,2)][0] if round(t+0.25,2) in bs else bs[round(t-0.25,2)][0]
        print("   dφ_serwa/dφ_powieki przy t %.1f: %.2f"%(t,abs(b2-b1)/0.25))
