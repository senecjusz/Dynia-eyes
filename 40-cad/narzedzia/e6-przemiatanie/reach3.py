import numpy as np, json
exec(open('reach2.py').read().split("for ang in range")[0])
tab=[]
for ang in range(0,360,5):
    c,s=np.cos(np.radians(ang)),np.sin(np.radians(ang)); lo,hi=0.5,1.6
    for _ in range(22):
        m=(lo+hi)/2; n=max(abs(c),abs(s))
        if fits(28*m*c/n,18*m*s/n): lo=m
        else: hi=m
    tab.append((ang,lo))
import os
json.dump(tab,open(os.environ.get('ROUT','reach.json'),'w')); print(min(t[1] for t in tab),max(t[1] for t in tab))
