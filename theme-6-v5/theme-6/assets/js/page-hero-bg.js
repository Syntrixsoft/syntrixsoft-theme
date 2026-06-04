/* ==========================================================
   Page Hero — animated particle-network background
   Auto-attaches to every .page-hero on the page
   ========================================================== */
(function () {
  "use strict";

  const COLORS = {
    node:   "rgba(168,85,247,",    // purple
    nodeSec:"rgba(34,211,238,",    // cyan
    line:   "rgba(168,85,247,",
    lineSec:"rgba(34,211,238,",
    pulse:  "rgba(236,72,153,",
  };

  const CFG = {
    nodeCount : 55,
    maxDist   : 155,
    speed     : 0.32,
    nodeR      : 1.8,
    lineAlpha  : 0.22,
    pulseEvery : 180,   // frames between pulses
  };

  /* Reduce motion */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initCanvas(section) {
    const canvas = document.createElement("canvas");
    canvas.className = "ph-canvas";
    canvas.setAttribute("aria-hidden", "true");
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext("2d");
    let W, H, nodes, raf, frame = 0;

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
      buildNodes();
    }

    function buildNodes() {
      nodes = Array.from({ length: CFG.nodeCount }, () => ({
        x  : Math.random() * W,
        y  : Math.random() * H,
        vx : (Math.random() - 0.5) * CFG.speed,
        vy : (Math.random() - 0.5) * CFG.speed,
        r  : CFG.nodeR + Math.random() * 1.2,
        cyan: Math.random() > 0.55,
        pulse: 0,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      /* Occasionally start a pulse ripple from a random node */
      if (frame % CFG.pulseEvery === 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        n.pulse = 1;
      }

      /* Move nodes */
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        if (n.pulse > 0) n.pulse -= 0.018;
        if (n.pulse < 0) n.pulse = 0;
      }

      /* Draw edges */
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CFG.maxDist) continue;
          const alpha = CFG.lineAlpha * (1 - dist / CFG.maxDist);
          const col = (a.cyan || b.cyan) ? COLORS.lineSec : COLORS.line;
          ctx.strokeStyle = col + alpha + ")";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* Draw nodes */
      for (const n of nodes) {
        const col = n.cyan ? COLORS.nodeSec : COLORS.node;

        /* Pulse ring */
        if (n.pulse > 0) {
          const pr = (1 - n.pulse) * 50;
          const pa = n.pulse * 0.5;
          ctx.strokeStyle = COLORS.pulse + pa + ")";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
          ctx.stroke();
        }

        /* Glow */
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        g.addColorStop(0, col + "0.55)");
        g.addColorStop(1, col + "0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fill();

        /* Core dot */
        ctx.fillStyle = col + "0.9)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    /* IntersectionObserver — pause when off-screen */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(tick); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 });

    io.observe(section);

    const ro = new ResizeObserver(resize);
    ro.observe(section);

    resize();
  }

  function init() {
    if (prefersReduced) return;
    document.querySelectorAll(".page-hero").forEach(initCanvas);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
