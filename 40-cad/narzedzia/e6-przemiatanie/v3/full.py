#!/usr/bin/env python3
# Pełne przemiatanie v3. Bryły jako kapsuły (odcinek + promień), prostopadłościany i pola czasz.
import numpy as np, sys, itertools, json
import geo
from geo import *
H_KULKA = float(sys.argv[1]) if len(sys.argv)>1 else 4.0
MODE = sys.argv[2] if len(sys.argv)>2 else 'coarse'
P['h']=H_KULKA
def horn_frame(name):
    c=P[name]; C=np.array([c['xh']+5.0, c['yc'], P['ZS']]); v0=np.array([0,float(c['u0']),0]); return C,c['r'],v0
geo.horn_frame=horn_frame
import os
P['pktR']=float(os.environ.get('PKTR','19.5'))
P['Y']['r']=float(os.environ.get('YR','15')); P['X']['r']=float(os.environ.get('XR','13'))
HX_T=float(__import__('os').environ.get('HXT','27')); HY_T=float(__import__('os').environ.get('HYT','19'))
geo.setup_studs()
for _ in range(3):
    P['X']['xh']=HX_T-5.0-P['h']*STUD['X'][0]; P['Y']['xh']=HY_T-5.0-P['h']*STUD['Y'][0]; geo.setup_studs()
RIM_CUT = dict(X=(float(os.environ.get('XC0','0')),float(os.environ.get('XCH','25')),float(os.environ.get('XCE','104'))), Y=(float(os.environ.get('YC0','80')),float(os.environ.get('YCH','30')),float(os.environ.get('YCE','106'))))   # (kąt fi gałki, półszerokość, krawędź) – lokalne wycięcia krawędzi czaszy
WIN = None
# ---------------- serwa ----------------
def servo_parts(xh,n,yc,zs,flipped=False):
    # korpus 22,4 x 12,1 x 22,8 z luzem 0,4; wieża r6 do płaszczyzny orczyka; uszy 31,8 x 12,1 x 2 na wys. 18; klatka 2 mm (y,z)
    bot=xh-n*34.0; top=xh-n*11.2
    if not flipped: zr=(zs-17.3,zs+5.9); ze=(zs-21.6,zs+10.2); zface=zs+5.9
    else: zr=(zs-5.9,zs+17.3); ze=(zs-10.2,zs+21.6); zface=zs-5.9
    body=dict(x=(min(bot,top),max(bot,top)),y=(yc-6.45,yc+6.45),z=zr)
    cage=dict(x=body['x'],y=(yc-8.45,yc+8.45),z=(zr[0]-2,zr[1]+2))
    ex=xh-n*16.0; ear=dict(x=(min(ex,ex-n*2),max(ex,ex-n*2)),y=(yc-6.45,yc+6.45),z=ze)
    tower=(np.array([top,yc,zs]),np.array([xh-n*1.0,yc,zs]),6.0)
    # kabel: wyjście u dołu krótszego boku od strony wałka; trasa wg CABLE_ROUTE (płasko, r 1,0)
    cx=bot+n*2.0
    if not flipped:
        zc=zface+1.2
        cab=[(np.array([cx,yc,zc]),np.array([CAB_X,yc,zc]),1.0),(np.array([CAB_X,yc,zc]),np.array([CAB_X,CAB_Y,zc]),1.0),(np.array([CAB_X,CAB_Y,zc]),np.array([CAB_X,CAB_Y,-70.0]),1.0)]
    else:
        cab=[(np.array([cx,yc,zface-1.2]),np.array([cx,yc,-70.0]),1.0)]
    return dict(body=body,cage=cage,ear=ear,tower=tower,cable=cab)
