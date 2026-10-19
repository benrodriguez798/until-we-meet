// Tiny generative soundscapes (Web Audio, no files). One per scene theme.
window.DaySound = (function(){
  var ctx, master, noiseBuf, timer, theme, step, nextT, bpm, running = false;
  var HZ = function(m){ return 440 * Math.pow(2, (m - 69) / 12); };
  var pick = function(a){ return a[Math.floor(Math.random() * a.length)]; };

  function init(){
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 9000;
    master.connect(lp); lp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function tone(f, t, dur, type, vol, attack){
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    attack = attack || .01;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + .05);
  }
  function kick(t){
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .14);
    g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .28);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + .3);
  }
  function noise(t, dur, vol, hp, type){
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true;
    f.type = type || "highpass"; f.frequency.value = hp;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + .05);
  }
  function bell(f, t, vol){
    [1, 2.76, 5.4].forEach(function(m, i){ tone(f * m, t, 2.4 / (i + 1), "sine", vol / (i + 1.5), .004); });
  }

  // 16th-note step patterns per theme
  var PENTA = [62, 64, 66, 69, 71, 74, 76, 78];
  var themes = {
    club: { bpm: 124, play: function(s, t, spb){
      var b = s % 16;
      if (b % 4 === 0) kick(t);
      if (b % 4 === 2) noise(t, .06, .16, 7000);
      if (b === 4 || b === 12) noise(t, .12, .2, 2200, "bandpass");
      var bass = [45, 0, 45, 45, 0, 48, 0, 45, 0, 45, 43, 0, 45, 0, 50, 48][b];
      if (bass) tone(HZ(bass), t, spb * 1.6, "sawtooth", .13, .005);
      if (b % 2 === 0 && (s >> 4) % 2) tone(HZ(pick([69, 72, 76, 79])), t, spb * 1.2, "square", .035);
    }},
    disney: { bpm: 92, play: function(s, t, spb){
      var chords = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]];
      var c = chords[(s >> 4) % 4], b = s % 16;
      if (b % 2 === 0) tone(HZ(c[(b / 2) % 4] + 12), t, spb * 3, "triangle", .12, .004);
      if (b === 0) tone(HZ(c[0] - 12), t, spb * 8, "sine", .12, .05);
      if (Math.random() < .12) bell(HZ(pick([84, 88, 91, 96])), t, .03);
    }},
    bund: { bpm: 72, play: function(s, t, spb){
      var b = s % 32;
      if (b === 0) { tone(HZ(38), t, spb * 14, "sine", .14, .6); tone(HZ(45), t, spb * 14, "sine", .08, .8); }
      if (b % 4 === 0 && Math.random() < .7) tone(HZ(pick(PENTA)), t, spb * 5, "triangle", .1, .004);
      if (b % 8 === 4) noise(t, .08, .05, 6000);
    }},
    french: { bpm: 84, play: function(s, t, spb){
      var ch = [[50, 54, 57, 61], [55, 59, 62, 66], [52, 56, 59, 63], [57, 61, 64, 68]];
      var c = ch[(s >> 4) % 4], b = s % 16, sw = (b % 2) ? spb * .3 : 0;
      if (b === 0 || b === 6 || b === 10) c.forEach(function(n){ tone(HZ(n + 12), t + sw, spb * 4, "triangle", .05, .01); });
      if (b % 4 === 0) tone(HZ(c[0] - 12), t, spb * 3, "sine", .14, .01);
      if (b % 2 === 0) noise(t + sw, .05, .05, 8000);
      if (b % 4 === 2 && Math.random() < .5) tone(HZ(pick(c) + 24), t, spb * 2, "sine", .05);
    }},
    dusk: { bpm: 66, play: function(s, t, spb){
      var ch = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]];
      var c = ch[(s >> 5) % 4], b = s % 32;
      if (b === 0) c.forEach(function(n){ tone(HZ(n), t, spb * 30, "sine", .08, 1.2); });
      if (b % 8 === 0) tone(HZ(c[(b / 8) % 3] + 24), t, spb * 6, "triangle", .06, .01);
      if (b === 16 && Math.random() < .6) bell(HZ(81), t, .03);
    }},
    suzhou: { bpm: 60, play: function(s, t, spb){
      var b = s % 16;
      if (b === 0) noise(t, spb * 14, .03, 900, "bandpass");
      var run = (s >> 4) % 2 === 0;
      if ((run && b % 2 === 0 && Math.random() < .8) || (!run && b % 4 === 0))
        tone(HZ(pick(PENTA) + (run ? 0 : -12)), t, spb * 4, "triangle", .1, .002);
      if (b === 8 && Math.random() < .4) tone(HZ(40), t, spb * 12, "sine", .1, .4);
    }},
    jingan: { bpm: 56, play: function(s, t, spb){
      var b = s % 32;
      if (b === 0) { bell(HZ(50), t, .12); tone(HZ(38), t, spb * 28, "sine", .09, 1); }
      if (b === 16) bell(HZ(57), t, .09);
      if (b % 8 === 4 && Math.random() < .6) tone(HZ(pick(PENTA) + 12), t, spb * 6, "sine", .05, .01);
    }}
  };

  function sched(){
    var cfg = themes[theme], spb = 60 / bpm / 4;
    while (nextT < ctx.currentTime + .2){
      cfg.play(step, nextT, spb);
      nextT += spb; step++;
    }
  }
  function stop(){
    if (!running) return;
    running = false; clearInterval(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, .15);
  }
  function start(name){
    init(); if (!ctx || !themes[name]) return;
    if (ctx.state === "suspended") ctx.resume();
    clearInterval(timer);
    theme = name; bpm = themes[name].bpm; step = 0; nextT = ctx.currentTime + .1; running = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(.55, ctx.currentTime, .4);
    timer = setInterval(sched, 25);
  }
  return { start: start, stop: stop, isRunning: function(){ return running; } };
})();
