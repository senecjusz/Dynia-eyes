import sys,os; A=sys.argv[1:]; sys.argv=[sys.argv[0],"4"]
os.environ.setdefault('HYT','19')
import full
from full import *
src=open('freemap.py').read(); body=src[src.index('mov=[]'):src.index('Rs=float')]
exec(body.replace("lid_caps(LG,'G',t,prev,0.4,-1,1)","lid_caps(LG,'G',t,prev,0.4,-1,1)").replace("np.arange(-0.25,58,1),58","np.arange(-0.25,56.75,1),56.75").replace("np.arange(-0.25,34,1),34","np.arange(-0.25,32.75,1),32.75"))
mov2=mov+[c for c in fixed_caps() if 'słupek' in c[0] or 'wspornika' in c[0]]
P1=np.array([c[1] for c in mov2]);Q1=np.array([c[2] for c in mov2]);R1=np.array([c[3] for c in mov2]);lab=[c[0] for c in mov2]
for a in list(range(55,90,5))+list(range(130,186,5))+list(range(215,256,5))+list(range(265,290,5))+list(range(320,341,5)):
    ca,sa=np.cos(a*d2r),np.sin(a*d2r)
    # ucho: płytka R31..37,75, z -37..-41 -> 2 kapsuły r2 wzdłuż promienia na z -38 i -40
    caps=[('u',np.array([33*ca,33*sa,z]),np.array([35.75*ca,35.75*sa,z]),2.0) for z in (-38.5,-39.5)]
    s=clr(caps); print(a,"%.2f %s"%s)
