/* IndiCloudAI logo animation component */
(function(){
var CFG={"W": 1245, "H": 1023, "cx": 47.942, "cy": 40.829, "ccx": 49.72, "ccy": 34.12, "band": {"top": 742, "h": 270}, "letters": [{"x0": 17, "x1": 64, "y0": 748, "y1": 922}, {"x0": 79, "x1": 202, "y0": 748, "y1": 922}, {"x0": 209, "x1": 339, "y0": 748, "y1": 922}, {"x0": 350, "x1": 402, "y0": 748, "y1": 922}, {"x0": 407, "x1": 555, "y0": 748, "y1": 922}, {"x0": 559, "x1": 604, "y0": 748, "y1": 922}, {"x0": 612, "x1": 744, "y0": 748, "y1": 922}, {"x0": 750, "x1": 872, "y0": 748, "y1": 922}, {"x0": 879, "x1": 1009, "y0": 748, "y1": 922}, {"x0": 1007, "x1": 1181, "y0": 748, "y1": 922}, {"x0": 1179, "x1": 1227, "y0": 748, "y1": 922}], "tag": {"x0": 0, "x1": 1245, "y0": 948, "y1": 1005}, "inv": 9};
var TOTAL=5200;
var CSS="\
.ba{position:relative;display:block;width:100%}\
.ba-fx{position:absolute;pointer-events:none;z-index:0}\
.ba-fx.local{left:-30%;top:-30%;width:160%;height:160%}\
.ba-fx.full{position:fixed;inset:0;width:100%;height:100%}\
.ba-cam{position:relative;z-index:1;width:100%;aspect-ratio:"+CFG.W+"/"+CFG.H+";transform-style:preserve-3d;perspective:1400px}\
.ba-tilt,.ba-float{position:absolute;inset:0;transform-style:preserve-3d}\
.ba-tilt{transition:transform .25s ease-out}\
.ba.idle .ba-float{animation:ba-bob 6s ease-in-out infinite}\
@keyframes ba-bob{50%{transform:translateY(-1.4%)}}\
.ba-l{position:absolute;inset:0;transform:translateZ(var(--z,0px));transform-style:preserve-3d}\
.ba img{position:absolute;display:block;pointer-events:none;-webkit-user-drag:none;user-select:none;max-width:none}\
.ba-full img{inset:0;width:100%;height:100%}\
.ba-rf,.ba-ring,.ba-spk,.ba-spin{transform-origin:"+CFG.cx+"% "+CFG.cy+"%}\
.ba-spin{position:absolute;inset:0}\
.ba.idle .ba-spin{animation:ba-rot 42s linear infinite}\
@keyframes ba-rot{to{transform:rotate(360deg)}}\
.ba-rfw{position:absolute;inset:0}\
.ba-glow{position:absolute;left:"+CFG.cx+"%;top:"+CFG.cy+"%;width:62%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:radial-gradient(circle,rgba(240,134,26,.42),rgba(240,134,26,0) 66%);opacity:0}\
.ba-pulse{position:absolute;left:"+CFG.cx+"%;top:"+CFG.cy+"%;width:42%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;border:3px solid #f0861a;opacity:0}\
.ba-pulse.b{border-color:#12a4b4;border-width:2px}\
.ba-cloud{--a:0deg;-webkit-mask-image:conic-gradient(from 270deg at "+CFG.ccx+"% "+CFG.ccy+"%,#000 calc(var(--a) - 16deg),transparent var(--a));mask-image:conic-gradient(from 270deg at "+CFG.ccx+"% "+CFG.ccy+"%,#000 calc(var(--a) - 16deg),transparent var(--a))}\
.ba.nomask .ba-cloud{-webkit-mask-image:none;mask-image:none}\
.ba-lt{position:absolute;overflow:hidden}\
.ba-lt img{max-width:none}\
.ba.dark .ba-lt.inv img{filter:brightness(0) invert(1)}\
.ba.dark .ba-cw{filter:brightness(1.5) saturate(1.1)}\
.ba-shine{position:absolute;inset:0;opacity:0;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.95) 50%,transparent 62%);background-size:260% 100%;background-position:150% 0;-webkit-mask:var(--m) center/100% 100% no-repeat;mask:var(--m) center/100% 100% no-repeat;mix-blend-mode:soft-light}\
.ba.dark .ba-shine{mix-blend-mode:screen}\
@media (prefers-reduced-motion:reduce){.ba.idle .ba-spin,.ba.idle .ba-float{animation:none}}";
function injectCSS(){if(document.getElementById('ba-css'))return;var s=document.createElement('style');s.id='ba-css';s.textContent=CSS;document.head.appendChild(s)}
var E={out:'cubic-bezier(.16,1,.3,1)',io:'cubic-bezier(.65,0,.35,1)',soft:'cubic-bezier(.2,.8,.2,1)'};
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function isDarkAuto(){var t=document.documentElement.dataset.theme;if(t)return t==='dark';return matchMedia('(prefers-color-scheme:dark)').matches}
function BrandAnim(host,o){
  o=o||{};injectCSS();
  var AS=o.assets||window.BRAND_ASSETS||{ring:'anim-ring.webp',ringfull:'anim-ringfull.webp',spokes:'anim-spokes.webp',cloud:'anim-cloud.webp',word:'anim-word.webp',mask:'anim-mask.webp'};
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  host.classList.add('ba');
  var fxClass=o.fx==='full'?'full':'local';
  var h='<canvas class="ba-fx '+fxClass+'"></canvas><div class="ba-cam"><div class="ba-tilt"><div class="ba-float">'
   +'<div class="ba-l" style="--z:-10px"><div class="ba-glow"></div><div class="ba-pulse"></div><div class="ba-pulse b"></div></div>'
   +'<div class="ba-l ba-full" style="--z:42px"><div class="ba-rfw"><img class="ba-rf" alt="" src="'+AS.ringfull+'"></div></div>'
   +'<div class="ba-l ba-full" style="--z:40px"><img class="ba-ring" alt="" src="'+AS.ring+'"></div>'
   +'<div class="ba-l ba-full" style="--z:30px"><div class="ba-spin"><img class="ba-spk" alt="" src="'+AS.spokes+'"></div></div>'
   +'<div class="ba-l ba-full ba-cw" style="--z:6px"><img class="ba-cloud" role="img" alt="IndiCloudAI logo" src="'+AS.cloud+'"></div>'
   +'<div class="ba-l ba-word" style="--z:22px"></div>'
   +'<div class="ba-l" style="--z:50px"><div class="ba-shine"></div></div>'
   +'</div></div></div>';
  host.innerHTML=h;
  var q=function(s){return host.querySelector(s)};
  var cv=q('.ba-fx'),cam=q('.ba-cam'),tilt=q('.ba-tilt'),ctx=cv.getContext('2d');
  q('.ba-shine').style.setProperty('--m','url('+AS.mask+')');
  /* letters + tagline from one sprite */
  var wordHost=q('.ba-word'),W=CFG.W,H=CFG.H,bt=CFG.band.top,bh=CFG.band.h,L=[];
  function piece(b,inv){var d=document.createElement('div'),w=b.x1-b.x0,hh=b.y1-b.y0;d.className='ba-lt'+(inv?' inv':'');
    d.style.cssText='left:'+b.x0/W*100+'%;top:'+b.y0/H*100+'%;width:'+w/W*100+'%;height:'+hh/H*100+'%';
    var im=document.createElement('img');im.alt='';im.src=AS.word;
    im.style.cssText='width:'+W/w*100+'%;height:'+bh/hh*100+'%;left:'+(-b.x0/w*100)+'%;top:'+(-(b.y0-bt)/hh*100)+'%';
    d.appendChild(im);wordHost.appendChild(d);return d}
  CFG.letters.forEach(function(b,i){L.push(piece(b,i<CFG.inv))});
  var tag=piece(CFG.tag,true);
  /* theme */
  var mode=o.theme||'auto';
  function applyTheme(){host.classList.toggle('dark',mode==='dark'||(mode==='auto'&&isDarkAuto()))}
  applyTheme();
  if(mode==='auto'){new MutationObserver(applyTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});try{matchMedia('(prefers-color-scheme:dark)').addEventListener('change',applyTheme)}catch(e){}}
  /* timeline */
  if(window.__baReg===undefined){try{CSS.registerProperty({name:'--a',syntax:'<angle>',inherits:false,initialValue:'0deg'});window.__baReg=true}catch(e){window.__baReg=!!(e&&e.name==='InvalidModificationError')}}
  var sweepOK=!!window.__baReg;
  var anims=[];function A(el,kf,op){var a=el.animate(kf,Object.assign({fill:'both'},op));anims.push(a);return a}
  var master=A(q('.ba-float'),[{opacity:1},{opacity:1}],{duration:TOTAL});
  A(cam,[{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:TOTAL,easing:'cubic-bezier(.2,.6,.2,1)'});
  A(q('.ba-glow'),[{opacity:0,transform:'scale(.4)'},{opacity:.95,transform:'scale(1.15)',offset:.4},{opacity:.4,transform:'scale(1)'}],{delay:900,duration:1600,easing:E.soft});
  A(q('.ba-pulse'),[{opacity:0,transform:'scale(.1)'},{opacity:.95,transform:'scale(.14)',offset:.03},{opacity:0,transform:'scale(2.7)'}],{delay:1000,duration:1200,easing:'cubic-bezier(.2,.7,.2,1)'});
  A(q('.ba-pulse.b'),[{opacity:0,transform:'scale(.1)'},{opacity:.8,transform:'scale(.14)',offset:.03},{opacity:0,transform:'scale(3.4)'}],{delay:1180,duration:1300,easing:'cubic-bezier(.2,.7,.2,1)'});
  var ringKF=[{opacity:0,transform:'scale(.35) rotate(-220deg)',filter:'blur(10px)'},{opacity:1,transform:'scale(1) rotate(0)',filter:'blur(0)'}],ringOP={delay:1000,duration:1400,easing:E.out};
  A(q('.ba-rf'),ringKF,ringOP);A(q('.ba-ring'),ringKF,ringOP);
  A(q('.ba-rfw'),[{opacity:1},{opacity:1,offset:.0001},{opacity:0}],{delay:2450,duration:900,easing:'ease-in-out'});
  A(q('.ba-spk'),[{opacity:0,transform:'scale(.15) rotate(-540deg)'},{opacity:1,transform:'scale(1) rotate(0)',offset:.45},{opacity:1,transform:'scale(1) rotate(0)'}],{delay:1100,duration:1600,easing:E.out});
  if(sweepOK)A(q('.ba-cloud'),[{'--a':'0deg'},{'--a':'372deg'}],{delay:1750,duration:1500,easing:E.io});
  else{host.classList.add('nomask');A(q('.ba-cloud'),[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{delay:1750,duration:1500,easing:E.io})}
  L.forEach(function(d,i){var hot=i>=L.length-2;
    A(d,[{opacity:0,transform:'translateY(75%) scale(.9)',filter:'blur(8px)'},{opacity:1,transform:'translateY(-7%) scale('+(hot?1.18:1.04)+')',filter:'blur(0)',offset:.62},{opacity:1,transform:'none',filter:'blur(0)'}],{delay:2950+i*68,duration:820,easing:E.soft})});
  A(tag,[{clipPath:'inset(0 100% 0 0)',opacity:0,transform:'translateY(8px)'},{clipPath:'inset(0 0 0 0)',opacity:1,transform:'none'}],{delay:3950,duration:900,easing:E.io});
  A(q('.ba-shine'),[{opacity:0,backgroundPosition:'150% 0'},{opacity:1,offset:.2},{opacity:1,offset:.8},{opacity:0,backgroundPosition:'-50% 0'}],{delay:4300,duration:900,easing:'ease-in-out'});
  /* particles */
  var R=rng(7),N=o.particles||72,PT=[],AM=[],i;
  for(i=0;i<N;i++)PT.push({th:R()*6.283,d:.55+R()*.5,dl:R()*500,ar:1000+R()*220,sw:(R()-.5)*1.6,c:R()<.3});
  for(i=0;i<26;i++)AM.push({x:R(),y:R(),f:.2+R()*.4,ph:R()*6.28,am:12+R()*18,c:R()<.3});
  var cw=0,ch=0,dpr=1;
  function size(){dpr=Math.min(devicePixelRatio||1,2);var r=cv.getBoundingClientRect();cw=r.width;ch=r.height;cv.width=Math.max(1,cw*dpr);cv.height=Math.max(1,ch*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  size();var ro=window.ResizeObserver?new ResizeObserver(size):null;if(ro)ro.observe(host);addEventListener('resize',size);
  function col(c,a){return c?'rgba(240,134,26,'+a+')':'rgba(18,164,180,'+a+')'}
  function draw(t){
    ctx.clearRect(0,0,cw,ch);if(!cw)return;
    var cr=cv.getBoundingClientRect(),r=cam.getBoundingClientRect(),cx=r.left-cr.left+r.width*CFG.cx/100,cy=r.top-cr.top+r.height*CFG.cy/100,pts=[],k,span=Math.max(cw,ch)*.62;
    for(k=0;k<PT.length;k++){var p=PT[k];if(t<p.dl)continue;var pr=Math.min(1,(t-p.dl)/(p.ar-p.dl));if(pr>=1)continue;
      var e=pr*pr*pr,ang=p.th+(1-e)*p.sw,dist=p.d*span*(1-e);
      pts.push({x:cx+Math.cos(ang)*dist,y:cy+Math.sin(ang)*dist,a:Math.min(1,(t-p.dl)/300),s:3.6*(1-e*.75)+.5,c:p.c})}
    var j;
    for(i=0;i<pts.length;i++){for(j=i+1;j<pts.length;j++){var d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<150){ctx.strokeStyle=col(0,.32*(1-d/150)*Math.min(pts[i].a,pts[j].a));ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke()}}}
    for(i=0;i<pts.length;i++){ctx.fillStyle=col(pts[i].c,.9*pts[i].a);ctx.beginPath();ctx.arc(pts[i].x,pts[i].y,pts[i].s,0,6.3);ctx.fill()}
    var amb=Math.max(0,Math.min(1,(t-2300)/1200))*.5;
    if(amb>0&&o.ambient!==false){var now=performance.now()/1000,qq=[];
      for(i=0;i<AM.length;i++){var m=AM[i];qq.push({x:m.x*cw+Math.sin(now*m.f+m.ph)*m.am,y:m.y*ch+Math.cos(now*m.f*.9+m.ph)*m.am,c:m.c})}
      for(i=0;i<qq.length;i++){for(j=i+1;j<qq.length;j++){var dd=Math.hypot(qq[i].x-qq[j].x,qq[i].y-qq[j].y);if(dd<170){ctx.strokeStyle=col(0,.22*amb*(1-dd/170));ctx.beginPath();ctx.moveTo(qq[i].x,qq[i].y);ctx.lineTo(qq[j].x,qq[j].y);ctx.stroke()}}}
      for(i=0;i<qq.length;i++){ctx.fillStyle=col(qq[i].c,.7*amb);ctx.beginPath();ctx.arc(qq[i].x,qq[i].y,2,0,6.3);ctx.fill()}}
  }
  /* api */
  var playing=true,raf=0,ended=false,visible=true,api={anims:anims,master:master,TOTAL:TOTAL};
  function setAll(fn){anims.forEach(fn)}
  api.seek=function(ms){setAll(function(a){a.currentTime=ms});ended=false};
  api.pause=function(){playing=false;setAll(function(a){a.pause()})};
  api.play=function(){playing=true;if(master.currentTime>=TOTAL)api.seek(0);setAll(function(a){a.play()})};
  api.replay=function(){host.classList.remove('idle');api.seek(0);api.play()};
  api.setRate=function(r){setAll(function(a){a.updatePlaybackRate(r)})};
  api.isPlaying=function(){return playing};
  api.dark=function(d){mode=d?'dark':'light';applyTheme()};
  api.destroy=function(){cancelAnimationFrame(raf);if(ro)ro.disconnect();setAll(function(a){a.cancel()})};
  function tick(){var t=Math.min(master.currentTime||0,TOTAL);
    if(visible){draw(t)}
    if(t>=TOTAL-30&&playing){if(!host.classList.contains('idle'))host.classList.add('idle');if(!ended){ended=true;if(o.onEnd)o.onEnd(api)}}
    else if(t<TOTAL-30)host.classList.remove('idle');
    if(o.onTick)o.onTick(t,api);
    raf=requestAnimationFrame(tick)}
  if(window.IntersectionObserver)new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(host);
  if(o.tilt!==false&&matchMedia('(hover:hover)').matches&&!reduce){
    var tgt=o.tiltTarget||window;
    tgt.addEventListener('pointermove',function(e){var b=host.getBoundingClientRect();if(tgt===window||true){var x=(e.clientX-b.left)/Math.max(b.width,1)-.5,y=(e.clientY-b.top)/Math.max(b.height,1)-.5;x=Math.max(-1,Math.min(1,x));y=Math.max(-1,Math.min(1,y));tilt.style.transform='rotateY('+x*12+'deg) rotateX('+(-y*9)+'deg)'}});
  }
  if(o.rate)api.setRate(o.rate);
  if(o.autoplay===false){api.pause();api.seek(0)}
  if(reduce){api.seek(TOTAL);api.pause();host.classList.add('idle');playing=false}
  tick();
  return api;
}
window.BrandAnim=BrandAnim;
/* auto-init for in-page loops */
function autoLoops(){
  document.querySelectorAll('.ba-loop').forEach(function(h){
    var api,io=new IntersectionObserver(function(es){es.forEach(function(x){
      if(x.isIntersecting&&!api){api=BrandAnim(h,{fx:'local',particles:48,onEnd:function(a){setTimeout(function(){if(h.isConnected&&!document.hidden)a.replay()},9000)}});h.addEventListener('click',function(){api.replay()});h.style.cursor='pointer';h.title='Click to replay'}
    })},{threshold:.3});io.observe(h)})
}
/* first-visit splash */
function splash(){
  var s=document.getElementById('splash');if(!s)return;
  var root=document.documentElement;
  if(!root.classList.contains('has-splash')){s.remove();return}
  function done(){if(s._d)return;s._d=1;s.classList.add('out');try{sessionStorage.setItem('splash','1')}catch(e){}setTimeout(function(){root.classList.remove('has-splash');s.remove()},650)}
  var api=BrandAnim(s.querySelector('.ba-s'),{fx:'full',rate:1.45,particles:64,onEnd:function(){setTimeout(done,500)}});
  s.querySelector('.ba-skip').addEventListener('click',done);
  addEventListener('keydown',function(e){if(e.key==='Escape')done()});
  setTimeout(done,7000);
}
function init(){autoLoops();splash()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
