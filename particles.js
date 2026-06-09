/* ============================================================
   Full-screen animated particle background.
   150–200 small black particles (1–3px), low opacity, drifting
   slowly in random directions and wrapping at screen edges.
   Fixed canvas behind all content, pointer-events disabled.
   ============================================================ */
(function () {
  var canvas = document.createElement('canvas');
  canvas.id = 'particle-bg';
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:-1;';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0, height = 0;
  var particles = [];

  var COUNT = 175;            // within the 150–200 range
  function rand(min, max) { return min + Math.random() * (max - min); }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: rand(1, 3),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      alpha: rand(0.1, 0.3)
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    particles = [];
    for (var i = 0; i < COUNT; i++) particles.push(makeParticle());
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap at screen boundaries.
      if (p.x < -p.r) p.x = width + p.r;
      else if (p.x > width + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = height + p.r;
      else if (p.y > height + p.r) p.y = -p.r;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,' + p.alpha + ')';
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize, { passive: true });

  resize();
  init();
  requestAnimationFrame(step);
})();
