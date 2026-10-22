/* Animações das telas dos apps. Cada aparelho só anima enquanto está visível
   (no carrossel, só o que está na frente). */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phones = [].slice.call(document.querySelectorAll('.phone'));

  function setLive(p){
    var slide = p.closest('.slide');
    p.classList.toggle('is-live', !!p.dataset.vis && (!slide || slide.classList.contains('is-front')));
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ e.target.dataset.vis = e.isIntersecting ? '1' : ''; setLive(e.target); });
    }, {threshold:.25});
    phones.forEach(function(p){ io.observe(p); });
  } else {
    phones.forEach(function(p){ p.dataset.vis = '1'; setLive(p); });
  }

  /* carrossel dos apps */
  var carousel = document.querySelector('.carousel');
  if(carousel){
    var slides = [].slice.call(carousel.querySelectorAll('.slide'));
    var dots = [].slice.call(carousel.querySelectorAll('.carousel-dots button'));
    var cur = 0, timer = null, started = 0, remaining = 0, hovering = false;

    var schedule = function(ms){
      clearTimeout(timer);
      remaining = ms; started = Date.now();
      if(!reduce && !hovering) timer = setTimeout(function(){ show(cur + 1); }, ms);
    };
    var show = function(i){
      var n = slides.length;
      cur = (i + n) % n;
      slides.forEach(function(s, j){
        var d = (j - cur + n) % n;
        s.classList.toggle('is-front', d === 0);
        s.classList.toggle('is-next', d === 1);
        s.classList.toggle('is-prev', d === n - 1);
        s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        setLive(s.querySelector('.phone'));
      });
      var dur = +slides[cur].dataset.dur;
      dots.forEach(function(b){ b.classList.remove('on'); b.removeAttribute('aria-current'); });
      void carousel.offsetWidth;
      dots[cur].classList.add('on');
      dots[cur].setAttribute('aria-current', 'true');
      dots[cur].style.setProperty('--dur', dur + 'ms');
      carousel.style.setProperty('--glow', slides[cur].dataset.glow);
      schedule(dur);
    };

    dots.forEach(function(b, j){ b.addEventListener('click', function(){ show(j); }); });
    slides.forEach(function(s, j){ s.addEventListener('click', function(){ if(j !== cur) show(j); }); });

    carousel.addEventListener('mouseenter', function(){
      hovering = true; clearTimeout(timer);
      remaining = Math.max(400, remaining - (Date.now() - started));
      carousel.classList.add('paused');
    });
    carousel.addEventListener('mouseleave', function(){
      hovering = false; carousel.classList.remove('paused'); schedule(remaining);
    });

    var stage = carousel.querySelector('.carousel-stage'), downX = null;
    stage.addEventListener('pointerdown', function(e){ downX = e.clientX; });
    stage.addEventListener('pointerup', function(e){
      if(downX === null) return;
      var dx = e.clientX - downX; downX = null;
      if(Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    });

    show(0);
  }

  /* tema claro/escuro */
  var root = document.documentElement, themeBtn = document.querySelector('.theme-switch');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t, animate){
    if(animate){
      root.classList.add('theme-anim');
      clearTimeout(applyTheme.t);
      applyTheme.t = setTimeout(function(){ root.classList.remove('theme-anim'); }, 500);
    }
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
    themeMeta.setAttribute('content', t === 'dark' ? '#0d1015' : '#ffffff');
  }
  if(themeBtn){
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
    themeBtn.addEventListener('click', function(){
      var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(t, !reduce);
      try{ localStorage.setItem('tema', t); }catch(e){}
    });
  }

  /* topo: sombra ao rolar e barra de progresso; trajetória preenchendo com a rolagem */
  var topbar = document.querySelector('.topbar'), progress = document.querySelector('.progress'), ticking = false;
  var track = document.querySelector('.track'), marks = track ? [].slice.call(track.children) : [];
  function onScroll(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    topbar.classList.toggle('scrolled', window.scrollY > 8);
    progress.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    if(track){
      var r = track.getBoundingClientRect(), reach = window.innerHeight * .62 - r.top;
      track.style.setProperty('--fill', Math.max(0, Math.min(1, reach / r.height)).toFixed(4));
      marks.forEach(function(li){ li.classList.toggle('on', reach >= li.offsetTop + 41); });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  onScroll();

  if(reduce) return;
  document.documentElement.classList.add('motion');

  /* título entrando palavra por palavra */
  var h1 = document.querySelector('.hero h1');
  if(h1){
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', words.join(' '));
    h1.innerHTML = words.map(function(w, i){
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  }

  /* entradas na rolagem; irmãos entram em sequência */
  var revealSel = '.section > h2, .section-lead, .project-text > *, .stage, .minor > article, .how-head > *, .stack > div, .track li, .contact-panel > *';
  var lineSel = '.project, .minor, .steps';
  var groups = new Map();
  document.querySelectorAll(revealSel).forEach(function(el){
    el.classList.add('reveal');
    var n = groups.get(el.parentNode) || 0;
    el.style.setProperty('--d', Math.min(n, 6));
    groups.set(el.parentNode, n + 1);
  });
  var countTo = function(el){ countUp(el, +el.dataset.to, 1400); };
  if('IntersectionObserver' in window){
    var seen = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-to]').forEach(countTo);
        seen.unobserve(e.target);
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll(revealSel + ', ' + lineSel).forEach(function(el){ seen.observe(el); });
  } else {
    document.querySelectorAll('.reveal, ' + lineSel).forEach(function(el){ el.classList.add('in'); });
  }

  /* aparelhos inclinam seguindo o ponteiro */
  if(window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.carousel, .stage').forEach(function(box){
      var list = [].slice.call(box.querySelectorAll('.phone'));
      box.addEventListener('pointermove', function(ev){
        list.forEach(function(p){
          var r = p.getBoundingClientRect();
          var dx = Math.max(-1, Math.min(1, (ev.clientX - r.left - r.width / 2) / r.width));
          var dy = Math.max(-1, Math.min(1, (ev.clientY - r.top - r.height / 2) / r.height));
          p.style.transform = 'perspective(1100px) rotateY(' + (dx * 9).toFixed(2) + 'deg) rotateX(' + (-dy * 6).toFixed(2) + 'deg)';
        });
      }, {passive:true});
      box.addEventListener('pointerleave', function(){ list.forEach(function(p){ p.style.transform = ''; }); });
    });
  }

  var sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
  var app = function(name){ return document.querySelector('[data-app="' + name + '"]'); };
  var isLive = function(el){ return el.classList.contains('is-live') && !document.hidden; };

  async function waitLive(el){ while(!isLive(el)) await sleep(300); }

  async function tap(el){
    el.classList.remove('is-tap');
    void el.offsetWidth;
    el.classList.add('is-tap');
    await sleep(260);
    setTimeout(function(){ el.classList.remove('is-tap'); }, 500);
  }

  function countUp(el, to, ms){
    var start = performance.now();
    (function frame(now){
      var t = Math.min(1, (now - start) / ms);
      el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
      if(t < 1) requestAnimationFrame(frame);
    })(start);
  }

  /* leituras ao vivo (Comber) */
  var liveVals = [].slice.call(document.querySelectorAll('[data-live]'));
  setInterval(function(){
    liveVals.forEach(function(el){
      if(!isLive(el.closest('.phone'))) return;
      var d = el.dataset, v = Math.max(0, +d.base + (Math.random() * 2 - 1) * +d.amp);
      el.textContent = v.toFixed(+d.dec || 0) + (d.unit || '');
    });
  }, 1400);

  /* Comber: rolagem automática da tela inicial */
  var home = app('comber-home');
  if(home){
    var view = home.querySelector('.cb-view'), scroll = home.querySelector('.cb-scroll');
    var setMax = function(){ scroll.style.setProperty('--max', Math.max(0, scroll.scrollHeight - view.clientHeight) + 'px'); };
    setMax();
    window.addEventListener('load', setMax);
    if(document.fonts) document.fonts.ready.then(setMax);
  }

  /* Comber: falhas mais frequentes */
  var alerts = app('comber-alerts');
  if(alerts){
    var fails = [].slice.call(alerts.querySelectorAll('.cb-fail'));
    (async function(){
      for(;;){
        await waitLive(alerts);
        fails.forEach(function(f){
          var bar = f.querySelector('.cb-bar i');
          bar.style.transition = 'none';
          bar.style.width = '0';
          f.querySelector('[data-count]').textContent = '0';
        });
        void alerts.offsetWidth;
        await sleep(350);
        fails.forEach(function(f, i){
          setTimeout(function(){
            var bar = f.querySelector('.cb-bar i');
            bar.style.transition = '';
            bar.style.width = '';
            countUp(f.querySelector('[data-count]'), +f.dataset.n, 1000);
          }, i * 140);
        });
        await sleep(9000);
      }
    })();
  }

  /* Comber: toques passando pelos serviços */
  var services = app('comber-services');
  if(services){
    var targets = [].slice.call(services.querySelectorAll('[data-tap]'));
    (async function(){
      for(var i = 0;; i = (i + 1) % targets.length){
        await waitLive(services);
        await sleep(1500);
        tap(targets[i]);
      }
    })();
  }

  /* Atléticas: evento, detalhe e checkout */
  var flow = app('atl-flow');
  if(flow){
    var page = {};
    flow.querySelectorAll('[data-page]').forEach(function(p){ page[p.dataset.page] = p; });
    var qty = flow.querySelector('[data-qty]'), minus = flow.querySelector('[data-minus]');
    var target = function(name){ return flow.querySelector('[data-tap="' + name + '"]'); };

    var push = function(from, to){
      from.classList.remove('is-active'); from.classList.add('is-left');
      to.classList.add('is-active');
    };
    var reset = function(p){
      p.classList.add('no-anim');
      p.classList.remove('is-active', 'is-left');
      void p.offsetWidth;
      p.classList.remove('no-anim');
    };

    (async function(){
      for(;;){
        await waitLive(flow); await sleep(1800);
        await tap(target('event')); push(page.home, page.event);
        await sleep(2400);
        await tap(target('buy')); push(page.event, page.checkout);
        await sleep(1500);
        await tap(target('plus')); qty.textContent = '2'; minus.classList.remove('off');
        await sleep(1300);
        await tap(target('pix'));
        await sleep(1700);
        // volta ao início como um "voltar" do iOS
        reset(page.event);
        page.checkout.classList.remove('is-active');
        page.home.classList.remove('is-left'); page.home.classList.add('is-active');
        await sleep(600);
        qty.textContent = '1'; minus.classList.add('off');
      }
    })();
  }

  /* Atléticas: ranking */
  var ranking = app('atl-ranking');
  if(ranking){
    var list = ranking.querySelector('.atl-ranking');
    (async function(){
      for(;;){
        await waitLive(ranking);
        list.classList.remove('go'); void list.offsetWidth; list.classList.add('go');
        list.querySelectorAll('[data-count]').forEach(function(el, i){
          el.textContent = '0';
          setTimeout(function(){ countUp(el, +el.dataset.count, 1100); }, 200 + i * 80);
        });
        await sleep(11000);
      }
    })();
  }

  /* LinkURL: digitando número e mensagem */
  var lu = app('linkurl');
  if(lu){
    var phoneF = lu.querySelector('[data-field="phone"]'), msgF = lu.querySelector('[data-field="msg"]');
    var qr = lu.querySelector('.qr'), snack = lu.querySelector('.lu-snack');

    var type = async function(field, text, ms){
      var val = field.querySelector('.val');
      field.classList.add('focus');
      for(var i = 1; i <= text.length; i++){
        if(i === 1) field.classList.add('filled');
        val.textContent = text.slice(0, i);
        await sleep(ms + Math.random() * ms * .6);
      }
      await sleep(250);
      field.classList.remove('focus');
    };
    var clear = function(field){
      field.classList.remove('filled', 'focus');
      field.querySelector('.val').textContent = '';
    };

    (async function(){
      for(;;){
        await waitLive(lu); await sleep(900);
        await type(phoneF, '(64) 99812-3456', 65);
        await type(msgF, 'Oi! Vi o anúncio de vocês e queria saber o horário de funcionamento.', 38);
        qr.classList.add('on');
        await sleep(500);
        await tap(lu.querySelector('[data-tap="gen"]'));
        snack.classList.add('show');
        await sleep(2400);
        snack.classList.remove('show');
        await sleep(1400);
        clear(phoneF); clear(msgF); qr.classList.remove('on');
      }
    })();
  }
})();
