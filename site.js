(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(reduce)return;
var els=document.querySelectorAll('section h2,.cols>div,.steps li,.feat,.stats>div,.fig,.scroll,dl,.founder,.band .wrap,.doc');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var t=x.target;t.classList.add('in');setTimeout(function(){t.classList.add('done')},800);io.unobserve(t)}})},{threshold:.1});
  els.forEach(function(e){e.classList.add('rv');io.observe(e)});
}
if(!matchMedia('(hover:hover)').matches)return;
function tilt(box,fn){box.addEventListener('pointermove',function(e){var b=box.getBoundingClientRect();fn((e.clientX-b.left)/b.width-.5,(e.clientY-b.top)/b.height-.5)});}
document.querySelectorAll('.cols>div,.steps li,.fig').forEach(function(c){
  tilt(c,function(x,y){c.style.transform='perspective(900px) rotateY('+x*8+'deg) rotateX('+(-y*8)+'deg)'});
  c.addEventListener('pointerleave',function(){c.style.transform=''});
});
var s=document.querySelector('.stage'),p=document.getElementById('phone');
if(s&&p){
  tilt(s,function(x,y){p.style.setProperty('--ry',(-18+x*24)+'deg');p.style.setProperty('--rx',(6-y*16)+'deg')});
  s.addEventListener('pointerleave',function(){p.style.removeProperty('--ry');p.style.removeProperty('--rx')});
}
})();
