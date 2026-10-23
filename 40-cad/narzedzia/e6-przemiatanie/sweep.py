#!/usr/bin/env python3
import numpy as np, sys, json, time, os
import full, uchwyt
from full import *
STEP_E=float(sys.argv[3]) if len(sys.argv)>3 else 1.0   # krok gałki
STEP_L=float(os.environ.get('STEPL','1.0'))
FG=float(sys.argv[4]) if len(sys.argv)>4 else 0.4; FD=float(sys.argv[5]) if len(sys.argv)>5 else 0.15
SJG=int(sys.argv[6]) if len(sys.argv)>6 else -1; SHG=int(sys.argv[7]) if len(sys.argv)>7 else +1
SJD=int(sys.argv[8]) if len(sys.argv)>8 else -1; SHD=int(sys.argv[9]) if len(sys.argv)>9 else -1
res={}
def upd(key,val,info,work):
    k=(key,'praca' if work else 'ograniczniki')
    if k not in res or val<res[k][0]: res[k]=(float(val),info)
FIX=fixed_caps(); BOXES=fixed_boxes(); CYLS=fixed_cyls()
def vs_fixed(caps,info,work,own=None):
    pts,rad,lab=sample_caps(caps,0.5)
    d=tube_d(pts)-rad; i=np.argmin(d); upd(lab[i]+' – rura',d[i],info,work)
    d=post_d(pts)-rad; i=np.argmin(d); upd(lab[i]+' – Słupek',d[i],info,work)
    for nm,cy in CYLS:
        if own and nm.startswith(own): continue
        d=cyl_d(pts,cy)-rad; i=np.argmin(d); upd(lab[i]+' – '+nm,d[i],info,work)
    for nm,b in BOXES:
        if own and nm.startswith(own): continue
        d=box_d(pts,b)-rad; i=np.argmin(d); upd(lab[i]+' – '+nm,d[i],info,work)
    fc=[c for c in FIX if not (own and c[0].startswith(own))]
    v,pr=caps_caps(caps,fc)
    if pr: upd(pr[0]+' – '+pr[1],v,info,work)
# ---------- 1. gałka ----------
t0=time.time()
RT=np.array(json.load(open(os.environ.get('REACH','reach.json'))))
def reach_ok(p,t):
    a=np.degrees(np.arctan2(t/18.0,p/28.0))%360; n=max(abs(p)/28.0,abs(t)/18.0)
    sc=np.interp(a,np.append(RT[:,0],360),np.append(RT[:,1],RT[0,1]))
    return n<=sc+1e-6
psis=np.unique(np.concatenate([np.arange(-28,28.001,STEP_E),[-28.25,28.25,-25,25]])); ths=np.unique(np.concatenate([np.arange(-18,18.001,STEP_E),[-18.25,18.25,-15,15]]))
EYE=[]
prevrow=None
for p in psis:
    pX=pY=0.0
    for t in ths:
        R,PX,PY=eye_points(p,t)
        aX=geo.solve_horn('X',PX,pX); aY=geo.solve_horn('Y',PY,pY)
        pX,pY=aX,aY
        work=abs(p)<=25 and abs(t)<=15
        if not reach_ok(p,t): continue
        cx=rod_caps('X',R,PX,aX); cy=rod_caps('Y',R,PY,aY)
        EYE.append((p,t,work,R,cx,cy,aX,aY))
for (p,t,work,R,cx,cy,aX,aY) in EYE:
    info=(float(p),float(t))
    vs_fixed(cx,info,work,own='S_X'); vs_fixed(cy,info,work,own='S_Y')
    # własne serwo: tylko korpus/klatka/kabel bez wieży (Ramię siedzi na wieży)
    for nm,cc in (('X',cx),('Y',cy)):
        own='S_'+nm
        pts,rad,lab=sample_caps([c for c in cc if 'Ramię' not in c[0] and 'czop' not in c[0]],0.5)
        for k in ('korpus','klatka','ucho'):
            b=[bb for n_,bb in BOXES if n_==own+' '+k][0]
            d=box_d(pts,b)-rad; i=np.argmin(d); upd(lab[i]+' – '+own+' '+k,d[i],info,work)
    v,pr=caps_caps(cx,cy); upd(pr[0]+' – '+pr[1],v,info,work)
    # Uchwyt: płyta okna i piasty kulek M2 (układ gałki)
    for cc in (cx,cy):
        sel=[c for c in cc if 'Ramię' not in c[0] and 'czop' not in c[0]]
        pts,rad,lab=sample_caps(sel,0.3); Pb=(R.T@pts.T).T
        pass  # płyta okna: wycięta po obwiedni prętów + 0,5 (plate.py)
        for nm,p0,q0,r0 in uchwyt.BOSS:
            own_boss=(nm.endswith(cc[0][0][0]) and 'piasta' in nm)
            ss=[j for j in range(len(lab)) if not (own_boss and ('obudowa M2' in lab[j]))]
            seg=np.array([p0]),np.array([q0])
            # odległość punkt–odcinek
            v=q0-p0; t=np.clip(((Pb-p0)@v)/(v@v),0,1); dd=np.linalg.norm(Pb-(p0+np.outer(t,v)),axis=1)-r0-rad
            dd=dd[ss]; k=np.argmin(dd); upd(lab[ss[k]]+' – '+nm,dd[k],info,work)
    # gałka (pole czaszy) – w układzie gałki
    for cc in (cx,cy):
        sel=[c for c in cc if 'Ramię' not in c[0] and 'czop' not in c[0]]
        pts,rad,lab=sample_caps(sel,0.3)
        d=ball_d((R.T@pts.T).T)-rad; i=np.argmin(d); upd(lab[i]+' – czasza gałki',d[i],info,work)
