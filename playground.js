(function(){
var cfg=window.IC_PLAYGROUND||{},API=(cfg.api||'').replace(/\/+$/,''),REGION=cfg.region||'outside India';
var $=function(i){return document.getElementById(i)};
var ta=$('pg-text'),cnt=$('pg-count'),btn=$('pg-go'),ok=$('pg-ok'),pill=$('pg-pill'),res=$('pg-res'),regionEls=document.querySelectorAll('.pg-region');
regionEls.forEach(function(e){e.textContent=REGION});
var ready=false,busy=false;
function setPill(kind,text){pill.className='pg-pill '+kind;pill.querySelector('span').textContent=text}
function update(){cnt.textContent=ta.value.length+' / 1000';btn.disabled=!(ready&&!busy&&ok.checked&&ta.value.trim().length>0)}
ta.addEventListener('input',update);ok.addEventListener('change',update);
document.querySelectorAll('.pg-sample').forEach(function(b){b.addEventListener('click',function(){ta.value=b.dataset.t;update();ta.focus()})});
ta.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&!btn.disabled)run()});
btn.addEventListener('click',run);
/* wake the server */
function fetchT(url,opt,ms){var c=new AbortController(),t=setTimeout(function(){c.abort()},ms);opt=opt||{};opt.signal=c.signal;return fetch(url,opt).finally(function(){clearTimeout(t)})}
if(!API){setPill('soon','Playground launching soon');btn.textContent='Launching soon';btn.disabled=true;ok.disabled=true}
else{
  var tries=0,t0=Date.now();
  (function ping(){
    setPill('wait',tries<1?'Connecting to the server…':'Waking the server (up to a minute)…');
    fetchT(API+'/health',{cache:'no-store'},9000).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
      ready=true;setPill('ok','Server ready');update();
    }).catch(function(){tries++;if(Date.now()-t0>120000){setPill('bad','Server unavailable right now')}else setTimeout(ping,3500)});
  })();
}
var MSG={
 scam:['Don’t click links, share OTPs or send money.','Report it to your bank, and at cybercrime.gov.in or on 1930.'],
 suspicious:['Be careful. Check with the sender through an official channel before you act.'],
 uncertain:['The model is not sure. Treat unexpected requests for money, OTPs or links with caution.'],
 safe:['No scam pattern found. Still, never share OTPs or passwords with anyone.']};
function show(j){
  $('pg-empty').hidden=true;var lv=j.verdict.level;res.hidden=false;res.className='pg-res '+lv;
  res.querySelector('.pg-title').textContent=j.verdict.title;
  res.querySelector('.pg-cat').textContent='Closest category: '+j.display_label;
  var sp=(j.scam_probability!=null?j.scam_probability:j.confidence),pct=Math.round(sp*1000)/10;res.querySelector('.pg-conf span').textContent='Scam probability';res.querySelector('.pg-conf b').textContent=pct+'%';
  res.querySelector('.pg-meter i').style.width=pct+'%';
  var adv=res.querySelector('.pg-adv');adv.innerHTML='';MSG[lv].forEach(function(t){var p=document.createElement('p');p.textContent=t;adv.appendChild(p)});
  var l=res.querySelector('.pg-top');l.innerHTML='';
  j.top_k.forEach(function(r){var li=document.createElement('li'),n=document.createElement('span'),b=document.createElement('em'),i=document.createElement('i'),v=document.createElement('b');
    n.textContent=r.display;v.textContent=(Math.round(r.probability*1000)/10)+'%';i.style.width=Math.max(r.probability*100,1)+'%';b.appendChild(i);li.appendChild(n);li.appendChild(b);li.appendChild(v);l.appendChild(li)});
  res.querySelector('.pg-meta').textContent='Model '+j.model+' · '+j.latency_ms+' ms on the server · server in '+REGION;
  res.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});
}
function err(msg){$('pg-empty').hidden=true;res.hidden=false;res.className='pg-res error';res.querySelector('.pg-title').textContent='Could not analyse';res.querySelector('.pg-cat').textContent=msg;
  res.querySelector('.pg-conf b').textContent='';res.querySelector('.pg-meter i').style.width='0';res.querySelector('.pg-adv').innerHTML='';res.querySelector('.pg-top').innerHTML='';res.querySelector('.pg-meta').textContent=''}
function run(){
  if(btn.disabled)return;busy=true;btn.textContent='Analysing…';update();
  fetchT(API+'/v1/classify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:ta.value.trim(),top_k:5}),cache:'no-store'},60000)
  .then(function(r){if(r.status===429){return r.json().then(function(){throw new Error('Too many requests. Please wait a few seconds and try again.')})}
    if(!r.ok)throw new Error('The server could not process that message.');return r.json()})
  .then(show).catch(function(e){err(e&&e.name==='AbortError'?'The server took too long. Please try again.':(e&&e.message&&e.message!=='Failed to fetch'?e.message:'Could not reach the server. Check your connection and try again.'))})
  .finally(function(){busy=false;btn.textContent='Analyse message';update()});
}
update();
})();