SERV={}
CAB_X=0.0; CAB_Y=-5.0
def build_servos():
    SERV['S_X']=servo_parts(P['X']['xh'],+1,P['X']['yc'],P['ZS'])
    SERV['S_Y']=servo_parts(P['Y']['xh'],+1,P['Y']['yc'],P['ZS'])
    SERV['S_PG']=servo_parts(LG['xh'],-1,LG['yc'],LG['zs'],flipped=True)
    SERV['S_PD']=servo_parts(LD['xh'],-1,LD['yc'],LD['zs'])
build_servos()
# ---------------- stałe: rura, kołnierz, Słupek, wspornik w Płycie, słupki, tarcza ----------------
POST=dict(R=7.65,z0=-41.0,z1=-5.0)
Z_ARM=-35.0
SLUPKI=[(33.0,a) for a in (100.0,200.0,310.0)]    # (R, kąt) słupków Płyty, z -41..-68
ARMS_ANG=(100.0,200.0,310.0)
USZY_RAMY=(100.0,200.0,310.0)                           # ramiona wspornika Słupka: od piasty do słupków, z -37..-41
def fixed_caps():
    caps=[]
    for (R,a) in SLUPKI:
        p=np.array([R*np.cos(a*d2r),R*np.sin(a*d2r),-33.0]); caps.append(('słupek Płyty %d'%a,p,p+np.array([0,0,-68.0+33.0]),3.0))
    for a in ARMS_ANG:
        q=np.array([33*np.cos(a*d2r),33*np.sin(a*d2r),Z_ARM]); caps.append(('ramię wspornika %d'%a,np.array([0,0,Z_ARM]),q,2.0))
    for a in USZY_RAMY:
        ca,sa=np.cos(a*d2r),np.sin(a*d2r)
        for z in (-29.0,-31.0): caps.append(('ucho Ramy %d'%a,np.array([32.5*ca,32.5*sa,z]),np.array([35.75*ca,35.75*sa,z]),2.0))
    for k,s in SERV.items():
        for i,c in enumerate(s['cable']): caps.append((k+' kabel',)+c)
    return caps
def cyl_d(Pts,c):
    p,q,r=c; ax=(q-p)/np.linalg.norm(q-p); L=np.linalg.norm(q-p)
    v=Pts-p; t=v@ax; rad=np.linalg.norm(v-np.outer(t,ax),axis=1)
    dt=np.maximum(np.maximum(-t,0),t-L); dr=np.maximum(rad-r,0)
    out=np.hypot(dt,dr); inside=(dt==0)&(dr==0)
    out[inside]=-np.minimum(r-rad[inside],np.minimum(t[inside],L-t[inside]))
    return out
def fixed_cyls():
    return [(k+' wieża',s['tower']) for k,s in SERV.items()]
def fixed_boxes():
    out=[]
    for k,s in SERV.items():
        out.append((k+' korpus',s['body'])); out.append((k+' klatka',s['cage'])); out.append((k+' ucho',s['ear']))
    return out
# ---------------- odległości ----------------
def seg_seg_v(P1,Q1,P2,Q2):
    # wektorowo: P1,Q1 (N,3), P2,Q2 (M,3) -> (N,M)
    d1=(Q1-P1)[:,None,:]; d2=(Q2-P2)[None,:,:]; r=P1[:,None,:]-P2[None,:,:]
    a=np.sum(d1*d1,-1); e=np.sum(d2*d2,-1); f=np.sum(d2*r,-1); c=np.sum(d1*r,-1); b=np.sum(d1*d2,-1)
    a=np.maximum(a,1e-12); e=np.maximum(e,1e-12)
    den=a*e-b*b
    s=np.where(den>1e-9,np.clip((b*f-c*e)/np.maximum(den,1e-12),0,1),0.0)
    t=(b*s+f)/e
    s=np.where(t<0,np.clip(-c/a,0,1),np.where(t>1,np.clip((b-c)/a,0,1),s))
    t=np.clip(t,0,1)
    cp=P1[:,None,:]+d1*s[...,None]; cq=P2[None,:,:]+d2*t[...,None]
    return np.linalg.norm(cp-cq,axis=-1)
