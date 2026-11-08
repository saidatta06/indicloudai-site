(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,hov=matchMedia('(hover:hover)').matches;
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
var root=document.documentElement;
/* theme toggle */
var tb=$('#theme');
if(tb)tb.addEventListener('click',function(){
  var cur=root.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'),nx=cur==='dark'?'light':'dark';
  root.dataset.theme=nx;try{localStorage.setItem('theme',nx)}catch(e){}});
/* progress + back to top */
var prog=$('#prog'),up=$('#totop');
function sc(){var m=root.scrollHeight-innerHeight;if(prog)prog.style.transform='scaleX('+(m>0?scrollY/m:0)+')';if(up)up.classList.toggle('show',scrollY>700)}
addEventListener('scroll',sc,{passive:true});sc();
if(up)up.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
/* copy email */
var toast=$('#toast');
$$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
  var v=b.dataset.copy,done=function(){if(toast){toast.textContent='Email copied';toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},1800)}};
  if(navigator.clipboard)navigator.clipboard.writeText(v).then(done,done);else done()})});
/* counters */
function count(el){var t=parseFloat(el.dataset.count),d=+el.dataset.dec||0,s=el.dataset.suf||'',t0=null;
  function f(v){el.textContent=v.toFixed(d)+s}
  if(reduce){f(t);return}
  function tick(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1400,1);f(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)}
  requestAnimationFrame(tick)}
if('IntersectionObserver' in window){
  var co=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){count(x.target);co.unobserve(x.target)}})},{threshold:.6});
  $$('[data-count]').forEach(function(e){co.observe(e)});
}
/* story phone */
var sp=$('#sphone'),items=$$('.sl li');
if(sp&&items.length&&'IntersectionObserver' in window){
  var setStep=function(i){sp.dataset.step=i;items.forEach(function(li,k){li.classList.toggle('on',k===i)})};
  setStep(0);
  var so=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)setStep(+x.target.dataset.i)})},{rootMargin:'-45% 0px -45% 0px'});
  items.forEach(function(li){so.observe(li)});
  if(matchMedia('(max-width:900px)').matches&&!reduce){var k=0,vis=false;
    new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe($('#story'));
    setInterval(function(){if(vis){k=(k+1)%items.length;setStep(k)}},3200)}
}
/* exploded model stack */
var iso=$('#iso'),eb=$('#explode');
if(iso){
  if('IntersectionObserver' in window&&!reduce){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){setTimeout(function(){iso.classList.add('open')},350);o.disconnect()}},{threshold:.5}).observe(iso)}else iso.classList.add('open');
  if(eb)eb.addEventListener('click',function(){iso.classList.toggle('open')});
}
if(reduce)return;
/* reveal */
var els=$$('section h2,.cols>div,.steps li,.feat,.metrics>div,.stats>div,.fig,.scroll,dl,.founder,.band .wrap,.doc,.dia,.qa,.cube-wrap,.prin li');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var t=x.target;t.classList.add('in');setTimeout(function(){t.classList.add('done')},1600);io.unobserve(t)}})},{threshold:.1});
  els.forEach(function(e){e.classList.add('rv');io.observe(e)});
}
/* rotating language */
var rot=$('#rot');
if(rot){var w=['हिन्दी','తెలుగు','தமிழ்','ಕನ್ನಡ','বাংলা','ગુજરાતી','English'],n=0;
  setInterval(function(){rot.classList.add('out');setTimeout(function(){n=(n+1)%w.length;rot.textContent=w[n];rot.classList.remove('out')},300)},2200)}
/* network canvas + spotlight */
var hero=$('.hero'),c=$('#net');
if(c&&hero){
  var x=c.getContext('2d'),W,H,dpr=Math.min(devicePixelRatio||1,2),P=[],mx=-999,my=-999,run=true;
  var size=function(){var b=hero.getBoundingClientRect();W=b.width;H=b.height;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    var N=Math.round(Math.min(70,W*H/15000));P=[];for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,o:Math.random()<.25})};
  var step=function(){if(!run)return;x.clearRect(0,0,W,H);
    P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1});
    for(var i=0;i<P.length;i++){var a=P[i];
      for(var j=i+1;j<P.length;j++){var b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){x.strokeStyle='rgba(18,164,180,'+.28*(1-d/120)+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
      var m=Math.hypot(a.x-mx,a.y-my);if(m<170){x.strokeStyle='rgba(240,134,26,'+.5*(1-m/170)+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(mx,my);x.stroke()}
      x.fillStyle=a.o?'rgba(240,134,26,.85)':'rgba(18,164,180,.75)';x.beginPath();x.arc(a.x,a.y,a.o?2.4:1.8,0,6.3);x.fill()}
    requestAnimationFrame(step)};
  size();step();addEventListener('resize',size);
  new IntersectionObserver(function(e){var v=e[0].isIntersecting;if(v&&!run){run=true;step()}run=v}).observe(hero);
  hero.addEventListener('pointermove',function(e){var b=hero.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;hero.style.setProperty('--mx',mx+'px');hero.style.setProperty('--my',my+'px')});
  hero.addEventListener('pointerleave',function(){mx=my=-999});
}
if(!hov)return;
/* tilt with glare, magnetic buttons, hero parallax */
function onMove(box,fn){box.addEventListener('pointermove',function(e){var b=box.getBoundingClientRect();fn((e.clientX-b.left)/b.width-.5,(e.clientY-b.top)/b.height-.5)})}
$$('.cols>div,.steps li,.fig,.dia').forEach(function(el){
  onMove(el,function(a,b){el.style.transform='perspective(900px) rotateY('+a*8+'deg) rotateX('+(-b*8)+'deg)';el.style.setProperty('--gx',(a+.5)*100+'%');el.style.setProperty('--gy',(b+.5)*100+'%')});
  el.addEventListener('pointerleave',function(){el.style.transform=''})});
$$('.btn').forEach(function(el){
  onMove(el,function(a,b){el.style.transform='translate('+a*10+'px,'+b*8+'px)'});
  el.addEventListener('pointerleave',function(){el.style.transform=''})});
var st=$('.stage'),p=$('#phone');
if(st&&p){onMove(st,function(a,b){p.style.setProperty('--ry',(-18+a*24)+'deg');p.style.setProperty('--rx',(6-b*16)+'deg');st.style.setProperty('--px',a);st.style.setProperty('--py',b)});
  st.addEventListener('pointerleave',function(){p.style.removeProperty('--ry');p.style.removeProperty('--rx');st.style.setProperty('--px',0);st.style.setProperty('--py',0)})}
})();
