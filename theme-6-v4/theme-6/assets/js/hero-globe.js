/**
 * Hero 3D wireframe globe — loaded by animation.js
 */
(function () {
  "use strict";

  window.SyntrixHeroGlobe = function (animations) {
    const canvas = document.getElementById("hero-globe");
    const stage = document.querySelector(".hero-globe-stage");
    if (!canvas || !stage) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rotY = 0;
    const rotX = 0.32;
    let surfaceNodes = [];
    let arcs = [];
    let orbitSatellites = [];
    let dataPackets = [];
    let R = 100;
    const isVisible = animations.observeHeroVisibility(stage);

    const fibonacci = (n, radius) => {
      const pts = [];
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const t = phi * i;
        pts.push({
          x: Math.cos(t) * r * radius,
          y: y * radius,
          z: Math.sin(t) * r * radius,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      return pts;
    };

    const project = (x, y, z, cx, cy, persp) => {
      const cyR = Math.cos(rotY);
      const syR = Math.sin(rotY);
      const cxR = Math.cos(rotX);
      const sxR = Math.sin(rotX);
      const x1 = x * cyR + z * syR;
      const z1 = -x * syR + z * cyR;
      const y1 = y * cxR - z1 * sxR;
      const z2 = y * sxR + z1 * cxR;
      const depth = persp / (persp + z2);
      return { x: cx + x1 * depth, y: cy + y1 * depth, z: z2, depth };
    };

    const buildArcs = () => {
      arcs = [];
      for (let i = 0; i < surfaceNodes.length; i++) {
        for (let j = i + 1; j < surfaceNodes.length; j++) {
          const a = surfaceNodes[i];
          const b = surfaceNodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (d < R * 0.52) arcs.push({ a: i, b: j });
        }
      }
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width < 1 || height < 1) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      R = Math.min(width, height) * 0.38;
      surfaceNodes = fibonacci(52, R);
      buildArcs();

      orbitSatellites = Array.from({ length: 10 }, (_, i) => ({
        angle: (i / 10) * Math.PI * 2,
        radius: R * (1.32 + (i % 3) * 0.1),
        speed: 0.01 + (i % 5) * 0.003,
        tilt: 0.25 + (i % 4) * 0.22,
        hue: i % 2,
      }));

      dataPackets = Array.from({ length: Math.min(28, arcs.length) }, (_, i) => ({
        edgeIdx: i % Math.max(1, arcs.length),
        t: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
      }));
    };

    const drawPath = (pts, alpha, lineW, radius) => {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (p.z < -radius * 0.35) {
          started = false;
          continue;
        }
        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      if (started) {
        ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
        ctx.lineWidth = lineW;
        ctx.stroke();
      }
    };

    const drawWireframe = (cx, cy, persp) => {
      const latSteps = 11;
      const lonSteps = 20;

      for (let lat = 1; lat < latSteps; lat++) {
        const phi = (lat / latSteps) * Math.PI - Math.PI / 2;
        const y = Math.sin(phi) * R;
        const r = Math.cos(phi) * R;
        const pts = [];
        for (let lon = 0; lon <= lonSteps; lon++) {
          const lam = (lon / lonSteps) * Math.PI * 2;
          pts.push(project(Math.cos(lam) * r, y, Math.sin(lam) * r, cx, cy, persp));
        }
        drawPath(pts, 0.22 + (lat / latSteps) * 0.12, 1, R);
      }

      for (let lon = 0; lon < lonSteps; lon++) {
        const lam = (lon / lonSteps) * Math.PI * 2;
        const pts = [];
        for (let lat = 0; lat <= latSteps; lat++) {
          const phi = (lat / latSteps) * Math.PI - Math.PI / 2;
          pts.push(
            project(
              Math.cos(phi) * Math.cos(lam) * R,
              Math.sin(phi) * R,
              Math.cos(phi) * Math.sin(lam) * R,
              cx,
              cy,
              persp
            )
          );
        }
        drawPath(pts, 0.28, 1, R);
      }
    };

    const draw = () => {
      requestAnimationFrame(draw);
      if (document.hidden || !isVisible() || width < 1) return;

      rotY += 0.0038;
      const cx = width / 2;
      const cy = height / 2;
      const persp = 520;

      ctx.clearRect(0, 0, width, height);

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.25);
      core.addColorStop(0, "rgba(34,211,238,0.45)");
      core.addColorStop(0.35, "rgba(99,102,241,0.2)");
      core.addColorStop(0.7, "rgba(168,85,247,0.08)");
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2);
      ctx.fill();

      drawWireframe(cx, cy, persp);

      const projected = surfaceNodes.map((n) => project(n.x, n.y, n.z, cx, cy, persp));

      ctx.globalCompositeOperation = "lighter";

      arcs.forEach(({ a, b }) => {
        const p1 = projected[a];
        const p2 = projected[b];
        if (p1.z < -R * 0.15 && p2.z < -R * 0.15) return;
        const avgZ = (p1.z + p2.z) * 0.5;
        const alpha = 0.12 + 0.4 * ((avgZ + R) / (2 * R));
        const g = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        g.addColorStop(0, `rgba(99,102,241,${alpha * 0.6})`);
        g.addColorStop(0.5, `rgba(34,211,238,${alpha})`);
        g.addColorStop(1, `rgba(236,72,153,${alpha * 0.7})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      dataPackets.forEach((pkt) => {
        if (!arcs.length) return;
        pkt.t += pkt.speed;
        if (pkt.t > 1) {
          pkt.t = 0;
          pkt.edgeIdx = Math.floor(Math.random() * arcs.length);
        }
        const arc = arcs[pkt.edgeIdx];
        if (!arc) return;
        const p1 = projected[arc.a];
        const p2 = projected[arc.b];
        const x = p1.x + (p2.x - p1.x) * pkt.t;
        const y = p1.y + (p2.y - p1.y) * pkt.t;
        const t0 = Math.max(0, pkt.t - 0.14);
        const x0 = p1.x + (p2.x - p1.x) * t0;
        const y0 = p1.y + (p2.y - p1.y) * t0;
        const grad = ctx.createLinearGradient(x0, y0, x, y);
        grad.addColorStop(0, "rgba(34,211,238,0)");
        grad.addColorStop(0.6, "rgba(34,211,238,0.85)");
        grad.addColorStop(1, "#ffffff");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = "#e0f2fe";
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      projected.forEach((p, i) => {
        if (p.z < -R * 0.25) return;
        const n = surfaceNodes[i];
        n.pulse += 0.05;
        const alpha = 0.35 + 0.65 * ((p.z + R) / (2 * R));
        const r = 2.2 + Math.sin(n.pulse) * 1.2;
        ctx.fillStyle = `rgba(103,232,249,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });

      orbitSatellites.forEach((sat) => {
        sat.angle += sat.speed;
        const ox = Math.cos(sat.angle) * sat.radius;
        const oy = Math.sin(sat.angle) * sat.radius * Math.sin(sat.tilt);
        const oz = Math.sin(sat.angle) * sat.radius * Math.cos(sat.tilt);
        const p = project(ox, oy, oz, cx, cy, persp);
        const rgb = sat.hue ? "244,114,182" : "34,211,238";
        const beamAlpha = 0.06 + 0.14 * ((p.z + sat.radius) / (2 * sat.radius));
        ctx.strokeStyle = `rgba(${rgb},${beamAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.fillStyle = `rgba(${rgb},0.95)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
    };

    resize();
    requestAnimationFrame(draw);
    let resizeRaf = 0;
    window.addEventListener(
      "resize",
      () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(resize);
      },
      { passive: true }
    );
  };
})();
