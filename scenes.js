// Animated SVG scenes for each Shanghai day (viewBox 1600x900, hero centred near x=850).
// Each scene returns inner SVG markup. Styling/animation classes live in day.css.
window.SCENES = (function(){
  var R = function(a, b){ return a + Math.random() * (b - a); };
  var RI = function(a, b){ return Math.floor(R(a, b + 1)); };
  var P = function(a){ return a[Math.floor(Math.random() * a.length)]; };
  var F = function(n){ return n.toFixed(1); };
  var dl = function(max){ return "animation-delay:-" + F(R(0, max || 3)) + "s"; };

  function stars(n, ymax){
    var h = "";
    for (var i = 0; i < n; i++)
      h += '<circle class="star" cx="' + RI(0, 1600) + '" cy="' + RI(0, ymax) + '" r="' + F(R(.4, 1.8)) + '" fill="#fff" style="' + dl() + '"/>';
    return h;
  }
  // random lit windows inside [x,y,w,h] boxes
  function wins(boxes, cols, per){
    var h = "";
    boxes.forEach(function(b){
      var n = Math.floor(b[2] * b[3] / (per || 650));
      for (var i = 0; i < n; i++)
        h += '<rect class="twinkle" x="' + RI(b[0] + 5, b[0] + b[2] - 9) + '" y="' + RI(b[1] + 6, b[1] + b[3] - 12) +
          '" width="4" height="6" fill="' + P(cols) + '" style="' + dl(3) + ';animation-duration:' + F(R(2, 6)) + 's"/>';
    });
    return h;
  }
  function grad(id, stops, vertical){
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical === false ? 1 : 0) + '" y2="' + (vertical === false ? 0 : 1) + '">' +
      stops.map(function(s){ return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : "") + '/>'; }).join("") + "</linearGradient>";
  }
  function couple(x, y, s, col){
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + col + '">' +
      '<circle cx="-14" cy="-74" r="9"/><path d="M-26 0 L-23 -58 Q-14 -66 -5 -58 L-3 0Z"/>' +
      '<circle cx="14" cy="-66" r="8.5"/><path d="M4 0 L7 -52 Q14 -60 21 -52 L24 0Z"/>' +
      '<path d="M-6 -40 Q0 -30 8 -38" stroke="' + col + '" stroke-width="4" fill="none"/>' +
      '<path class="pulse" d="M0 -104 c-5 -7 -14 0 0 12 c14 -12 5 -19 0 -12z" fill="#ff6b81"/></g>';
  }
  // Pudong landmarks (coordinates from baseline y=770), placed with translate/scale
  function pudong(tx, ty, s, pal){
    var h = '<g transform="translate(' + tx + ',' + ty + ') scale(' + s + ')">';
    h += '<g fill="' + pal.far + '" opacity=".85"><rect x="150" y="560" width="70" height="210"/><rect x="250" y="520" width="50" height="250"/><rect x="330" y="580" width="80" height="190"/>' +
      '<rect x="560" y="570" width="60" height="200"/><rect x="1130" y="540" width="56" height="230"/><rect x="1210" y="500" width="46" height="270"/><rect x="1300" y="570" width="70" height="200"/><rect x="1400" y="520" width="50" height="250"/></g>';
    h += '<g fill="' + pal.near + '"><rect x="400" y="560" width="64" height="210"/><rect x="800" y="580" width="70" height="190"/><rect x="880" y="540" width="52" height="230"/>' +
      '<rect x="1090" y="570" width="50" height="200"/></g>';
    h += '<path d="M470 770 L486 420 Q505 300 520 190 Q535 300 554 420 L570 770Z" fill="' + pal.main + '"/>' +
      '<path d="M520 190 V140" stroke="' + pal.mast + '" stroke-width="4"/>' +
      '<path d="M488 400 Q520 370 552 400 M484 500 Q520 470 556 500 M480 610 Q520 580 560 610" stroke="' + pal.trim + '" stroke-width="2" fill="none" opacity=".7"/>';
    h += '<g fill="' + pal.alt + '"><polygon points="620,770 630,300 650,300 660,770"/><rect x="638" y="240" width="4" height="60"/></g>';
    h += '<path d="M700 770 L706 330 L772 330 L778 770Z" fill="' + pal.alt + '"/><ellipse cx="739" cy="345" rx="14" ry="12" fill="' + pal.hole + '"/>';
    h += '<polygon points="990,770 1006,430 1014,430 1030,770" fill="' + pal.alt + '"/>' +
      '<polygon points="972,770 998,500 1004,500 988,770" fill="' + pal.main + '" opacity=".8"/><polygon points="1032,770 1016,500 1022,500 1048,770" fill="' + pal.main + '" opacity=".8"/>' +
      '<rect x="1007" y="330" width="6" height="140" fill="' + pal.alt + '"/>' +
      '<circle cx="1010" cy="560" r="26" fill="' + pal.pearl + '"/><circle cx="1010" cy="400" r="40" fill="' + pal.pearl + '"/>' +
      '<circle cx="1000" cy="390" r="12" fill="#fff" opacity=".35"/><circle cx="1010" cy="320" r="17" fill="' + pal.pearl + '"/>' +
      '<rect x="1008" y="220" width="4" height="100" fill="' + pal.mast + '"/><circle class="twinkle" cx="1010" cy="220" r="5" fill="#ff4d4d"/>';
    if (pal.lit) h += wins([[400, 560, 64, 210], [800, 580, 70, 190], [880, 540, 52, 230], [1090, 570, 50, 200], [478, 420, 84, 340], [626, 320, 28, 440], [708, 380, 62, 380]], pal.lit, 600);
    return h + "</g>";
  }
  function truss(x0, x1, yDeck, peak, n){
    var d = "", pts = [], i;
    for (i = 0; i <= n; i++){
      var x = x0 + (x1 - x0) * i / n, t = i / n;
      pts.push([x, yDeck - peak * 4 * t * (1 - t)]);
    }
    d += "M" + pts.map(function(p){ return F(p[0]) + " " + F(p[1]); }).join("L");
    for (i = 0; i <= n; i++) d += "M" + F(pts[i][0]) + " " + yDeck + "V" + F(pts[i][1]);
    for (i = 0; i < n; i++){
      var a = i < n / 2 ? i : i + 1, b = i < n / 2 ? i + 1 : i;
      d += "M" + F(pts[a][0]) + " " + yDeck + "L" + F(pts[b][0]) + " " + F(pts[b][1]);
    }
    return d;
  }
  function bareTree(x, y, len, depth, lights){
    var levels = [], tips = [];
    (function rec(px, py, a, l, d){
      if (d < 0) return;
      var x2 = px + Math.sin(a) * l, y2 = py - Math.cos(a) * l;
      (levels[d] = levels[d] || []).push("M" + F(px) + " " + F(py) + "L" + F(x2) + " " + F(y2));
      if (d === 0) tips.push([x2, y2]);
      rec(x2, y2, a - R(.25, .6), l * R(.7, .82), d - 1);
      rec(x2, y2, a + R(.25, .6), l * R(.7, .82), d - 1);
      if (d > 2 && Math.random() < .4) rec(x2, y2, a + R(-.2, .2), l * .62, d - 2);
    })(x, y, 0, len, depth);
    var h = "";
    for (var d = levels.length - 1; d >= 0; d--)
      h += '<path d="' + levels[d].join("") + '" stroke="' + (d > depth - 2 ? "#b3a690" : "#6a5646") + '" stroke-width="' + F(d * 2.1 + 1) + '" stroke-linecap="round" fill="none"/>';
    if (lights) tips.slice(0, 40).forEach(function(t){
      h += '<circle class="twinkle" cx="' + F(t[0]) + '" cy="' + F(t[1]) + '" r="3" fill="#ffd27a" style="' + dl() + '"/>';
    });
    return h;
  }

  var S = {};

  /* ---------- Day 1: arrival + nightclub ---------- */
  S.club = function(){
    var h = "<defs>" + grad("c-sky", [[0, "#06011a"], [1, "#2a0c55"]]) +
      '<radialGradient id="c-ball"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#8a8fb8"/></radialGradient>' +
      '<clipPath id="c-bc"><circle cx="850" cy="150" r="56"/></clipPath>' +
      '<pattern id="c-fac" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 0H14M0 0V14" stroke="#4a4f78" stroke-width="1.6"/></pattern></defs>';
    h += '<rect width="1600" height="900" fill="url(#c-sky)"/>' + stars(60, 420);
    // plane crossing the sky (PVG)
    h += '<g class="drift" style="animation-duration:36s"><g transform="translate(0,120)"><path d="M-30 0 L30 0 L22 -6 L-8 -6Z" fill="#e8e6ff"/><path d="M-6 0 L-24 16 L-14 16 L8 0Z M-6 0 L-24 -16 L-14 -16 L8 0Z" fill="#cfcdf5"/>' +
      '<circle class="twinkle" cx="-28" cy="-1" r="2.6" fill="#ff4d4d"/><circle class="twinkle" cx="28" cy="0" r="2.6" fill="#7dff9a" style="animation-delay:-1s"/><path d="M-30 0 H-160" stroke="#fff" stroke-width="2" opacity=".25"/></g></g>';
    // skyline
    var sk = '<g fill="#150836">', wb = [], x = 0;
    while (x < 1600){ var w = RI(40, 90), hh = RI(90, 300); sk += '<rect x="' + x + '" y="' + (640 - hh) + '" width="' + w + '" height="' + hh + '"/>'; wb.push([x, 640 - hh, w, hh]); x += w + RI(4, 14); }
    h += sk + "</g>" + wins(wb, ["#ffd27a", "#ff9ec0", "#8fe3ff"], 900);
    // disco-ball rays
    var rays = "";
    for (var a = 0; a < 14; a++){
      var an = a * Math.PI * 2 / 14, w2 = .05;
      rays += '<polygon points="850,150 ' + F(850 + Math.cos(an - w2) * 900) + "," + F(150 + Math.sin(an - w2) * 900) + " " + F(850 + Math.cos(an + w2) * 900) + "," + F(150 + Math.sin(an + w2) * 900) + '" fill="' + P(["#ff4fd8", "#4fe0ff", "#ffd24f", "#9a6bff"]) + '" opacity=".13"/>';
    }
    h += '<g class="spin" style="transform-origin:850px 150px">' + rays + "</g>";
    // lasers
    [[250, "#ff2fa8"], [560, "#2ff0ff"], [850, "#ffe44f"], [1140, "#2ff0ff"], [1450, "#ff2fa8"]].forEach(function(l, i){
      h += '<g transform="translate(' + l[0] + ',0)"><g class="laser" style="animation-delay:-' + i * 1.3 + 's;animation-duration:' + (5 + i) + 's">' +
        '<polygon points="-2,0 2,0 16,1100 -16,1100" fill="' + l[1] + '" opacity=".4"/><line x1="0" y1="0" x2="0" y2="1100" stroke="' + l[1] + '" stroke-width="1.5" opacity=".9"/></g></g>';
    });
    // disco ball
    h += '<line x1="850" y1="0" x2="850" y2="94" stroke="#8a8fb8" stroke-width="2"/><circle cx="850" cy="150" r="76" fill="#ff4fd8" opacity=".12"/><circle cx="850" cy="150" r="56" fill="url(#c-ball)"/>' +
      '<g clip-path="url(#c-bc)"><rect class="shift" x="770" y="90" width="160" height="120" fill="url(#c-fac)"/>';
    for (var q = 0; q < 14; q++) h += '<rect class="twinkle" x="' + RI(800, 896) + '" y="' + RI(100, 196) + '" width="5" height="5" fill="#fff" style="' + dl() + '"/>';
    h += '</g><circle cx="850" cy="150" r="56" fill="none" stroke="#fff" stroke-opacity=".35"/>';
    // EQ bars
    for (var i = 0; i < 50; i++){
      h += '<rect class="eq" x="' + (i * 32 + 4) + '" y="' + (640 - 150) + '" width="24" height="150" rx="3" fill="hsl(' + (300 - i * 3.4) + ',95%,62%)" opacity=".55" style="animation-duration:' + F(R(.35, .9)) + 's;' + dl(1) + '"/>';
    }
    // neon heart
    h += '<path class="neon" d="M850 330 C 800 280, 760 340, 850 410 C 940 340, 900 280, 850 330Z" fill="none" stroke="#ff4fa8" stroke-width="5" stroke-linejoin="round"/>';
    // DJ
    h += '<g><circle cx="850" cy="520" r="21" fill="#07020f"/><path d="M826 600 Q 828 548 850 546 Q 872 548 874 600Z" fill="#07020f"/>' +
      '<path d="M827 520 Q850 480 873 520" stroke="#2ff0ff" stroke-width="5" fill="none"/><circle cx="827" cy="522" r="6" fill="#2ff0ff"/><circle cx="873" cy="522" r="6" fill="#2ff0ff"/>' +
      '<path class="armwave" d="M868 560 L915 480" stroke="#07020f" stroke-width="12" stroke-linecap="round"/><path d="M832 560 L800 598" stroke="#07020f" stroke-width="12" stroke-linecap="round"/></g>';
    h += '<rect x="720" y="598" width="260" height="92" fill="#120628"/><rect x="720" y="598" width="260" height="92" fill="none" stroke="#ff4fa8" stroke-width="2.5"/>' +
      '<ellipse cx="780" cy="598" rx="38" ry="8" fill="#2a1a5a"/><ellipse cx="920" cy="598" rx="38" ry="8" fill="#2a1a5a"/>' +
      '<ellipse class="spin" cx="780" cy="598" rx="20" ry="4" fill="#ff4fa8" style="transform-box:fill-box;transform-origin:center"/><ellipse class="spin" cx="920" cy="598" rx="20" ry="4" fill="#2ff0ff" style="transform-box:fill-box;transform-origin:center"/>' +
      '<rect class="neon" x="800" y="632" width="100" height="10" rx="5" fill="#2ff0ff"/>';
    // dance floor
    h += '<rect x="0" y="690" width="1600" height="210" fill="#0b0320"/>';
    var rows = 6, cols = ["#ff2fa8", "#2ff0ff", "#ffe44f", "#9a6bff"];
    function yAt(i){ return 690 + 210 * Math.pow(i / rows, 1.5); }
    function wAt(y){ return 46 + (y - 690) * .85; }
    for (var r = 0; r < rows; r++){
      var y0 = yAt(r), y1 = yAt(r + 1), w0 = wAt(y0), w1 = wAt(y1);
      for (var c = -12; c < 12; c++)
        h += '<polygon class="tile" points="' + F(850 + c * w0) + "," + F(y0) + " " + F(850 + (c + 1) * w0) + "," + F(y0) + " " + F(850 + (c + 1) * w1) + "," + F(y1) + " " + F(850 + c * w1) + "," + F(y1) +
          '" fill="' + P(cols) + '" style="animation-delay:-' + F(R(0, 4)) + "s;animation-duration:" + F(R(1.2, 3)) + 's"/>';
    }
    // crowd
    for (var k = 0; k < 24; k++){
      var cx = k * 70 + R(0, 30), cy = 890 + R(-6, 6);
      h += '<g class="hop" style="animation-duration:' + F(R(.45, .7)) + 's;' + dl(1) + '" fill="#06010f"><circle cx="' + F(cx) + '" cy="' + F(cy - 44) + '" r="16"/><ellipse cx="' + F(cx) + '" cy="' + F(cy) + '" rx="26" ry="38"/>' +
        '<path d="M' + F(cx - 14) + " " + F(cy - 24) + " L" + F(cx - 30) + " " + F(cy - 80) + " M" + F(cx + 14) + " " + F(cy - 24) + " L" + F(cx + 30) + " " + F(cy - 84) + '" stroke="#06010f" stroke-width="8" stroke-linecap="round"/></g>';
    }
    return h;
  };

  /* ---------- Day 2: Bund, Garden Bridge, river cruise ---------- */
  S.bund = function(){
    var h = "<defs>" + grad("b-day", [[0, "#3b2a6b"], [.6, "#c4507a"], [1, "#ffa45a"]]) + grad("b-night", [[0, "#04051d"], [.6, "#1b1650"], [1, "#6a2f78"]]) +
      grad("b-water", [[0, "#4a2f7a"], [1, "#0b0826"]]) + '<radialGradient id="b-sun"><stop offset="0" stop-color="#fff0b8"/><stop offset="1" stop-color="#ff9a4a"/></radialGradient>' +
      '<radialGradient id="b-glow"><stop offset="0" stop-color="#ffd0a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffd0a0" stop-opacity="0"/></radialGradient></defs>';
    h += '<rect width="1600" height="900" fill="url(#b-day)"/><rect class="fadein" width="1600" height="900" fill="url(#b-night)"/>';
    h += '<g class="sink"><circle cx="1180" cy="640" r="200" fill="url(#b-glow)"/><circle cx="1180" cy="640" r="60" fill="url(#b-sun)"/></g>';
    h += '<g class="fadein">' + stars(70, 420) + "</g>";
    h += '<g class="drift" opacity=".3" fill="#ffc7d8"><ellipse cx="0" cy="200" rx="140" ry="18"/><ellipse cx="60" cy="186" rx="80" ry="14"/></g>';
    h += pudong(-40, -70, 1, { far: "#4a3a86", near: "#2c2159", main: "#3d2f78", alt: "#33266a", pearl: "#ff7aa8", mast: "#cfc7ee", trim: "#ffd27a", hole: "#150f35", lit: ["#ffd27a", "#ff9ec0", "#8fe3ff"] });
    // light-show beams from the towers
    h += '<g class="fadein"><g transform="translate(410,640)"><polygon class="beam" points="-6,0 6,0 60,-560 -60,-560" fill="#ff9ee0" opacity=".3"/></g><g transform="translate(900,640)"><polygon class="beam" style="animation-delay:-3s" points="-6,0 6,0 60,-600 -60,-600" fill="#9ae6ff" opacity=".3"/></g></g>';
    // river
    h += '<rect x="0" y="700" width="1600" height="200" fill="url(#b-water)"/>';
    for (var i = 0; i < 40; i++)
      h += '<rect class="shimmer" x="' + RI(0, 1560) + '" y="' + RI(710, 880) + '" width="' + RI(20, 90) + '" height="3" rx="1.5" fill="' + P(["#ffd27a", "#ff7aa8", "#9ad7ff"]) + '" style="' + dl() + '"/>';
    // cruise boat
    h += '<g class="boat" style="animation-duration:60s;animation-delay:-20s"><g transform="translate(0,742) scale(1.5)"><path d="M0 0 L150 0 L132 16 L16 16Z" fill="#120a30"/><rect x="24" y="-22" width="102" height="22" fill="#2c2159"/>' +
      '<g fill="#ffd27a"><rect class="twinkle" x="32" y="-16" width="9" height="8"/><rect class="twinkle" style="animation-delay:-1s" x="50" y="-16" width="9" height="8"/><rect class="twinkle" style="animation-delay:-2s" x="68" y="-16" width="9" height="8"/><rect class="twinkle" x="86" y="-16" width="9" height="8"/><rect class="twinkle" style="animation-delay:-1.5s" x="104" y="-16" width="9" height="8"/></g>' +
      '<path d="M24 -22 H126" stroke="#ff4fa8" stroke-width="2"/><path d="M20 4 H136" stroke="#2ff0ff" stroke-width="2" opacity=".8"/></g></g>';
    // Waibaidu (Garden) bridge truss in the foreground
    h += '<path d="' + truss(-40, 820, 808, 190, 14) + truss(780, 1640, 808, 190, 14) + '" stroke="#0a0620" stroke-width="5" fill="none" stroke-linejoin="round"/>';
    h += '<rect x="0" y="806" width="1600" height="14" fill="#0a0620"/><rect x="0" y="820" width="1600" height="80" fill="#07041a"/>';
    for (i = 0; i < 12; i++) h += '<circle class="twinkle" cx="' + (i * 140 + 40) + '" cy="800" r="5" fill="#ffd27a" style="' + dl() + '"/>';
    h += couple(1350, 806, 1.1, "#05030f");
    return h;
  };

  /* ---------- Day 3: French Concession, Tianzifang, Xintiandi ---------- */
  S.french = function(){
    var h = "<defs>" + grad("f-day", [[0, "#f3c08a"], [.6, "#ffe0b0"], [1, "#fff0d4"]]) + grad("f-night", [[0, "#2a1a4a"], [.6, "#b0457f"], [1, "#f08a5d"]]) +
      grad("f-l", [[0, "#c46f52"], [1, "#a05540"]]) + grad("f-r", [[0, "#8f4a3a"], [1, "#6d372c"]]) + "</defs>";
    h += '<rect width="1600" height="900" fill="url(#f-day)"/><rect class="fadein" width="1600" height="900" fill="url(#f-night)"/>';
    h += '<g class="fadein">' + stars(40, 300) + "</g>";
    // sun
    h += '<circle class="glow" cx="1250" cy="200" r="110" fill="#fff3c0" opacity=".6"/>';
    // distant roofs
    h += '<g fill="#d9a888" opacity=".6"><rect x="120" y="560" width="160" height="230"/><rect x="1100" y="520" width="200" height="270"/><rect x="1330" y="580" width="150" height="210"/><rect x="420" y="600" width="120" height="190"/></g>';
    // Wukang Mansion (flatiron)
    var fw = function(m, cx){ // window grid in a skewed face
      var g = '<g transform="matrix(' + m + ')">';
      for (var r = 0; r < 14; r++) for (var c = 0; c < 6; c++){
        var wx = 14 + c * 21, wy = 30 + r * 31;
        g += '<rect x="' + wx + '" y="' + wy + '" width="12" height="19" rx="6" fill="#4a3a50"/><rect class="fadein" x="' + wx + '" y="' + wy + '" width="12" height="19" rx="6" fill="#ffd27a"/>';
      }
      return g + "</g>";
    };
    h += '<polygon points="850,262 990,302 990,790 850,790" fill="url(#f-r)"/><polygon points="710,302 850,262 850,790 710,790" fill="url(#f-l)"/>';
    h += fw("1,-.2857,0,1,710,302") + fw("1,.2857,0,1,850,262");
    h += '<path d="M706 304 Q850 250 994 304 L994 292 Q850 236 706 292Z" fill="#5a2e26"/>' +
      '<path d="M830 790 v-52 a20 20 0 0 1 40 0 v52z" fill="#2a1612"/><path d="M838 790 v-48 a12 12 0 0 1 24 0 v48z" class="fadein" fill="#ffd27a"/>';
    for (var b = 0; b < 4; b++) h += '<path d="M710 ' + (402 + b * 96) + ' H850 M850 ' + (362 + b * 96) + ' H990" stroke="#3a1e18" stroke-width="3" opacity=".6"/>';
    // bare plane trees with fairy lights
    h += bareTree(250, 800, 120, 6, true) + bareTree(1380, 800, 130, 6, true) + bareTree(560, 800, 90, 5, true) + bareTree(1130, 800, 95, 5, true);
    // Tianzifang lantern strings
    h += '<path d="M0 250 Q400 340 800 260 T1600 250" stroke="#5a3a30" stroke-width="2" fill="none"/>';
    for (var i = 0; i < 18; i++){
      var lx = 40 + i * 90, ly = 270 + Math.sin(i * .9) * 28 + (i % 3) * 8;
      h += '<g class="swing" style="' + dl(3) + '"><line x1="' + lx + '" y1="' + (ly - 18) + '" x2="' + lx + '" y2="' + ly + '" stroke="#5a3a30"/><ellipse cx="' + lx + '" cy="' + (ly + 16) + '" rx="12" ry="16" fill="#e0412e"/>' +
        '<ellipse class="fadein-soft" cx="' + lx + '" cy="' + (ly + 16) + '" rx="22" ry="26" fill="#ffd27a" opacity=".25"/><rect x="' + (lx - 6) + '" y="' + (ly + 30) + '" width="12" height="4" fill="#ffd27a"/></g>';
    }
    // street + Xintiandi rooftop bulbs
    h += '<rect x="0" y="790" width="1600" height="110" fill="#6d4a40"/><rect x="0" y="790" width="1600" height="8" fill="#8a6050"/>';
    h += '<path d="M0 700 Q200 770 400 700 T800 700 T1200 700 T1600 700" stroke="#3a2420" stroke-width="2" fill="none"/>';
    for (i = 0; i < 24; i++){
      var bx = i * 68 + 10, by = 700 + Math.sin(i * Math.PI / 3) * 0 + (i % 6 < 3 ? 38 * Math.sin((i % 6) / 3 * Math.PI) : 38 * Math.sin(((i % 6) - 3) / 3 * Math.PI));
      h += '<circle class="bulb" cx="' + bx + '" cy="' + F(by + 12) + '" r="6" fill="#ffe08a" style="' + dl() + '"/>';
    }
    h += couple(1030, 884, 1.25, "#2a1612");
    return h;
  };

  /* ---------- Day 4: Shanghai Disneyland ---------- */
  S.disney = function(){
    function tower(x, w, top, base, cone, roof, body){
      var t = '<rect x="' + (x - w / 2) + '" y="' + top + '" width="' + w + '" height="' + (base - top) + '" fill="' + body + '"/>' +
        '<rect x="' + x + '" y="' + top + '" width="' + (w / 2) + '" height="' + (base - top) + '" fill="#2a1a5a" opacity=".16"/>' +
        '<polygon points="' + (x - w / 2 - 8) + "," + top + " " + (x + w / 2 + 8) + "," + top + " " + x + "," + (top - cone) + '" fill="' + roof + '"/>' +
        '<polygon points="' + x + "," + (top - cone) + " " + (x + w / 2 + 8) + "," + top + " " + (x + 3) + "," + top + '" fill="#2a1a5a" opacity=".2"/>' +
        '<circle cx="' + x + '" cy="' + (top - cone) + '" r="5" fill="#ffd27a"/>';
      for (var y = top + 36; y < base - 40; y += 56)
        t += '<path class="twinkle" d="M' + (x - 6) + " " + (y + 18) + " v-12 a6 6 0 0 1 12 0 v12z" + '" fill="#ffe08a" style="' + dl() + '"/>';
      return t;
    }
    var h = "<defs>" + grad("d-sky", [[0, "#150b45"], [.55, "#5a2a8a"], [.85, "#d8689c"], [1, "#ffb080"]]) + grad("d-lake", [[0, "#3a2a8a"], [1, "#120a40"]]) +
      '<clipPath id="d-clip"><rect x="0" y="690" width="1600" height="210"/></clipPath><radialGradient id="d-gate"><stop offset="0" stop-color="#fff0b0"/><stop offset="1" stop-color="#ffb84a"/></radialGradient></defs>';
    h += '<rect width="1600" height="900" fill="url(#d-sky)"/>' + stars(110, 470);
    h += '<g class="drift" opacity=".3" fill="#ffc7e8" style="animation-duration:80s"><ellipse cx="0" cy="300" rx="150" ry="18"/><ellipse cx="60" cy="286" rx="80" ry="14"/></g>';
    h += '<g id="d-castle">';
    h += tower(850, 112, 290, 690, 170, "#4a7ad8", "#d6c4f0") + tower(740, 64, 420, 690, 110, "#e86aa0", "#cdb8ec") + tower(960, 64, 420, 690, 110, "#e86aa0", "#cdb8ec");
    h += tower(700, 58, 470, 690, 96, "#3cc0c8", "#d6c4f0") + tower(1000, 58, 470, 690, 96, "#3cc0c8", "#d6c4f0");
    var bt = "M590 690 V570";
    for (var x = 590; x < 1110; x += 26) bt += " h13 v-16 h13 v16";
    h += '<path d="' + bt + ' V690Z" fill="#cdb8ec"/><rect x="590" y="580" width="520" height="110" fill="#d3c0ee"/>';
    h += tower(620, 54, 520, 690, 80, "#e86aa0", "#d6c4f0") + tower(1080, 54, 520, 690, 80, "#e86aa0", "#d6c4f0");
    h += '<path d="M810 690 v-96 a40 40 0 0 1 80 0 v96z" fill="url(#d-gate)"/><path d="M820 690 v-90 a30 30 0 0 1 60 0 v90z" fill="#fff4c8" class="glow"/>';
    h += '<line x1="850" y1="120" x2="850" y2="60" stroke="#ffd27a" stroke-width="3"/><g class="wave"><polygon points="850,60 900,74 850,88" fill="#ff6b81"/></g>';
    h += "</g>";
    // lake + reflection
    h += '<rect x="0" y="690" width="1600" height="210" fill="url(#d-lake)"/><g clip-path="url(#d-clip)"><use href="#d-castle" transform="translate(0,1380) scale(1,-1)" opacity=".22"/></g>';
    for (var i = 0; i < 30; i++)
      h += '<rect class="shimmer" x="' + RI(0, 1560) + '" y="' + RI(700, 880) + '" width="' + RI(20, 90) + '" height="3" rx="1.5" fill="' + P(["#ffd27a", "#ff7aa8", "#9ad7ff"]) + '" style="' + dl() + '"/>';
    // floating ear balloons
    for (i = 0; i < 6; i++){
      var bx = 200 + i * 230 + R(-40, 40), col = P(["#ff4d6a", "#ffd24f", "#4fb4ff", "#ff8ae0"]);
      h += '<g class="rise" style="animation-delay:-' + F(i * 3.2) + 's;animation-duration:' + F(R(16, 24)) + 's"><g transform="translate(' + F(bx) + ',860)"><circle r="22" fill="' + col + '"/><circle cx="-18" cy="-20" r="12" fill="' + col + '"/><circle cx="18" cy="-20" r="12" fill="' + col + '"/>' +
        '<path d="M0 22 q-8 40 6 80" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/></g></g>';
    }
    // wishing-star sprite flying around the castle
    h += '<path id="d-fly" d="M300 520 C 500 200, 700 100, 850 220 S 1200 400, 1400 150" fill="none"/>';
    for (i = 0; i < 6; i++)
      h += '<circle r="' + (7 - i) + '" fill="#fff6c0" opacity="' + (1 - i * .15) + '"><animateMotion dur="9s" begin="-' + (i * .12) + 's" repeatCount="indefinite"><mpath href="#d-fly"/></animateMotion></circle>';
    h += couple(1250, 892, 1.2, "#0b0526");
    return h;
  };

  /* ---------- Day 5: Yu Garden, ferry, Shanghai Tower at sunset ---------- */
  S.dusk = function(){
    var h = "<defs>" + grad("u-sky", [[0, "#2a1a5a"], [.5, "#b8487e"], [.85, "#ff9a5a"], [1, "#ffd08a"]]) + grad("u-water", [[0, "#8a4a7a"], [1, "#1a1240"]]) +
      '<radialGradient id="u-sun"><stop offset="0" stop-color="#fff4c8"/><stop offset="1" stop-color="#ff9a4a"/></radialGradient><radialGradient id="u-glow"><stop offset="0" stop-color="#ffd09a" stop-opacity=".85"/><stop offset="1" stop-color="#ffd09a" stop-opacity="0"/></radialGradient></defs>';
    h += '<rect width="1600" height="900" fill="url(#u-sky)"/>' + stars(40, 220);
    h += '<g class="sink"><circle cx="1000" cy="620" r="260" fill="url(#u-glow)"/><circle cx="1000" cy="620" r="72" fill="url(#u-sun)"/></g>';
    h += '<g class="drift" opacity=".35" fill="#ffd9c0" style="animation-duration:70s"><ellipse cx="0" cy="260" rx="160" ry="18"/><ellipse cx="60" cy="246" rx="90" ry="14"/></g>';
    h += pudong(330, -58, 1, { far: "#6a3a7a", near: "#4a2a6a", main: "#3a2468", alt: "#40286e", pearl: "#ff7aa8", mast: "#ffe3c0", trim: "#ffd27a", hole: "#1a1038", lit: ["#ffd27a", "#ffb0c8"] });
    // 118F observation deck pulse
    h += '<circle class="ping" cx="850" cy="153" r="16" fill="none" stroke="#ffd27a" stroke-width="3"/><circle cx="850" cy="153" r="6" fill="#ffd27a"/>';
    // river
    h += '<rect x="0" y="712" width="1600" height="188" fill="url(#u-water)"/><path d="M940 712 H1060 L1120 900 H880Z" fill="#ffc88a" opacity=".25"/>';
    for (var i = 0; i < 40; i++)
      h += '<rect class="shimmer" x="' + RI(0, 1560) + '" y="' + RI(720, 890) + '" width="' + RI(20, 90) + '" height="3" rx="1.5" fill="' + P(["#ffd27a", "#ffb0c8", "#ffe3c0"]) + '" style="' + dl() + '"/>';
    // ferry
    h += '<g class="boat" style="animation-duration:70s"><g transform="translate(0,780) scale(1.4)"><path d="M0 0 L130 0 L114 15 L16 15Z" fill="#160d38"/><rect x="22" y="-18" width="86" height="18" fill="#2a1a5a"/><g fill="#ffd27a"><rect x="30" y="-12" width="9" height="7"/><rect x="48" y="-12" width="9" height="7"/><rect x="66" y="-12" width="9" height="7"/><rect x="84" y="-12" width="9" height="7"/></g><rect x="56" y="-30" width="18" height="12" fill="#2a1a5a"/></g></g>';
    // Yu Garden pavilion (left foreground)
    h += '<g transform="translate(507,375) scale(.55)"><g fill="#1a0f3a"><path d="M60 700 H520 V900 H60Z"/>' +
      '<path d="M120 560 H460 V700 H120Z"/>' +
      '<path d="M70 560 Q130 560 150 520 L430 520 Q450 560 510 560 Q470 575 440 580 H140 Q110 575 70 560Z"/>' +
      '<path d="M130 520 Q150 480 190 470 L400 470 Q440 480 450 520Z"/><path d="M110 470 Q140 470 160 440 L420 440 Q440 470 470 470 Q440 480 420 480 H160 Q140 480 110 470Z"/>' +
      '<circle cx="290" cy="436" r="8"/><rect x="287" y="410" width="6" height="26"/></g>';
    h += '<g fill="#ffd27a" opacity=".85"><rect class="twinkle" x="170" y="600" width="26" height="60"/><rect class="twinkle" style="animation-delay:-1s" x="260" y="600" width="26" height="60"/><rect class="twinkle" style="animation-delay:-2s" x="350" y="600" width="26" height="60"/></g>';
    h += '<path d="M0 720 Q60 700 120 720 T240 720 T360 720 T480 720 T600 720" fill="none" stroke="#2a1a5a" stroke-width="10"/></g>';
    // Lujiazui promenade
    h += '<rect x="0" y="858" width="1600" height="42" fill="#0e0828"/><path d="M0 858 H1600" stroke="#2a1a5a" stroke-width="3"/>';
    for (i = 0; i < 40; i++) h += '<line x1="' + (i * 42) + '" y1="858" x2="' + (i * 42) + '" y2="838" stroke="#2a1a5a" stroke-width="3"/>';
    h += '<line x1="0" y1="838" x2="1600" y2="838" stroke="#2a1a5a" stroke-width="3"/>' + couple(1280, 858, 1.3, "#0a0520");
    return h;
  };

  /* ---------- Day 6: Suzhou garden ---------- */
  S.suzhou = function(){
    var h = "<defs>" + grad("z-sky", [[0, "#cfe0d8"], [1, "#f2efe4"]]) + grad("z-water", [[0, "#9ebcb0"], [1, "#5f857b"]]) +
      grad("z-view", [[0, "#dfeee6"], [1, "#a9c9b8"]]) + '<clipPath id="z-hole"><circle cx="850" cy="440" r="160"/></clipPath></defs>';
    h += '<rect width="1600" height="900" fill="url(#z-sky)"/>';
    // misty ink hills
    h += '<path d="M0 520 Q150 380 300 470 T600 430 T900 480 T1200 400 T1600 470 V700 H0Z" fill="#a9c2b6" opacity=".6"/><path d="M0 580 Q200 480 400 550 T800 520 T1200 540 T1600 500 V700 H0Z" fill="#8fb0a2" opacity=".6"/>';
    // moon-gate wall; scene seen through it
    h += '<g clip-path="url(#z-hole)"><rect x="680" y="280" width="340" height="320" fill="url(#z-view)"/>' +
      '<path d="M690 560 Q760 480 840 540 T1010 520 V600 H690Z" fill="#7fa593"/>' +
      '<g fill="#3a4a46"><path d="M880 520 H960 V455 H880Z"/><path d="M866 455 Q875 445 890 432 H950 Q965 445 974 455Z"/><path d="M880 432 Q890 418 900 408 H940 Q950 418 960 432Z"/></g>' +
      '<g stroke="#4a3a2a" stroke-width="3" fill="none"><path d="M760 560 q-6 -90 8 -150 M768 440 q-40 -10 -60 -30 M768 480 q36 -14 50 -40"/></g>' +
      '<g fill="#4f7a58"><ellipse cx="706" cy="410" rx="34" ry="14"/><ellipse cx="820" cy="436" rx="34" ry="12"/></g>' +
      '<path d="M900 575 q40 -70 20 -110 q40 40 30 110z" fill="#8a8f90"/></g>';
    h += '<path fill-rule="evenodd" fill="#f4f0e4" d="M560 250 H1140 V700 H560Z M850 280 a160 160 0 1 0 .01 0Z"/>';
    h += '<circle cx="850" cy="440" r="160" fill="none" stroke="#4a525a" stroke-width="10"/>';
    h += '<path d="M540 250 H1160 L1180 270 H520Z" fill="#3d444c"/><path d="M520 270 H1180 V282 H520Z" fill="#59616a"/>';
    h += '<g fill="#e8e2d0"><path d="M560 700 H1140 V712 H560Z"/></g>';
    h += '<path d="M520 270 L470 250 Q500 262 520 262Z M1180 270 L1230 250 Q1200 262 1180 262Z" fill="#3d444c"/>';
    // distant white houses with tiled roofs
    h += '<g><rect x="1210" y="470" width="230" height="230" fill="#f1ede1"/><path d="M1190 470 H1460 L1420 436 H1230Z" fill="#454c54"/><rect x="1250" y="540" width="40" height="60" fill="#454c54" opacity=".7"/><rect x="1340" y="540" width="40" height="60" fill="#454c54" opacity=".7"/></g>';
    h += '<g><rect x="260" y="500" width="240" height="200" fill="#f1ede1"/><path d="M240 500 H520 L480 468 H280Z" fill="#454c54"/></g>';
    // canal + pond
    h += '<rect x="0" y="700" width="1600" height="200" fill="url(#z-water)"/>';
    h += '<path d="M480 700 H1140 V712 H480Z" fill="#f4f0e4" opacity=".35"/>';
    // stone arch bridge
    h += '<g><path d="M1160 760 Q1360 640 1560 760 V780 H1160Z" fill="#8f9a96"/><path d="M1210 780 Q1360 690 1510 780Z" fill="#4f6f68"/><path d="M1160 760 Q1360 640 1560 760" stroke="#6f7a76" stroke-width="8" fill="none"/>' +
      '<path d="M1160 756 Q1360 636 1560 756 V748 Q1360 628 1160 748Z" fill="#b8c2be"/></g>';
    for (var i = 0; i < 8; i++)
      h += '<ellipse cx="' + RI(120, 1500) + '" cy="' + RI(740, 880) + '" rx="' + RI(26, 52) + '" ry="' + RI(8, 14) + '" fill="#5e9a70" opacity=".8"/>';
    for (i = 0; i < 5; i++)
      h += '<ellipse class="ripple" cx="' + RI(300, 1400) + '" cy="' + RI(770, 880) + '" rx="30" ry="8" fill="none" stroke="#e8f4ee" stroke-width="2" style="' + dl(4) + '"/>';
    // koi
    h += '<path id="z-koi" d="M300 820 C 500 780, 700 860, 900 820 S 1200 780, 1300 840 S 900 880, 300 820" fill="none"/>' +
      '<g><ellipse rx="18" ry="7" fill="#ff7a3a"/><ellipse cx="-22" rx="9" ry="5" fill="#ff7a3a" opacity=".8"/><animateMotion dur="26s" repeatCount="indefinite" rotate="auto"><mpath href="#z-koi"/></animateMotion></g>' +
      '<g><ellipse rx="16" ry="6" fill="#fff4e8"/><ellipse cx="-20" rx="8" ry="4.5" fill="#fff4e8" opacity=".8"/><circle cx="6" cy="-1" r="4" fill="#e0412e"/><animateMotion dur="32s" begin="-10s" repeatCount="indefinite" rotate="auto"><mpath href="#z-koi"/></animateMotion></g>';
    // willow
    h += '<g transform="translate(1100,0)"><path d="M180 800 Q170 600 210 470" stroke="#4a3a2a" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M200 520 Q260 430 360 420" stroke="#4a3a2a" stroke-width="10" fill="none"/><path d="M205 500 Q140 420 70 430" stroke="#4a3a2a" stroke-width="9" fill="none"/>';
    for (i = 0; i < 46; i++){
      var sx = i < 24 ? 80 + i * 12 : 230 + (i - 24) * 6, sy = i < 24 ? 430 + Math.sin(i / 24 * Math.PI) * -26 + 20 : 440 - (i - 24) * 1.8, ln = R(140, 320);
      h += '<path class="sway2" d="M' + F(sx) + " " + F(sy) + " q" + F(R(-14, 14)) + " " + F(ln / 2) + " " + F(R(-8, 8)) + " " + F(ln) + '" stroke="' + P(["#7aa36a", "#8fb57a", "#6a9460"]) + '" stroke-width="2.4" fill="none" style="' + dl(4) + '"/>';
    }
    h += '</g>';
    // mist
    h += '<ellipse class="drift" cx="0" cy="620" rx="260" ry="26" fill="#fff" opacity=".28" style="animation-duration:70s"/><ellipse class="drift" cx="0" cy="730" rx="320" ry="30" fill="#fff" opacity=".22" style="animation-duration:100s;animation-delay:-40s"/>';
    h += couple(1010, 706, .95, "#2f3a3a");
    return h;
  };

  /* ---------- Day 7: Jing'an Temple, 1000 Trees, flight to Hong Kong ---------- */
  S.jingan = function(){
    var h = "<defs>" + grad("j-sky", [[0, "#9fb0dc"], [.55, "#ffc79a"], [1, "#ffe6b8"]]) + grad("j-glass", [[0, "#8aa0c8"], [1, "#d8b0b0"]]) + grad("j-gold", [[0, "#ffe08a"], [1, "#d8962a"]]) + grad("j-water", [[0, "#b8a0a8"], [1, "#4a4468"]]) +
      '<radialGradient id="j-sun"><stop offset="0" stop-color="#fffbe0"/><stop offset="1" stop-color="#ffd28a"/></radialGradient></defs>';
    h += '<rect width="1600" height="900" fill="url(#j-sky)"/>';
    h += '<g class="rise2"><circle cx="1120" cy="400" r="150" fill="#fff0c8" opacity=".35"/><circle cx="1120" cy="400" r="54" fill="url(#j-sun)"/></g>';
    h += '<g class="drift" opacity=".5" fill="#fff" style="animation-duration:90s"><ellipse cx="0" cy="170" rx="150" ry="16"/><ellipse cx="50" cy="156" rx="80" ry="13"/></g>';
    // flight to Hong Kong
    h += '<path id="j-route" d="M-100 420 Q500 380 900 260 T1750 40" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 10" opacity=".5"/>';
    h += '<g><path d="M-26 0 L26 0 L19 -5 L-7 -5Z" fill="#fff"/><path d="M-5 0 L-21 14 L-12 14 L7 0Z M-5 0 L-21 -14 L-12 -14 L7 0Z" fill="#eef"/><animateMotion dur="16s" repeatCount="indefinite" rotate="auto"><mpath href="#j-route"/></animateMotion></g>';
    h += '<text x="1400" y="90" fill="#fff" opacity=".7" font-family="Georgia,serif" font-style="italic" font-size="28">→ Hong Kong</text>';
    // glass towers of Jing'an
    var tw = [[330, 360, 110, 340], [450, 300, 90, 400], [590, 400, 100, 300], [1010, 330, 110, 370], [1130, 260, 120, 440], [1260, 370, 100, 330]];
    tw.forEach(function(t){
      h += '<rect x="' + t[0] + '" y="' + t[1] + '" width="' + t[2] + '" height="' + t[3] + '" fill="url(#j-glass)" opacity=".85"/>';
      for (var y = t[1] + 12; y < t[1] + t[3]; y += 22) h += '<line x1="' + t[0] + '" y1="' + y + '" x2="' + (t[0] + t[2]) + '" y2="' + y + '" stroke="#fff" stroke-width="1" opacity=".25"/>';
    });
    // 1000 Trees terraces
    h += '<g>';
    for (var r = 0; r < 6; r++){
      var tx = 1290 + r * 14, ty = 560 + r * 26, tw2 = 260 - r * 28;
      h += '<rect x="' + tx + '" y="' + ty + '" width="' + tw2 + '" height="26" fill="#b8b2a8"/>';
      for (var k = 0; k < tw2 / 16; k++) h += '<circle cx="' + (tx + 8 + k * 16) + '" cy="' + (ty - 4) + '" r="' + F(R(7, 11)) + '" fill="' + P(["#4f8a58", "#6aa56a", "#3f7a4e"]) + '"/>';
    }
    h += "</g>";
    // Jing'an Temple
    h += '<rect x="620" y="690" width="460" height="40" fill="#cfc7bd"/><rect x="650" y="660" width="400" height="34" fill="#dcd4c8"/>';
    h += '<rect x="700" y="540" width="300" height="130" fill="#b3261e"/>';
    for (var c = 0; c < 6; c++) h += '<rect x="' + (710 + c * 55) + '" y="540" width="14" height="130" fill="#8a1a14"/>';
    h += '<rect x="780" y="570" width="140" height="100" fill="#3a0e0a"/><rect class="glow" x="800" y="590" width="100" height="80" fill="#ffb84a" opacity=".8"/>';
    h += '<path d="M610 540 Q700 548 720 500 L980 500 Q1000 548 1090 540 Q1010 580 850 580 Q690 580 610 540Z" fill="url(#j-gold)"/>';
    h += '<path d="M690 500 Q740 490 750 450 L950 450 Q960 490 1010 500Z" fill="url(#j-gold)"/>';
    h += '<path d="M640 456 Q760 460 780 400 L920 400 Q940 460 1060 456 Q960 490 850 490 Q740 490 640 456Z" fill="url(#j-gold)"/>';
    h += '<path d="M610 540 q-24 -4 -34 -26 M1090 540 q24 -4 34 -26 M640 456 q-22 -4 -30 -24 M1060 456 q22 -4 30 -24" stroke="#d8962a" stroke-width="7" fill="none" stroke-linecap="round"/>';
    h += '<path d="M780 400 Q850 380 920 400Z" fill="#ffe08a"/><rect x="846" y="330" width="8" height="70" fill="#ffd27a"/><circle cx="850" cy="322" r="10" fill="#ffe08a"/><path d="M850 312 V280" stroke="#ffd27a" stroke-width="4"/>';
    h += '<g stroke="#8a5a14" stroke-width="2" opacity=".6"><path d="M690 520 H1010 M740 470 H960"/></g>';
    // incense smoke + lanterns
    for (i = 0; i < 3; i++) h += '<path class="smoke" d="M' + (790 + i * 60) + ' 690 q10 -30 0 -60 q-10 -30 0 -60" stroke="#fff" stroke-width="3" fill="none" opacity=".35" style="' + dl(5) + '"/>';
    for (var i = 0; i < 2; i++){ var lx = 610 + i * 480; h += '<g class="swing"><line x1="' + lx + '" y1="560" x2="' + lx + '" y2="590" stroke="#8a1a14"/><ellipse cx="' + lx + '" cy="610" rx="14" ry="19" fill="#e0412e"/></g>'; }
    // Suzhou creek walk
    h += '<rect x="0" y="730" width="1600" height="170" fill="url(#j-water)"/>';
    for (i = 0; i < 28; i++) h += '<rect class="shimmer" x="' + RI(0, 1560) + '" y="' + RI(745, 885) + '" width="' + RI(20, 80) + '" height="3" rx="1.5" fill="#fff0d0" style="' + dl() + '"/>';
    h += '<rect x="0" y="720" width="1600" height="14" fill="#7a6a62"/>' + couple(1060, 722, 1.3, "#2a2036");
    return h;
  };

  return S;
})();
