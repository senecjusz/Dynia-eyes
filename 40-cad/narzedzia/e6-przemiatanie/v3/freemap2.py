import numpy as np, sys
A=sys.argv[1:]; sys.argv=[sys.argv[0],"4"]
exec(open('freemap.py').read().split("Rs=float")[0].split("import full",1)[1].replace("from full import *","from full import *",1)) if False else None
import full
from full import *
src=open('freemap.py').read(); body=src[src.index('mov=[]'):src.index('Rs=float')]
exec(body)
for zA in (-37,-35,-33,-31,-29):
    line=[]
    for a in range(0,360,10):
        ca,sa=np.cos(a*d2r),np.sin(a*d2r)
        r=clr([('r',np.array([8*ca,8*sa,zA]),np.array([33*ca,33*sa,zA]),2.0)])
        s=clr([('s',np.array([33*ca,33*sa,zA]),np.array([33*ca,33*sa,-68]),3.0)])
        line.append("%d:%.1f/%.1f"%(a,r[0],s[0]))
    print(zA,' '.join(line))
