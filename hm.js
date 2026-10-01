
// 스크롤하면 떠오르기
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.18});
document.querySelectorAll('.up').forEach(el=>io.observe(el));
// 알림 카드 — 3.2초마다 다음 상품
// ★ requestAnimationFrame 을 쓰지 않는다 — 폰에서 화면이 가려지면 그 신호가 멈춰, 옛 글은 지워지고
//   새 글은 숨은 채 남아 빈 카드가 됐다(2026-09-30 사장님 폰). 화면이 가려져 있으면 아예 안 넘긴다.
(function(){const box=document.querySelector('.toast .tx');if(!box)return;const L=JSON.parse(box.dataset.list);
 for(let k=L.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[L[k],L[j]]=[L[j],L[k]];}   // 들어올 때마다 차례를 섞는다
 let i=0;const mk=h=>{const d=document.createElement('div');d.className='t';d.innerHTML=h;return d;};
 let cur=mk(L[0]);box.appendChild(cur);
 setInterval(()=>{if(document.hidden)return;
   [...box.children].forEach(c=>{if(c!==cur)c.remove();});        // 혹시 남은 것 치우기
   i=(i+1)%L.length;const nx=mk(L[i]);nx.classList.add('pre');box.appendChild(nx);
   void nx.offsetWidth;                                               // 제자리를 먼저 잡게 한 뒤
   cur.classList.add('out');nx.classList.remove('pre');
   const old=cur;setTimeout(()=>old.remove(),600);cur=nx;},3200);})();
// 장보기 목록 — 들어올 때마다 라면·간식·화장품·생활용품에서 하나씩 뽑는다
(function(){const m=document.getElementById('cartmk');if(!m)return;const S=JSON.parse(m.dataset.slots);
 const pick=a=>a[Math.floor(Math.random()*a.length)];const w=n=>n.toLocaleString()+'원';
 const e=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const L=S.filter(a=>a.length).map(pick);let q=0,c=0,g=0;
 m.querySelector('.its').innerHTML=L.map(x=>{q+=x.q;c+=x.c*x.q;g+=x.g*x.q;
   return '<div class="it"><img src="'+x.i+'" alt="" loading="lazy" decoding="async"><div class="n">'+e(x.n)+'<br><b>'+w(x.g)+'</b></div><span class="q">－<b>'+x.q+'</b>＋</span></div>';}).join('');
 m.querySelector('.sum small').textContent=q+'개 · 온라인보다';m.querySelector('.sum b').textContent=w(c-g)+' 아껴요';
 m.querySelector('.sum .t').textContent=w(g);})();
// 비교 카드 넘김 — 10초마다 · 4.2초 동안 아주 천천히(사장님: 3배 이상 느리게) · 늘 같은 방향 (마지막 → 첫 카드도)
// ★ scrollIntoView 를 쓰지 마라 — 카드 줄만이 아니라 **페이지 전체를 위아래로 끌어당겨** 스크롤이 덜컹거렸다 (2026-09-30)
(function(){const s=document.querySelector('.slides');if(!s)return;const sl=[...s.children],n=sl.length;const dots=[...document.querySelectorAll('.dots i')];
 const cl=sl[0].cloneNode(true);cl.setAttribute('aria-hidden','true');s.appendChild(cl);const all=[...sl,cl];
 all.forEach(x=>x.querySelectorAll('.b').forEach(b=>b.style.height=b.dataset.h+'%'));
 const grow=el=>el.querySelectorAll('.b').forEach(b=>b.classList.add('on'));
 let cur=0,t=null,busy=false,hold=0;const W=()=>s.clientWidth;
 const mark=i=>{cur=i%n;dots.forEach((d,k)=>d.classList.toggle('on',k===cur));grow(all[i]);};
 const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
 const slide=to=>{if(busy)return;busy=true;grow(all[to]);const from=s.scrollLeft,dx=to*W()-from,t0=performance.now(),dur=4200;s.style.scrollSnapType='none';
   const step=now=>{const k=Math.min(1,(now-t0)/dur);s.scrollLeft=from+dx*ease(k);
     if(k<1)return requestAnimationFrame(step);
     if(to>=n)s.scrollLeft=0;                       // 복사본에 닿으면 진짜 첫 카드로 몰래 되돌림
     else s.scrollLeft=to*W();s.style.scrollSnapType='';busy=false;mark(to%n);};
   requestAnimationFrame(step);};
 s.addEventListener('scroll',()=>{if(busy)return;let i=Math.round(s.scrollLeft/W());if(i>=n){s.scrollLeft=0;i=0;}mark(i);},{passive:true});
 s.addEventListener('pointerdown',()=>{hold=Date.now()+8000;});   // 손으로 넘기는 동안은 자동 넘김 쉼
 mark(0);
 const tick=()=>{if(document.hidden||busy||Date.now()<hold)return;slide(cur+1);};
 new IntersectionObserver(es=>es.forEach(e=>{clearInterval(t);t=null;if(e.isIntersecting)t=setInterval(tick,10000);}),{threshold:.3}).observe(s);})();
// 숫자 올라가기
const cnt=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cnt.unobserve(e.target);const el=e.target,to=+el.dataset.to,suf=el.dataset.suf||'';let st=null;
 const f=ts=>{st=st||ts;const k=Math.min(1,(ts-st)/1400),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=v.toLocaleString()+suf;if(k<1)requestAnimationFrame(f);};requestAnimationFrame(f);}),{threshold:.5});
document.querySelectorAll('[data-to]').forEach(el=>cnt.observe(el));
// 종이꽃
(function(){const f=document.querySelector('.feat');if(!f)return;const C=['#11974B','#F56666','#FFC53D','#20C997','#845EF7'];
 for(let i=0;i<18;i++){const c=document.createElement('i');c.className='conf';c.style.left=Math.random()*100+'%';c.style.background=C[i%5];
 c.style.animationDuration=(5+Math.random()*6)+'s';c.style.animationDelay=(-Math.random()*8)+'s';f.appendChild(c);}})();
