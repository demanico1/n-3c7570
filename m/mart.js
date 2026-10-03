(function(){
// 한국 시각으로 오늘 요일·지금 시각 → 영업 상태 · 오늘 줄 칠하기
const HOLI={"2026-01-01": "신정", "2026-02-16": "설 연휴", "2026-02-17": "설날", "2026-02-18": "설 연휴", "2026-03-01": "삼일절", "2026-03-02": "삼일절 대체공휴일", "2026-05-05": "어린이날", "2026-05-24": "부처님오신날", "2026-05-25": "부처님오신날 대체공휴일", "2026-06-03": "지방선거일", "2026-06-06": "현충일", "2026-08-15": "광복절", "2026-08-17": "광복절 대체공휴일", "2026-09-24": "추석 연휴", "2026-09-25": "추석", "2026-09-26": "추석 연휴", "2026-10-03": "개천절", "2026-10-05": "개천절 대체공휴일", "2026-10-09": "한글날", "2026-12-25": "성탄절", "2027-01-01": "신정", "2027-02-06": "설 연휴", "2027-02-07": "설날", "2027-02-08": "설 연휴", "2027-02-09": "설 대체공휴일", "2027-03-01": "삼일절", "2027-05-05": "어린이날", "2027-05-13": "부처님오신날", "2027-06-06": "현충일", "2027-08-15": "광복절", "2027-08-16": "광복절 대체공휴일", "2027-09-14": "추석 연휴", "2027-09-15": "추석", "2027-09-16": "추석 연휴", "2027-10-03": "개천절", "2027-10-04": "개천절 대체공휴일", "2027-10-09": "한글날", "2027-10-11": "한글날 대체공휴일", "2027-12-25": "성탄절", "2027-12-27": "성탄절 대체공휴일"},HOLX={};function HOL(n){const d=new Date(Date.now()+9*36e5),k=d.toISOString().slice(0,10);return HOLX[n]?'':(HOLI[k]||'')}
(function(){const el=document.getElementById('mst');if(!el)return;const H=JSON.parse(el.dataset.h);
 const now=new Date(Date.now()+(9*60+new Date().getTimezoneOffset())*60000);const wd=now.getDay();
 const key=wd===0?'일':wd===6?'토':'평일';const ho=HOL(((document.querySelector('h1')||{}).textContent||'').trim());if(ho){el.className='st shut';el.innerHTML='<i></i>오늘 쉬어요 <em>· '+ho+'</em>';return;}const row=document.querySelector('.hrs tr[data-k="'+key+'"]');if(row)row.classList.add('today');
 const v=H[key]||'';const m=v.match(/^(\d{1,2}):(\d{2})~(\d{1,2}):(\d{2})$/);const t=now.getHours()*60+now.getMinutes();
 const set=(c,a,b)=>{el.className='st '+c;el.innerHTML='<i></i>'+a+(b?' <em>· '+b+'</em>':'');};
 if(!m){set('',key==='평일'?'영업시간 정보 없음':'오늘('+(key==='토'?'토요일':'일요일')+') 영업시간 안내가 없어요','전화로 확인해 주세요');return;}
 const o=+m[1]*60+ +m[2],c=+m[3]*60+ +m[4];
 if(t<o)set(o-t<=60?'soon':'shut','영업 전',m[1]+':'+m[2]+'에 열어요');
 else if(t<c)set(c-t<=60?'soon':'open','지금 영업 중',m[3]+':'+m[4]+'에 닫아요');
 else set('shut','오늘 영업 끝',m[3]+':'+m[4]+'에 닫았어요');})();
// 작은 지도 — 보일 때만 불러온다. 페이지 가운데 있어서 한 손가락은 페이지 스크롤, 지도는 두 손가락
function guard(el){const tip=document.createElement('div');tip.className='pxm-tip';el.appendChild(tip);let t=0,two=false;const P=new Set();
 const say=s=>{tip.innerHTML='<span>'+s+'</span>';tip.classList.add('on');clearTimeout(t);t=setTimeout(()=>tip.classList.remove('on'),1300)};
 const mac=/Mac|iPhone|iPad/.test(navigator.platform||'');const o={capture:true,passive:true};
 const T=e=>{if(e.touches.length>=2)two=true;if(!two)e.stopPropagation();if(!e.touches.length)two=false};
 el.addEventListener('touchstart',T,o);el.addEventListener('touchend',T,o);el.addEventListener('touchcancel',T,o);
 el.addEventListener('touchmove',e=>{T(e);if(!two)say('두 손가락으로 지도를 움직여요')},o);
 const Q=e=>{if(e.pointerType!=='touch')return;if(e.type==='pointerdown')P.add(e.pointerId);if(P.size>=2)two=true;if(!two)e.stopPropagation();
  if(e.type==='pointerup'||e.type==='pointercancel'){P.delete(e.pointerId);if(!P.size)two=false}};
 ['pointerdown','pointermove','pointerup','pointercancel'].forEach(k=>el.addEventListener(k,Q,o));
 el.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey)return;e.stopPropagation();say((mac?'⌘':'Ctrl')+' + 휠로 지도를 키워요')},o)}