def caps_caps(A,B):
    if not A or not B: return 99.0,None
    P1=np.array([c[1] for c in A]); Q1=np.array([c[2] for c in A]); R1=np.array([c[3] for c in A])
    P2=np.array([c[1] for c in B]); Q2=np.array([c[2] for c in B]); R2=np.array([c[3] for c in B])
    D=seg_seg_v(P1,Q1,P2,Q2)-R1[:,None]-R2[None,:]
    i,j=np.unravel_index(np.argmin(D),D.shape); return D[i,j],(A[i][0],B[j][0])
def sample_caps(caps,step=0.5):
    pts=[];rad=[];lab=[]
    for (nm,p,q,r) in caps:
        n=max(2,int(np.linalg.norm(q-p)/step)+1)
        for s in np.linspace(0,1,n): pts.append(p+s*(q-p)); rad.append(r); lab.append(nm)
    return np.array(pts),np.array(rad),lab
def box_d(Pts,b):
    lo=np.array([b['x'][0],b['y'][0],b['z'][0]]); hi=np.array([b['x'][1],b['y'][1],b['z'][1]])
    d=np.maximum(np.maximum(lo-Pts,0),Pts-hi); dd=np.linalg.norm(d,axis=1)
    inside=np.all((Pts>=lo)&(Pts<=hi),axis=1)
    if inside.any(): dd[inside]=-np.min(np.minimum(Pts[inside]-lo,hi-Pts[inside]),axis=1)
    return dd
def tube_d(Pts):
    rho=np.hypot(Pts[:,0],Pts[:,1]); z=Pts[:,2]
    lim=np.where(z>=-37.0,37.75,39.75); lim=np.where(z>=8.0,35.2,lim)
    return lim-rho
def post_d(Pts):
    rho=np.hypot(Pts[:,0],Pts[:,1]); z=Pts[:,2]
    dz=np.maximum(np.maximum(POST['z0']-z,0),z-POST['z1']); dr=np.maximum(rho-POST['R'],0)
    out=np.hypot(dz,dr)
    inside=(dz==0)&(dr==0); out[inside]=-np.minimum(POST['R']-rho[inside],np.minimum(z[inside]-POST['z0'],POST['z1']-z[inside]))
    return out
def ball_d(Pb):
    # pole czaszy gałki w układzie gałki: R 28..30, kąt biegunowy <= krawędź (z lokalnymi wycięciami)
    R=np.linalg.norm(Pb,axis=1); pol=np.degrees(np.arccos(np.clip(Pb[:,2]/np.maximum(R,1e-9),-1,1)))
    fi=np.degrees(np.arctan2(Pb[:,1],Pb[:,0]))
    rim=np.full(len(Pb),P['rim'])
    for (f0,hw,edge) in RIM_CUT.values():
        dfi=np.abs(((fi-f0+180)%360)-180); rim=np.where(dfi<=hw,np.minimum(rim,edge),rim)
    inside_cone=pol<=rim
    drad=np.maximum(np.maximum(P['kulaRin']-R,0),R-P['kulaR'])
    pen=-np.minimum(R-P['kulaRin'],P['kulaR']-R)
    d_in=np.where(drad>0,drad,pen)
    # poza stożkiem: odległość do pierścienia krawędzi w płaszczyźnie południka
    Rc=np.clip(R,P['kulaRin'],P['kulaR']); dang=(pol-rim)*d2r
    d_out=np.sqrt(np.maximum(R*R+Rc*Rc-2*R*Rc*np.cos(dang),0))
    return np.where(inside_cone,d_in,d_out)
