#!/usr/bin/env python3
# Model pełny dużego oka v3 (Opus). O = środek kuli, +z z dyni, +y góra, +x w prawo (patrząc na dynię).
# Kąty dokumentu: psi (lewo-prawo), theta (góra-dół, + = w górę). Wewnętrznie R = Rx(-theta) Ry(psi).
import numpy as np
d2r = np.pi/180
def Rx(t):
    c,s=np.cos(t),np.sin(t); return np.array([[1,0,0],[0,c,-s],[0,s,c]])
def Ry(p):
    c,s=np.cos(p),np.sin(p); return np.array([[c,0,s],[0,1,0],[-s,0,c]])
def Reye(psi,theta): return Rx(-theta*d2r)@Ry(psi*d2r)

P = dict(
    ZS=-49.0, ZS_PG=-60.0,
    kulaR=30.0, kulaRin=28.0, rim=115.0,
    pktR=18.5, pktZ=-6.0,
    # ramiona orczyków: płaszczyzna orczyka fabrycznego xh, Ramię drukowane od xh-1 do xh+3 (4 mm), szer. 8
    X=dict(xh=19.0, yc=-13.0, r=13.0, u0=+1),      # ramię w zerze skierowane w +y (do góry)
    Y=dict(xh=11.5, yc=3.0, r=15.0, u0=+1),
    h=7.0,                # wysokość środka kulki M5 nad powierzchnią Ramienia (B1)
    rodR=2.5,             # pręt Ø5
    m2_housR=3.5, m2_housL=9.0, m2_nutR=2.3, m2_nutL=1.6,
    m5_housR=7.0, m5_housL=12.0, m5_nutR=4.6, m5_nutL=4.0, m5_blockR=4.5, m5_blockL=8.0,
    m5_ballR=5.0, m5_studR=2.5, ramieW=4.0,
)
# ---------------- gałka ----------------
def eye_points(psi,theta):
    R=Reye(psi,theta)
    PX=R@np.array([P['pktR'],0,P['pktZ']]); PY=R@np.array([0,P['pktR'],P['pktZ']])
    return R,PX,PY
# ---------------- ramiona orczyków z czopem M5 pochylonym ----------------
def horn_frame(name):
    c=P[name]; C=np.array([c['xh']+3.0, c['yc'], P['ZS']])     # punkt na powierzchni Ramienia na osi wałka
    v0=np.array([0,float(c['u0']),0])
    return C, c['r'], v0
def rot_x(v,a):
    ca,sa=np.cos(a),np.sin(a); return np.array([v[0], v[1]*ca-v[2]*sa, v[1]*sa+v[2]*ca])
STUD={}
def setup_studs():
    # czop M5 prostopadły do średniego kierunku pręta w zerze (Fable W2)
    for name,Pt in (('X',np.array([P['pktR'],0,P['pktZ']])),('Y',np.array([0,P['pktR'],P['pktZ']]))):
        C,r,v0=horn_frame(name); A0=C+r*v0
        u=(Pt-A0); u/=np.linalg.norm(u)
        d=np.array([1.0,0,0])-np.dot([1.0,0,0],u)*u; d/=np.linalg.norm(d)
        STUD[name]=d
        H0=A0+P['h']*d
        STUD[name+'_L']=np.linalg.norm(Pt-H0)
setup_studs()
def horn_H(name,a):
    C,r,v0=horn_frame(name)
    A=C+r*rot_x(v0,a); d=rot_x(STUD[name],a)
    return A, A+P['h']*d, d
def solve_horn(name,Pt,prev=0.0):
    L=STUD[name+'_L']
    f=lambda a: np.linalg.norm(horn_H(name,a)[1]-Pt)-L
    # szukaj zera w okolicy prev
    best=None
    for span in (0.4,0.8,1.5):
        aa=np.linspace(prev-span,prev+span,121); ff=np.array([f(x) for x in aa])
        idx=np.where(np.sign(ff[:-1])!=np.sign(ff[1:]))[0]
        if len(idx):
            cands=[]
            for i in idx:
                lo,hi=aa[i],aa[i+1]
                for _ in range(40):
                    m=(lo+hi)/2
                    if np.sign(f(m))==np.sign(f(lo)): lo=m
                    else: hi=m
                cands.append((lo+hi)/2)
            best=min(cands,key=lambda x:abs(x-prev)); break
    return best
def rod_state(psi,theta,prevX=0.0,prevY=0.0):
    R,PX,PY=eye_points(psi,theta)
    aX=solve_horn('X',PX,prevX); aY=solve_horn('Y',PY,prevY)
    return R,PX,PY,aX,aY
# ---------------- powieki ----------------
LID=dict(Rin=31.2,Rout=33.4,Rrant=34.7)
# kąty krawędzi przedniej (w stopniach, wokół x, od +z ku +y): G zamknięta nominalnie -8,5, ogranicznik -9,25, otwarta 42, podążanie 47, ogr. 49
# t = obrót od zera v2 (G: krawędź -9; D: krawędź -11), t>0 = otwieranie
G_SPAN=99.5; D_SPAN=79.0
G_CUT=dict(x1=-2.0,x2=24.0,span=85.5)    # wycięcie tylnej krawędzi w pasie x (77° przy zamknięciu nominalnym)
def lidG_range(t):  # zakres kątów czaszy górnej w układzie świata dla punktu o danym x
    front=-9.0+t; return front, front+G_SPAN
def lidD_range(t):
    front=-11.0-t; return front-D_SPAN, front
# czworoboki powiek z v2 (synteza w v2/plan.py, sprawdzone przez recenzentów)
LG=dict(xJ=-22.0, rho=25.61694307060082, ph=92.0, xh=-30.0, n=-1, yc=18.0, zs=-60.0, r=20.0, b0=135.0, L=49.95)
LD=dict(xJ=-22.0, rho=25.61694307060082, ph=-92.0, xh=-21.0, n=-1, yc=-27.0, zs=-49.0, r=17.5, b0=30.0, L=41.69)
def J_of(c,t,sgn):
    a=(c['ph']+sgn*t)*d2r; return np.array([c['xJ'], c['rho']*np.sin(a), c['rho']*np.cos(a)])
def solve2(C,r,J,L,prev):
    Dy=C[0]-J[1]; Dz=C[1]-J[2]
    K=(L*L-Dy*Dy-Dz*Dz-r*r)/(2*r); rho=np.hypot(Dy,Dz)
    if abs(K)>rho: return None
    base=np.arctan2(Dz,Dy); da=np.arccos(K/rho)
    c=[base+da,base-da]; c=[((x-prev+np.pi)%(2*np.pi))-np.pi+prev for x in c]
    return min(c,key=lambda x:abs(x-prev))
def lid_state(c,t,sgn,prev=None):
    J=J_of(c,t,sgn); C=(c['yc'],c['zs'])
    b0=c['b0']*d2r
    if prev is None:
        # z zera
        J0=J_of(c,0,sgn); H0=np.array([C[0]+c['r']*np.cos(b0),C[1]+c['r']*np.sin(b0)])
        c['L']=np.hypot(H0[0]-J0[1],H0[1]-J0[2]); prev=b0
    b=solve2(C,c['r'],J,c['L'],prev)
    H=np.array([c['xh'],C[0]+c['r']*np.cos(b),C[1]+c['r']*np.sin(b)])
    return J,H,b