(function(){const e=document.getElementById('mmap');if(!e)return;
 const io=new IntersectionObserver(es=>{if(!es.some(x=>x.isIntersecting))return;io.disconnect();const s=document.createElement('script');
  s.src='https://dapi.kakao.com/v2/maps/sdk.js?appkey=f6f4f84fa14889b2737f2812b1b27a98&autoload=false';s.onerror=()=>{e.querySelector('.ph').textContent='지도를 불러오지 못했어요'};
  s.onload=()=>kakao.maps.load(()=>{e.innerHTML='';const p=new kakao.maps.LatLng(+e.dataset.la,+e.dataset.lo),m=new kakao.maps.Map(e,{center:p,level:4});guard(e);
   const d=document.createElement('div');d.className='mpin';d.innerHTML='<b>'+e.dataset.n+'</b><i></i>';
   new kakao.maps.CustomOverlay({position:p,content:d,yAnchor:1}).setMap(m)});document.head.appendChild(s)},{rootMargin:'200px'});io.observe(e)})();
// 공유하기 — 카카오톡(미리 받아 둔 공유 도구) → 폰 공유 창 → 링크 복사
(function(){const KEY='f6f4f84fa14889b2737f2812b1b27a98';let ld=null;
 const sdk=()=>ld||(ld=new Promise((ok,no)=>{if(window.Kakao)return ok();const s=document.createElement('script');s.src='https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)}));
 if(document.querySelector('[data-share]'))setTimeout(()=>sdk().catch(()=>{}),1200);   // 누르기 전에 미리 받아 둔다
 const toast=t=>{const e=document.getElementById('toastc');if(!e)return;e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1800)};
 const copy=u=>{const man=()=>{const w=document.getElementById('cpman');w.querySelector('p').textContent=u;w.hidden=false};
  if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(u).then(()=>toast('링크를 복사했어요'),man);else man()};
 document.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',async()=>{const u=b.dataset.share,t=b.dataset.t,d=b.dataset.d,img=b.dataset.img;
  try{if(window.Kakao){if(!Kakao.isInitialized())Kakao.init(KEY);
   Kakao.Share.sendDefault({objectType:'feed',content:{title:t,description:d,imageUrl:img,link:{mobileWebUrl:u,webUrl:u}},
    buttons:[{title:'마트 정보 보기',link:{mobileWebUrl:u,webUrl:u}}]});return}}catch(e){}
  if(navigator.share){try{await navigator.share({title:t,text:d,url:u});return}catch(e){if(e&&e.name==='AbortError')return}}
  copy(u)}));
 document.addEventListener('click',e=>{if(e.target.id==='cpman'||e.target.closest('#cpman button'))document.getElementById('cpman').hidden=true;});})();
})();
;(function(){try{var m=document.cookie.match(/(?:^|; )pxv=([a-z0-9]{10})\.(\d{1,4})\./),V=m?'/~v'+Math.min(+m[2],99)+'.'+m[1]:'',s='etc',w='';try{s=sessionStorage.getItem('pxp-src')||'etc';w=sessionStorage.getItem('pxp-srcw')||''}catch(e){}function hit(a){var u='/hit/mart/'+a+'/'+s+(w?'/'+encodeURIComponent(w):'')+V;try{if(!(navigator.sendBeacon&&navigator.sendBeacon(u)))fetch(u,{method:'POST',keepalive:true})}catch(e){}}document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('a,button');if(!t)return;var h=t.getAttribute('href')||'',x=t.textContent||'';var k=/^tel:/.test(h)?'call':/map\.kakao\.com\/link\/to/.test(h)?'route':(/place\.map\.kakao\.com/.test(h)||/실시간 영업시간/.test(x))?'live':t.hasAttribute('data-share')?'share':/내 근처 마트/.test(x)?'near':(t.closest('.pxm')&&/\/m\//.test(h))?'kmap':'';if(k)hit(k)},true)}catch(e){}})();