def lid_d(Pts,lo,hi,cut=None,fe=None):
    # czasza powieki: R 31,2..34,7 (rant), sektor kąta wokół x [lo,hi]; cut=(x1,x2,hi2) skraca sektor w pasie x
    x=Pts[:,0]; rho=np.hypot(Pts[:,1],Pts[:,2]); a=np.degrees(np.arctan2(Pts[:,1],Pts[:,2]))
    hiv=np.full(len(Pts),hi)
    if cut is not None: hiv=np.where((x>=cut[0])&(x<=cut[1]),np.minimum(hiv,cut[2]),hiv)
    lov=np.full(len(Pts),lo)
    if cut is not None and len(cut)>3: lov=np.where((x>=cut[0])&(x<=cut[1]),np.maximum(lov,cut[3]),lov)
    R=np.linalg.norm(Pts,axis=1)
    ang_in=(a>=lov)&(a<=hiv)
    # rant R34,7 tylko w pasie 3,5 mm (6,5°) przy krawędzi przedniej, dalej czasza do R33,4
    Ro=np.full(len(Pts),LID['Rrant']) if fe is None else np.where(np.abs(((a-fe+180)%360)-180)<=6.5,LID['Rrant'],LID['Rout'])
    drad=np.maximum(np.maximum(LID['Rin']-R,0),R-Ro)
    pen=-np.minimum(R-LID['Rin'],Ro-R)
    d_in=np.where(drad>0,drad,pen)
    # do najbliższej krawędzi (półpłaszczyzna przez oś x)
    dlo=np.abs(((a-lov+180)%360)-180); dhi=np.abs(((a-hiv+180)%360)-180)
    ae=np.where(dlo<dhi,dlo,dhi)*d2r
    rmin=np.sqrt(np.maximum(LID['Rin']**2-x*x,0)); rmax=np.sqrt(np.maximum(Ro**2-x*x,0))
    rc=np.clip(rho,rmin,rmax)
    d_out=np.sqrt(np.maximum(rho*rho+rc*rc-2*rho*rc*np.cos(np.minimum(ae,np.pi)),0))
    d_out=np.where(np.abs(x)>LID['Rrant'],np.abs(x)-LID['Rrant']+d_out,d_out)
    return np.where(ang_in,d_in,d_out)
# ---------------- ruchome części ----------------
def rod_caps(name,R,Pt,a):
    A,H,d=geo.horn_H(name,a)
    u=(H-Pt)/np.linalg.norm(H-Pt)
    caps=[]
    caps.append((name+' obudowa M2',Pt-u*1.0,Pt+u*P['m2_housL'],P['m2_housR']))
    caps.append((name+' nakrętka M2',Pt+u*P['m2_housL'],Pt+u*(P['m2_housL']+P['m2_nutL']),P['m2_nutR']))
    s0=P['m2_housL']+P['m2_nutL']
    if ROD=='A':
        s1=np.linalg.norm(H-Pt)-P['m5_housL']-P['m5_nutL']-P['m5_blockL']
        caps.append((name+' pręt Ø5',Pt+u*s0,Pt+u*s1,P['rodR']))
        caps.append((name+' koniec Ø10 (M5)',Pt+u*s1,Pt+u*(s1+P['m5_blockL']),P['m5_blockR']))
        s2=s1+P['m5_blockL']
    else:
        # B: łącznik drukowany Ø9 (M2 4 mm + przerwa 1 + M5 6 mm) przy M2, dalej szpilka stalowa M5
        s1=s0+ADAPT_L
        caps.append((name+' łącznik Ø9 M2/M5',Pt+u*s0,Pt+u*s1,P['m5_blockR']))
        s2=np.linalg.norm(H-Pt)-P['m5_housL']-P['m5_nutL']
        caps.append((name+' szpilka M5',Pt+u*s1,Pt+u*s2,P['rodR']))
    caps.append((name+' nakrętka M5',Pt+u*s2,Pt+u*(s2+P['m5_nutL']),P['m5_nutR']))
    caps.append((name+' obudowa M5',H-u*P['m5_housL'],H+u*1.5,P['m5_housR']))
    caps.append((name+' czop i kulka M5',A,H,P['m5_ballR']))
    C,r,v0=geo.horn_frame(name)
    Cx=C.copy(); Cx[0]-=3.0; Ax=A.copy(); Ax[0]-=3.0
    caps+=ramie_caps(name,a)
    return caps
