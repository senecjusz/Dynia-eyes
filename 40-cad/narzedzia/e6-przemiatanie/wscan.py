import numpy as np, sys
from window import *
for zc in (-3.0,-4.0,-6.0,-9.0):
    H=window_polar(zc); r=np.hypot(H[:,0],H[:,1]); a=np.degrees(np.arctan2(H[:,1],H[:,0]))
    ri=lambda d: r[np.argmin(np.abs(((a-d+180)%360)-180))]
    zs,an=contact_z(H,zc,1.5,boundary(28,18,8),tol=0.15)
    print("zc %.1f: okno r(0)=%.2f r(90)=%.2f r(45)=%.2f rmax %.2f; styk z %.2f..%.2f"%(zc,ri(0),ri(90),ri(45),r.max(),zs.min() if len(zs) else 0,zs.max() if len(zs) else 0))
