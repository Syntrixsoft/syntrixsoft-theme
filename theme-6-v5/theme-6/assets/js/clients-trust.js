/**
 * Trusted clients — premium animated network background
 */
(function () {
  "use strict";

  function init() {
    const section = document.querySelector(".clients-section");
    const canvas = document.getElementById("clients-network-canvas");
    if (!section || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite =
      document.documentElement.classList.contains("perf-lite") ||
      window.innerWidth < 768;

    if (reduced || lite) {
      section.classList.add("clients-section--static");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const NODE_N = 64;
    const LINK = 120;
    const LINK_SQ = LINK * LINK;
    const nodes = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let t = 0;

    for (let i = 0; i < NODE_N; i++) {
      nodes.push({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        side: i < NODE_N / 2 ? "L" : "R",
        r: 1 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function placeNodes() {
      nodes.forEach((n, i) => {
        const side = i < NODE_N / 2 ? "L" : "R";
        n.side = side;
        n.x = side === "L" ? w * (0.06 + Math.random() * 0.4) : w * (0.54 + Math.random() * 0.4);
        n.y = h * (0.15 + Math.random() * 0.7);
      });
    }

    function resize() {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      placeNodes();
    }

    function color(side, a) {
      if (side === "L") return `rgba(236, 72, 153, ${a})`;
      return `rgba(34, 211, 238, ${a})`;
    }

    function draw() {
      if (!running) return;
      t += 0.014;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.52;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        const minX = n.side === "L" ? w * 0.03 : w * 0.51;
        const maxX = n.side === "L" ? w * 0.49 : w * 0.97;
        if (n.x < minX || n.x > maxX) n.vx *= -1;
        if (n.y < h * 0.1 || n.y > h * 0.9) n.vy *= -1;
        n.x += (cx + (n.side === "L" ? -w * 0.08 : w * 0.08) - n.x) * 0.002;
        n.y += (cy - n.y) * 0.001;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_SQ) continue;
          const dist = Math.sqrt(d2);
          const alpha = (1 - dist / LINK) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = a.side === b.side ? color(a.side, alpha) : `rgba(196, 181, 253, ${alpha * 0.9})`;
          ctx.lineWidth = 0.9;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      const hubPulse = 0.5 + Math.sin(t * 2) * 0.5;
      const hubR = Math.min(w, h) * 0.12 + hubPulse * 12;
      const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hubR);
      hubGrad.addColorStop(0, `rgba(196, 181, 253, ${0.25 + hubPulse * 0.15})`);
      hubGrad.addColorStop(0.5, `rgba(34, 211, 238, ${0.08 + hubPulse * 0.06})`);
      hubGrad.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = hubGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
      ctx.fill();

      nodes.forEach((n) => {
        const pulse = 0.5 + Math.sin(t * 3 + n.phase) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = color(n.side, 0.4 + pulse * 0.5);
        ctx.shadowColor = color(n.side, 0.8);
        ctx.shadowBlur = 6;
        ctx.arc(n.x, n.y, n.r + pulse * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();

    const obs = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting !== false;
        if (running) {
          cancelAnimationFrame(raf);
          draw();
        }
      },
      { rootMargin: "100px" }
    );
    obs.observe(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