def ramie_caps(name,a):
    A,H,d=geo.horn_H(name,a); C,r,v0=geo.horn_frame(name)
    Cx=C.copy(); Cx[0]-=3.0; Ax=A.copy(); Ax[0]-=3.0
    v=Ax-Cx; w=np.cross([1.0,0,0],v); w/=np.linalg.norm(w)
    return [(name+' Ramię 6 mm',Cx+w,Ax+w,3.0),(name+' Ramię 6 mm',Cx-w,Ax-w,3.0)]
ROD=os.environ.get('ROD','A')
G_CUT['span']=float(os.environ.get('GSPAN','83.5')); P['m5_blockL']=float(os.environ.get('BL','5')); P['m5_housR']=float(os.environ.get('HR','7.0')); ADAPT_L=float(os.environ.get('ADL','11'))
RI=1.2; RW=0.6
TAILJ=dict(G=float(os.environ.get('TJG','1')),D=float(os.environ.get('TJD','1')))
def wire_caps(c,J,H,which,f,side_J,side_H,tail=2.0):
    # drut z realnym zagięciem Z: nogi o (0,1 luzu + r_i + r drutu) od ścianki zaczepu/ramienia
    off=0.1+RI+RW
    tab=(J[0]-1.2,J[0]+1.2)
    xJ=tab[1]+off if side_J>0 else tab[0]-off
    arm=(c['xh']-1.5,c['xh']+1.5) if which=='G' else (c['xh']-1.0,c['xh']+1.0)
    xH=arm[1]+off if side_H>0 else arm[0]-off
    Jy=np.array([xJ,J[1],J[2]]); Hy=np.array([xH,H[1],H[2]])
    K=J+f*(H-J); K1=np.array([xJ,K[1],K[2]]); K2=np.array([xH,K[1],K[2]])
    dvec=(H-J); dvec[0]=0; dvec/=np.linalg.norm(dvec)
    caps=[(which+' drut',Jy,K1,RW),(which+' drut wykorbienie',K1,K2,RW),(which+' drut',K2,Hy,RW)]
    xtJ=tab[0]-off if side_J>0 else tab[1]+off; xtH=arm[0]-off if side_H>0 else arm[1]+off
    caps.append((which+' drut przez zaczep',np.array([xtJ,J[1],J[2]]),Jy,RW))
    caps.append((which+' ogon Z przy J',np.array([xtJ,J[1],J[2]]),np.array([xtJ,J[1],J[2]])+TAILJ[which]*tail*dvec,RW))
    caps.append((which+' drut przez ramię',np.array([xtH,H[1],H[2]]),Hy,RW))
    caps.append((which+' ogon Z przy H',np.array([xtH,H[1],H[2]]),np.array([xtH,H[1],H[2]])+tail*dvec,RW))
    return caps
def lid_caps(c,which,t,prev,f,side_J,side_H):
    sgn=1 if which=='G' else -1
    J,H,b=geo.lid_state(c,t,sgn,prev)
    caps=wire_caps(c,J,H,which,f,side_J,side_H)
    caps.append((which+' zaczep',np.array([J[0]-1.2,J[1],J[2]]),np.array([J[0]+1.2,J[1],J[2]]),2.0))
    edge=(-9.0+t+G_SPAN) if which=='G' else (-11.0-t-D_SPAN)
    rr=np.sqrt(max(32.3**2-J[0]**2,1)); E=np.array([J[0],rr*np.sin(edge*d2r),rr*np.cos(edge*d2r)])
    caps.append((which+' wypust zaczepu',E,J,1.2))
    C=np.array([c['xh'],c['yc'],c['zs']]); Hx=H.copy(); Hx[0]=c['xh']
    caps.append((which+' ramię orczyka',C,Hx,3.0 if which=='G' else 2.5))
    return caps,b
