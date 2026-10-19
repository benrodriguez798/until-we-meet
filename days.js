// Day view: animated scene + itinerary panel + particles + optional sound.
(function(){
  var NS = "http://www.w3.org/2000/svg";
  var data = window.ITINERARY || [], scenes = window.SCENES || {};
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sh = document.getElementById("shanghai");

  // ---- DOM ----
  var root = document.createElement("div");
  root.id = "dayview"; root.setAttribute("role", "dialog"); root.setAttribute("aria-hidden", "true");
  root.innerHTML =
    '<svg id="dvscene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg>' +
    '<canvas id="dvfx"></canvas>' +
    '<button class="dv-btn" id="dvBack" type="button">&larr; Days</button>' +
    '<button class="dv-btn" id="dvSound" type="button" aria-pressed="false">&#9834; Sound off</button>' +
    '<section class="dv-panel"></section>';
  document.body.appendChild(root);
  var scene = root.querySelector("#dvscene"), cv = root.querySelector("#dvfx"), cx = cv.getContext("2d"),
      panel = root.querySelector(".dv-panel"), soundBtn = root.querySelector("#dvSound"), backBtn = root.querySelector("#dvBack");
  var current = 0, soundOn = false, W = 0, H = 0, dpr = 1, raf = 0, parts = [], lastSpawn = 0, lastFire = 0;

  // ---- particles ----
  var THEMES = {
    club:   { kind: "rise", colors: ["#ff2fa8", "#2ff0ff", "#ffe44f", "#9a6bff"], rate: 14 },
    bund:   { kind: "rise", colors: ["#ffd27a", "#ff9ec0", "#9ae6ff"], rate: 5 },
    french: { kind: "fall", colors: ["#e0a040", "#c9822c", "#f0c060", "#b8651e"], rate: 4 },
    disney: { kind: "fire", colors: ["#ff6b81", "#ffd24f", "#4fb4ff", "#ff8ae0", "#7dffb0"], rate: 8 },
    dusk:   { kind: "rise", colors: ["#ffd27a", "#ffb0c8", "#ffe3c0"], rate: 6 },
    suzhou: { kind: "fall", colors: ["#ffc6d6", "#ffb0c8", "#fff0f4"], rate: 5, petal: true },
    jingan: { kind: "rise", colors: ["#ffe08a", "#fff0c0", "#ffd27a"], rate: 5 }
  };
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function burst(x, y, th, big){
    var n = big ? 70 : 26, col = pick(th.colors), col2 = pick(th.colors);
    for (var i = 0; i < n; i++){
      var a = Math.PI * 2 * i / n + rnd(-.05, .05), sp = rnd(big ? 1.5 : .8, big ? 4.6 : 2.6);
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: big ? .035 : .02, life: 0, max: rnd(55, 95),
        s: rnd(1.2, 2.6), c: i % 3 ? col : col2, t: "dot", drag: .985 });
    }
  }
  function spawn(th){
    if (th.kind === "rise")
      parts.push({ x: rnd(0, W), y: H + 10, vx: rnd(-.2, .2), vy: -rnd(.3, 1.1), g: 0, life: 0, max: rnd(160, 340), s: rnd(1.5, 4), c: pick(th.colors), t: "glow", drag: 1 });
    else if (th.kind === "fall")
      parts.push({ x: rnd(0, W), y: -10, vx: rnd(-.3, .5), vy: rnd(.5, 1.3), g: 0, life: 0, max: rnd(400, 700), s: rnd(4, 8), c: pick(th.colors),
        t: th.petal ? "petal" : "leaf", r: rnd(0, 6), vr: rnd(-.04, .04), ph: rnd(0, 6), drag: 1 });
    else if (th.kind === "fire" && Math.random() < .5)
      parts.push({ x: rnd(0, W), y: H * rnd(.3, .9), vx: 0, vy: -rnd(.2, .6), g: 0, life: 0, max: rnd(80, 160), s: rnd(1.2, 2.4), c: "#fff6c0", t: "glow", drag: 1 });
  }
  function frame(t){
    raf = requestAnimationFrame(frame);
    var th = THEMES[data[current].theme];
    cx.clearRect(0, 0, W, H);
    if (t - lastSpawn > 1000 / th.rate){ lastSpawn = t; spawn(th); }
    if (th.kind === "fire" && t - lastFire > 1700){ lastFire = t; burst(rnd(W * .25, W * .9), rnd(H * .12, H * .45), th, true); }
    cx.globalCompositeOperation = "lighter";
    for (var i = parts.length - 1; i >= 0; i--){
      var p = parts[i]; p.life++;
      if (p.life > p.max){ parts.splice(i, 1); continue; }
      p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy;
      var k = 1 - p.life / p.max;
      if (p.t === "leaf" || p.t === "petal"){
        p.x += Math.sin((p.life + p.ph * 30) / 40) * .5; p.r += p.vr;
        cx.globalCompositeOperation = "source-over";
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = Math.min(1, k * 3) * .9; cx.fillStyle = p.c;
        cx.beginPath(); cx.ellipse(0, 0, p.s, p.s * (p.t === "petal" ? .65 : .45), 0, 0, 7); cx.fill(); cx.restore();
        continue;
      }
      cx.globalCompositeOperation = "lighter";
      cx.globalAlpha = p.t === "glow" ? Math.sin(Math.PI * Math.min(1, p.life / p.max)) * .8 : k;
      cx.fillStyle = p.c;
      cx.beginPath(); cx.arc(p.x, p.y, p.s * (p.t === "glow" ? 1 : (.5 + k * .8)), 0, 7); cx.fill();
      if (p.t === "dot"){ cx.globalAlpha *= .4; cx.beginPath(); cx.arc(p.x - p.vx * 2, p.y - p.vy * 2, p.s * .7, 0, 7); cx.fill(); }
    }
    cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over";
  }
  function startFx(){
    if (reduce || raf) return;
    resize(); parts = [];
    var th = THEMES[data[current].theme];
    if (th.kind === "fire") burst(W * .6, H * .3, th, true);
    raf = requestAnimationFrame(frame);
  }
  function stopFx(){ cancelAnimationFrame(raf); raf = 0; parts = []; cx.clearRect(0, 0, W, H); }
  window.addEventListener("resize", function(){ if (root.classList.contains("open")) resize(); });
  root.addEventListener("pointerdown", function(e){
    if (reduce || e.target.closest(".dv-panel, .dv-btn")) return;
    var r = cv.getBoundingClientRect(), th = THEMES[data[current].theme];
    burst(e.clientX - r.left, e.clientY - r.top, th, th.kind === "fire");
  });
  document.addEventListener("visibilitychange", function(){
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (root.classList.contains("open")) startFx();
  });

  // ---- panel + scene ----
  // Wide windows: show the whole scene (letterbox sideways, extending the sky/ground); otherwise anchor to the bottom.
  function fit(){
    var r = scene.getBoundingClientRect(), wide = r.width / r.height > 1.78;
    scene.setAttribute("preserveAspectRatio", wide ? "xMidYMax meet" : "xMidYMax slice");
  }
  function extend(){
    scene.querySelectorAll("rect").forEach(function(el){
      if (Number(el.getAttribute("width")) >= 1600 && !Number(el.getAttribute("x"))){ el.setAttribute("x", -3000); el.setAttribute("width", 7600); }
    });
  }
  window.addEventListener("resize", fit);
  function render(){
    var d = data[current], prev = data[current - 1], next = data[current + 1];
    scene.innerHTML = scenes[d.theme] ? scenes[d.theme]() : "";
    extend(); fit();
    panel.innerHTML =
      '<div class="dv-head"><span class="dv-day">Day ' + d.day + '</span><h2>' + d.title + '</h2><span class="dv-date">' + d.date + '</span></div>' +
      '<ol class="dv-list">' + d.items.map(function(it, i){
        return '<li style="--i:' + i + '"><span class="t">' + it.time + '</span><span class="x">' + it.text + '</span></li>';
      }).join("") + '</ol>' +
      '<div class="dv-nav"><button type="button" data-go="-1"' + (prev ? "" : " disabled") + '>&larr; Day ' + (prev ? prev.day : "") + '</button>' +
      '<button type="button" data-go="1"' + (next ? "" : " disabled") + '>Day ' + (next ? next.day : "") + ' &rarr;</button></div>';
    if (soundOn) DaySound.start(d.theme);
  }
  function open(n){
    var i = data.findIndex(function(d){ return d.day === n; });
    if (i < 0) return;
    current = i; render();
    root.classList.add("open"); root.setAttribute("aria-hidden", "false");
    try { history.replaceState(null, "", "#day" + n); } catch (e) {}
    stopFx(); startFx(); backBtn.focus();
  }
  function close(){
    root.classList.remove("open"); root.setAttribute("aria-hidden", "true");
    stopFx(); DaySound.stop();
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    var b = document.querySelector('.day[data-day="' + data[current].day + '"]'); if (b) b.focus();
  }
  function setSound(on){
    soundOn = on; soundBtn.setAttribute("aria-pressed", on);
    soundBtn.innerHTML = "&#9834; Sound " + (on ? "on" : "off");
    if (on) DaySound.start(data[current].theme); else DaySound.stop();
  }

  panel.addEventListener("click", function(e){
    var b = e.target.closest("[data-go]"); if (!b || b.disabled) return;
    var n = data[current + Number(b.getAttribute("data-go"))]; if (n) { stopFx(); current = data.indexOf(n); render(); startFx();
      try { history.replaceState(null, "", "#day" + n.day); } catch (er) {} }
  });
  backBtn.addEventListener("click", close);
  soundBtn.addEventListener("click", function(){ setSound(!soundOn); });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && root.classList.contains("open")){ e.stopImmediatePropagation(); close(); }
  }, true);
  document.querySelectorAll(".day").forEach(function(b){
    b.addEventListener("click", function(){ open(Number(b.getAttribute("data-day"))); });
  });

  // deep link: index.html#day3
  var m = /^#day(\d)$/.exec(location.hash);
  if (m){ sh.classList.add("open"); sh.setAttribute("aria-hidden", "false"); open(Number(m[1])); }
})();
