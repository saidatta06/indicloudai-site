(function(){
var cfg=window.IC_PLAYGROUND||{},API=(cfg.api||'').replace(/\/+$/,''),REGION=cfg.region||'outside India';
var $=function(i){return document.getElementById(i)};
var ta=$('pg-text'),cnt=$('pg-count'),btn=$('pg-go'),ok=$('pg-ok'),pill=$('pg-pill'),res=$('pg-res'),regionEls=document.querySelectorAll('.pg-region');
regionEls.forEach(function(e){e.textContent=REGION});
var ready=false,busy=false,lang='en',last=null,lastText='',hlDone=false;
function setPill(kind,text){pill.className='pg-pill '+kind;pill.querySelector('span').textContent=text}
function update(){cnt.textContent=ta.value.length+' / 1000';btn.disabled=!(ready&&!busy&&ok.checked&&ta.value.trim().length>0)}
ta.addEventListener('input',update);ok.addEventListener('change',update);
document.querySelectorAll('.pg-sample').forEach(function(b){b.addEventListener('click',function(){ta.value=b.dataset.t;update();ta.focus()})});
ta.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&!btn.disabled)run()});
btn.addEventListener('click',function(){run()});
function fetchT(url,opt,ms){var c=new AbortController(),t=setTimeout(function(){c.abort()},ms);opt=opt||{};opt.signal=c.signal;return fetch(url,opt).finally(function(){clearTimeout(t)})}
if(!API){setPill('soon','Playground launching soon');btn.textContent='Launching soon';btn.disabled=true;ok.disabled=true}
else{
  var tries=0,t0=Date.now();
  (function ping(){
    setPill('wait',tries<1?'Connecting to the server…':'Waking the server (up to a minute)…');
    fetchT(API+'/health',{cache:'no-store'},9000).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(){
      ready=true;setPill('ok','Server ready');update();
    }).catch(function(){tries++;if(Date.now()-t0>120000){setPill('bad','Server unavailable right now')}else setTimeout(ping,3500)});
  })();
}
var UI={
 en:{score:'Risk score',not:'Not a scam',why:'Why we say this',todo:'What to do',riskiest:'Riskiest part: ',est:'This is an estimate, not a guarantee.',legacyTop:'Closest category: ',where:'Show where in the message'},
 hi:{score:'जोखिम स्कोर',not:'धोखा नहीं',why:'हम ऐसा क्यों कह रहे हैं',todo:'क्या करें',riskiest:'सबसे जोखिम भरा हिस्सा: ',est:'यह एक अनुमान है, गारंटी नहीं।',legacyTop:'सबसे करीबी श्रेणी: ',where:'संदेश में कहाँ, यह देखें'}};