print("gałka: %.0f s"%(time.time()-t0),flush=True)
# ---------- 2. powieki ----------
tG=np.append(np.arange(-0.25,56.75,STEP_L),56.75); tD=np.append(np.arange(-0.25,32.75,STEP_L),32.75)
LGS=[];LDS=[]
prev=None; full.LG=LG
for t in tG:
    caps,b=lid_caps(LG,'G',t,prev,FG,SJG,SHG); prev=b; LGS.append((t,caps))
prev=None
for t in tD:
    caps,b=lid_caps(LD,'D',t,prev,FD,SJD,SHD); prev=b; LDS.append((t,caps))
def lidwork(which,t): return (0.5<=t<=56.0) if which=='G' else (0.5<=t<=32.0)
for which,L in (('G',LGS),('D',LDS)):
    for t,caps in L:
        own='S_PG' if which=='G' else 'S_PD'
        info=float(t); work=lidwork(which,t)
        sel=[c for c in caps if 'ramię orczyka' not in c[0]]
        vs_fixed(sel,info,work,own=None)
        vs_fixed([c for c in caps if 'ramię orczyka' in c[0]],info,work,own=own)
        pts,rad,lab=sample_caps([c for c in caps if 'ramię orczyka' not in c[0]],0.3)
        d=ball_d(pts)-rad; d2=np.linalg.norm(pts,axis=1)-rad-30.0   # gałka jako kula R30 (dowolne położenie)
        i=np.argmin(d2); upd(lab[i]+' – kula R30 (gałka w dowolnym położeniu)',d2[i],info,work)
for tg,cg in LGS:
    for td,cd in LDS:
        work=lidwork('G',tg) and lidwork('D',td)
        v,pr=caps_caps(cg,cd); upd(pr[0]+' – '+pr[1],v,(float(tg),float(td)),work)
        pts,rad,lab=sample_caps([c for c in cg if 'ramię' not in c[0]],0.4)
        lo,hi=lidD_range(td); d=lid_d(pts,lo,hi,None,hi)-rad; i=np.argmin(d); upd(lab[i]+' – czasza dolnej',d[i],(float(tg),float(td)),work)
        pts,rad,lab=sample_caps([c for c in cd if 'ramię' not in c[0]],0.4)
        lo,hi=lidG_range(tg); d=lid_d(pts,lo,hi,(G_CUT['x1'],G_CUT['x2'],lo+G_CUT['span']),lo)-rad; i=np.argmin(d); upd(lab[i]+' – czasza górnej',d[i],(float(tg),float(td)),work)
print("powieki: %.0f s"%(time.time()-t0),flush=True)
# ---------- 3. gałka x powieki ----------
GC=[(t,c) for t,c in LGS]; DC=[(t,c) for t,c in LDS]
def stack(L):
    P1=[];Q1=[];R1=[];lab=[];tt=[]
    for t,caps in L:
        for c in caps: P1.append(c[1]);Q1.append(c[2]);R1.append(c[3]);lab.append(c[0]);tt.append(t)
    return np.array(P1),np.array(Q1),np.array(R1),lab,np.array(tt)
SG=stack(GC); SD=stack(DC)
for (p,t,work,R,cx,cy,aX,aY) in EYE:
    caps=cx+cy
    P1=np.array([c[1] for c in caps]);Q1=np.array([c[2] for c in caps]);R1=np.array([c[3] for c in caps])
    for S,which in ((SG,'G'),(SD,'D')):
        D=seg_seg_v(P1,Q1,S[0],S[1])-R1[:,None]-S[2][None,:]
        # praca: tylko pozycje powieki w pracy
        for wflag in (True,False):
            mask=np.array([lidwork(which,x) for x in S[4]]) if wflag else np.ones(len(S[4]),bool)
            if wflag and not work: continue
            DD=np.where(mask[None,:],D,99); i,j=np.unravel_index(np.argmin(DD),DD.shape)
            upd(caps[i][0]+' – '+S[3][j],DD[i,j],((float(p),float(t)),float(S[4][j])),wflag)
    # pręty vs czasze powiek
    sel=[c for c in caps if 'Ramię' not in c[0] and 'czop' not in c[0]]
    pts,rad,lab=sample_caps(sel,0.4)
    for which,tl in (('G',tG),('D',tD)):
        for tv in tl[::1]:
            if which=='G':
                lo,hi=lidG_range(tv); d=lid_d(pts,lo,hi,(G_CUT['x1'],G_CUT['x2'],lo+G_CUT['span']),lo)-rad
            else:
                lo,hi=lidD_range(tv); d=lid_d(pts,lo,hi,None,hi)-rad
            i=np.argmin(d)
            w2=work and lidwork(which,tv)
            upd(lab[i]+' – czasza '+('górnej' if which=='G' else 'dolnej'),d[i],((float(p),float(t)),float(tv)),w2)
            if not w2: upd(lab[i]+' – czasza '+('górnej' if which=='G' else 'dolnej'),d[i],((float(p),float(t)),float(tv)),False)
print("krzyżowe: %.0f s"%(time.time()-t0),flush=True)
out=sorted([(v[0],k[0],k[1],v[1]) for k,v in res.items()])
json.dump([(a,b,c,str(d)) for a,b,c,d in out],open(os.environ.get('OUT','wynik.json'),'w'))
for zakres in ('praca','ograniczniki'):
    print("== zakres",zakres)
    for v,k,z,info in [o for o in out if o[2]==zakres][:25]: print("  %7.2f  %-70s %s"%(v,k,info))