var LEGACY={scam:['Don’t click links, share OTPs or send money.','Report it to your bank, and at cybercrime.gov.in or on 1930.'],suspicious:['Be careful. Check with the sender through an official channel before you act.'],uncertain:['Treat unexpected requests for money, OTPs or links with caution.'],safe:['No scam pattern found. Still, never share OTPs or passwords with anyone.']};
function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s}
function li(parent,text){var e=document.createElement('li');e.textContent=text;parent.appendChild(e)}
function show(j){
  last=j;var a=j.answer,t=UI[lang]||UI.en;
  $('pg-empty').hidden=true;res.hidden=false;
  var tier=a?a.tier:(j.verdict&&j.verdict.level)||'uncertain';res.className='pg-res '+tier;
  res.querySelector('.pg-title').textContent=a?a.headline:j.verdict.title;
  var catEl=res.querySelector('.pg-cat'),sumEl=res.querySelector('.pg-sum');
  catEl.textContent=a&&a.category?(a.category.title+(a.category.what?' - '+a.category.what:'')):(t.legacyTop+(j.display_label||''));
  sumEl.textContent=a?a.summary:'';
  var pct=a?a.scam_percent:Math.round((j.scam_probability!=null?j.scam_probability:j.confidence)*1000)/10;
  res.querySelector('.pg-conf span').textContent=t.score+(a?' · '+t.not+' '+a.not_scam_percent+'%':'');
  res.querySelector('.pg-conf b').textContent=pct+'%';res.querySelector('.pg-meter i').style.width=pct+'%';
  res.querySelector('.pg-rel').textContent=a?(a.reliability+' '+t.est):'';
  var why=res.querySelector('.pg-why'),wl=why.querySelector('ul'),fq=why.querySelector('.pg-focus');wl.innerHTML='';
  if(a){(a.link_check||[]).forEach(function(x){li(wl,x.text)});(a.signals||[]).forEach(function(s){li(wl,cap(s))})}
  why.querySelector('h3').textContent=t.why;
  if(a&&a.focus_sentence){fq.hidden=false;fq.textContent=t.riskiest+'“'+a.focus_sentence+'”'}else fq.hidden=true;
  why.hidden=!(wl.children.length||(a&&a.focus_sentence));
  var hb=$('pg-hlbox');hb.hidden=false;hb.open=false;hlDone=false;$('pg-hl').textContent='';$('pg-hl-sum').textContent=t.where;
  var dos=res.querySelector('.pg-do'),ol=dos.querySelector('ol');ol.innerHTML='';
  var steps=a?(a.what_to_do||[]):(LEGACY[tier]||[]);steps.forEach(function(s){li(ol,s)});
  dos.querySelector('h3').textContent=t.todo;dos.querySelector('.pg-report').textContent=a&&a.report?a.report:'';dos.hidden=!steps.length;
  var l=res.querySelector('.pg-top');l.innerHTML='';
  (j.top_k||[]).forEach(function(r){var e=document.createElement('li'),n=document.createElement('span'),b=document.createElement('em'),i=document.createElement('i'),v=document.createElement('b');
    n.textContent=r.display;v.textContent=(Math.round(r.probability*1000)/10)+'%';i.style.width=Math.max(r.probability*100,1)+'%';b.appendChild(i);e.appendChild(n);e.appendChild(b);e.appendChild(v);l.appendChild(e)});
  res.querySelector('.pg-meta').textContent='Model '+j.model+' · '+j.latency_ms+' ms on the server · server in '+REGION;
  res.querySelectorAll('.pg-lang button').forEach(function(b){b.className=b.dataset.l===lang?'on':''});
  $('pg-fb').hidden=!a;$('pg-fb-q').hidden=false;$('pg-fb-thanks').hidden=true;$('pg-fb-consent').checked=false;$('pg-fb-note').value='';$('pg-fb-note').hidden=true;
  res.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});
}
function err(msg){$('pg-empty').hidden=true;res.hidden=false;res.className='pg-res error';res.querySelector('.pg-title').textContent='Could not analyse';res.querySelector('.pg-cat').textContent=msg;
  res.querySelector('.pg-sum').textContent='';res.querySelector('.pg-conf b').textContent='';res.querySelector('.pg-meter i').style.width='0';res.querySelector('.pg-rel').textContent='';
  res.querySelector('.pg-why').hidden=true;$('pg-hlbox').hidden=true;res.querySelector('.pg-do').hidden=true;res.querySelector('.pg-top').innerHTML='';res.querySelector('.pg-meta').textContent='';$('pg-fb').hidden=true}
function call(text){
  return fetchT(API+'/v1/classify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text,top_k:5,lang:lang}),cache:'no-store'},60000)
  .then(function(r){if(r.status===429){return r.json().then(function(){throw new Error('Too many requests. Please wait a few seconds and try again.')})}
    if(!r.ok)throw new Error('The server could not process that message.');return r.json()});
}
function fail(e){err(e&&e.name==='AbortError'?'The server took too long. Please try again.':(e&&e.message&&e.message!=='Failed to fetch'?e.message:'Could not reach the server. Check your connection and try again.'))}
function run(){
  if(btn.disabled)return;busy=true;btn.textContent='Analysing…';update();lastText=ta.value.trim();
  call(lastText).then(show).catch(fail).finally(function(){busy=false;btn.textContent='Analyse message';update()});
}
res.querySelectorAll('.pg-lang button').forEach(function(b){b.addEventListener('click',function(){
  if(b.dataset.l===lang||!lastText)return;lang=b.dataset.l;res.querySelectorAll('.pg-lang button').forEach(function(x){x.className=x.dataset.l===lang?'on':''});
  call(lastText).then(show).catch(fail);
})});
$('pg-hlbox').addEventListener('toggle',function(){
  if(!this.open||hlDone||!lastText||!window.AntahpragnaExplain)return;
  hlDone=true;AntahpragnaExplain.show($('pg-hl'),API,lastText,{lang:lang,hideTitle:true});
});
$('pg-fb-consent').addEventListener('change',function(){$('pg-fb-note').hidden=!this.checked});
$('pg-fb').querySelectorAll('button[data-v]').forEach(function(b){b.addEventListener('click',function(){
  if(!last||!last.answer)return;var a=last.answer,says=b.dataset.v,consent=$('pg-fb-consent').checked;
  if(says==='right')says=(a.tier==='likely'||a.tier==='scam')?'scam':(a.tier==='safe'?'safe':'unsure');
  var body={user_says:says,tier:a.tier,category:(a.category&&a.category.key)||'',risk:(a.scam_percent||0)/100,consent:consent,text:consent?lastText:'',note:consent?$('pg-fb-note').value:'',lang:a.language||'en',source:'web'};
  fetchT(API+'/v1/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)},15000).catch(function(){}).then(function(){$('pg-fb-q').hidden=true;$('pg-fb-thanks').hidden=false});
})});
update();
})();
