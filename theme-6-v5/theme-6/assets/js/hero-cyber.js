/**
 * SyntrixSoft Premium Hero — script.js
 * ─────────────────────────────────
 * 1. CityRenderer      → 2D canvas: procedural city skyline with blinking windows
 * 2. NetworkRenderer   → 2D canvas: 5G nodes, glowing lines, data packets, pulse waves
 * 3. ThreeParticles    → Three.js: floating 3-D particle cloud with mouse parallax
 * 4. WaveRenderer      → mini wave canvas inside AI card
 * 5. DotGrid           → animated cloud-node dot grid
 * 6. CardTilt          → mouse-driven 3D tilt on glass cards
 * 7. LiveMetrics       → live-update numbers on cards
 * 8. CounterAnim       → KPI number count-up
 * 9. GSAP entrance     → staggered reveal on load
 * 10. MouseParallax    → background layer drift on mouse move
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     1. CITY RENDERER
     Draws a multi-layer city skyline with animated
     blinking windows, antenna lights, atmospheric haze
     and a glowing city-light horizon.
  ═══════════════════════════════════════════════════════ */
  class CityRenderer {
    constructor(id) {
      this.cvs   = document.getElementById(id);
      this.ctx   = this.cvs.getContext('2d');
      this.frame = 0;
      this.stars = null;
      this.layers = [];
      this._raf  = null;

      this._resize();
      this._buildLayers();
      this._loop();

      window.addEventListener('resize', () => {
        this._resize();
        this._buildLayers();
        this.stars = null;
      }, { passive: true });
    }

    _resize() {
      this.W = this.cvs.width  = window.innerWidth;
      this.H = this.cvs.height = window.innerHeight;
    }

    /* Generate 3 building layers (distant → foreground) */
    _buildLayers() {
      this.layers = [];
      const H = this.H, W = this.W;

      const defs = [
        // [groundFrac, minHFrac, maxHFrac, minW, maxW, rgb, alpha, winDens, winBrt]
        [0.72, 0.07, 0.16, 14, 38, [10,25,55],  0.55, 0.32, 0.22],
        [0.77, 0.14, 0.32, 22, 65, [5, 14,32],  0.82, 0.42, 0.48],
        [0.82, 0.20, 0.52, 34,108, [2,  7,18],  1.00, 0.38, 0.65],
      ];

      defs.forEach(([gF, minHF, maxHF, minW, maxW, col, al, wD, wB]) => {
        const buildings = [];
        let x = -60;
        while (x < W + 130) {
          const bW = minW + Math.random() * (maxW - minW);
          const bH = (minHF + Math.random() * (maxHF - minHF)) * H;
          const gY = gF * H;
          const y  = gY - bH;
          const ws = 4, wg = 7;
          const cols = Math.max(1, Math.floor((bW - 8) / (ws + wg)));
          const rows = Math.max(1, Math.floor((bH - 10) / (ws + wg)));
          const wins = [];
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (Math.random() < wD) {
                wins.push({
                  x: x + 6 + c * (ws + wg),
                  y: y + 8 + r * (ws + wg),
                  w: ws, h: ws,
                  lit: Math.random() > 0.3,
                  warm: Math.random() > 0.45,
                  flick: Math.random() < 0.06,
                  fRate: 40 + Math.floor(Math.random() * 140),
                  brt: wB,
                });
              }
            }
          }
          const ant = Math.random() < 0.28 && bH > maxHF * H * 0.55;
          buildings.push({ x, y, w: bW, h: bH, gY, col, al, wins, ant });
          x += bW + 2 + Math.random() * 10;
        }
        this.layers.push(buildings);
      });
    }

    _drawSky() {
      const { ctx, W, H, frame } = this;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0.00, '#000208');
      g.addColorStop(0.28, '#000510');
      g.addColorStop(0.62, '#020b1e');
      g.addColorStop(0.85, '#030f28');
      g.addColorStop(1.00, '#050e24');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Stars
      if (!this.stars) {
        this.stars = Array.from({ length: 130 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H * 0.58,
          s: Math.random() < 0.8 ? 1 : 1.5,
          b: 0.25 + Math.random() * 0.75,
          ph: Math.random() * Math.PI * 2,
        }));
      }
      this.stars.forEach(st => {
        const fl = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.007 + st.ph));
        ctx.globalAlpha = st.b * fl;
        ctx.fillStyle = '#c8dcff';
        ctx.fillRect(st.x, st.y, st.s, st.s);
      });
      ctx.globalAlpha = 1;
    }

    _drawBuildings() {
      const { ctx, frame } = this;
      this.layers.forEach(layer => {
        layer.forEach(b => {
          ctx.globalAlpha = b.al;
          const [r, g, bl] = b.col;
          ctx.fillStyle = `rgb(${r},${g},${bl})`;
          ctx.fillRect(b.x, b.y, b.w, b.h);

          // Subtle blue left-edge glow (atmospheric city light)
          const eg = ctx.createLinearGradient(b.x, 0, b.x + 4, 0);
          eg.addColorStop(0, 'rgba(30,90,200,0.14)');
          eg.addColorStop(1, 'transparent');
          ctx.fillStyle = eg;
          ctx.fillRect(b.x, b.y, 4, b.h);

          // Antenna
          if (b.ant) {
            ctx.globalAlpha = b.al * 0.9;
            ctx.strokeStyle = `rgba(${r+8},${g+8},${bl+12},${b.al})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(b.x + b.w / 2, b.y);
            ctx.lineTo(b.x + b.w / 2, b.y - 20);
            ctx.stroke();
            const antBlink = Math.sin(frame * 0.055) > 0.4;
            ctx.globalAlpha = antBlink ? 0.95 : 0.18;
            ctx.fillStyle = '#ff5050';
            ctx.beginPath();
            ctx.arc(b.x + b.w / 2, b.y - 20, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Windows
          b.wins.forEach(w => {
            if (w.flick && frame % w.fRate === 0) w.lit = Math.random() > 0.25;
            ctx.globalAlpha = b.al * w.brt;
            if (!w.lit) {
              ctx.fillStyle = 'rgba(8,12,28,0.8)';
            } else {
              ctx.fillStyle = w.warm
                ? `rgba(255,232,168,${0.55 + Math.random() * 0.2})`
                : `rgba(155,200,255,${0.45 + Math.random() * 0.2})`;
            }
            ctx.fillRect(w.x, w.y, w.w, w.h);
          });
        });
      });
      ctx.globalAlpha = 1;
    }

    _drawHaze() {
      const { ctx, W, H } = this;
      // City glow horizon
      const hg = ctx.createLinearGradient(0, H * 0.7, 0, H);
      hg.addColorStop(0, 'transparent');
      hg.addColorStop(0.45, 'rgba(8,38,110,0.22)');
      hg.addColorStop(1, 'rgba(15,55,160,0.36)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, H * 0.7, W, H * 0.3);

      // Atmospheric band
      const ag = ctx.createLinearGradient(0, H * 0.63, 0, H * 0.78);
      ag.addColorStop(0, 'transparent');
      ag.addColorStop(0.5, 'rgba(18,55,150,0.1)');
      ag.addColorStop(1, 'transparent');
      ctx.fillStyle = ag;
      ctx.fillRect(0, H * 0.63, W, H * 0.15);
    }

    _loop() {
      this.frame++;
      const { ctx, W, H } = this;
      ctx.clearRect(0, 0, W, H);
      this._drawSky();
      this._drawBuildings();
      this._drawHaze();
      this._raf = requestAnimationFrame(() => this._loop());
    }
  }

  /* ═══════════════════════════════════════════════════════
     2. NETWORK RENDERER
     5G nodes, gradient connection lines, moving data
     packets with glowing tails, and radial pulse waves.
  ═══════════════════════════════════════════════════════ */
  class NetworkRenderer {
    constructor(id) {
      this.cvs   = document.getElementById(id);
      this.ctx   = this.cvs.getContext('2d');
      this.nodes = [];
      this.edges = [];
      this.pkts  = [];
      this.waves = [];
      this.frame = 0;
      this._raf  = null;

      this._resize();
      this._generate();
      this._loop();

      window.addEventListener('resize', () => {
        this._resize();
        this._generate();
      }, { passive: true });
    }

    _resize() {
      this.W = this.cvs.width  = window.innerWidth;
      this.H = this.cvs.height = window.innerHeight;
    }

    _generate() {
      const W = this.W, H = this.H;
      const n = Math.max(20, Math.floor(W / 64));
      this.nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: H * (0.08 + Math.random() * 0.64),
        r: 2.8 + Math.random() * 3.8,
        phase: Math.random() * Math.PI * 2,
        pSpeed: 0.014 + Math.random() * 0.022,
        pTimer: Math.floor(Math.random() * 180),
        col: Math.random() > 0.35 ? 'cyan' : 'purple',
      }));

      const maxD = W * 0.24;
      this.edges = [];
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const d = Math.hypot(this.nodes[j].x - this.nodes[i].x,
                               this.nodes[j].y - this.nodes[i].y);
          if (d < maxD) this.edges.push({ a: i, b: j, d });
        }
      }

      this.pkts = [];
      for (let k = 0; k < 28; k++) this._spawnPkt();
    }

    _spawnPkt() {
      if (!this.edges.length) return;
      const e = this.edges[Math.floor(Math.random() * this.edges.length)];
      this.pkts.push({
        e, t: Math.random(),
        sp: 0.0014 + Math.random() * 0.0028,
        rev: Math.random() > 0.5,
        col: Math.random() > 0.42 ? 'cyan' : 'purple',
        sz: 1.8 + Math.random() * 1.6,
      });
    }

    _spawnWave(node) {
      this.waves.push({
        x: node.x, y: node.y,
        r: 0, maxR: 55 + Math.random() * 90,
        a: 0.7,
        col: node.col,
      });
    }

    _drawEdges() {
      const { ctx, nodes, edges, W } = this;
      edges.forEach(({ a, b, d }) => {
        const na = nodes[a], nb = nodes[b];
        const alpha = 0.06 + 0.16 * (1 - d / (W * 0.24));
        const g = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        g.addColorStop(0,   `rgba(34,211,238,${alpha * 0.6})`);
        g.addColorStop(0.5, `rgba(99,102,241,${alpha})`);
        g.addColorStop(1,   `rgba(168,85,247,${alpha * 0.6})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      });
    }

    _drawNodes() {
      const { ctx, nodes, frame } = this;
      nodes.forEach(n => {
        n.phase += n.pSpeed;
        const p   = 0.55 + 0.45 * Math.sin(n.phase);
        const rgb = n.col === 'cyan' ? '34,211,238' : '168,85,247';

        // Outer glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grd.addColorStop(0, `rgba(${rgb},${0.38 * p})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(${rgb},${0.85 + 0.15 * p})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * p, 0, Math.PI * 2);
        ctx.fill();

        // White center
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.32, 0, Math.PI * 2);
        ctx.fill();

        // Pulse trigger
        n.pTimer--;
        if (n.pTimer <= 0) {
          this._spawnWave(n);
          n.pTimer = 100 + Math.floor(Math.random() * 220);
        }
      });
    }

    _drawPackets() {
      const { ctx, nodes, pkts, edges, frame } = this;
      pkts.forEach(pk => {
        pk.t += pk.sp;
        if (pk.t > 1) {
          pk.t = 0;
          pk.e = edges[Math.floor(Math.random() * edges.length)];
          pk.rev = Math.random() > 0.5;
        }
        const na = nodes[pk.e.a], nb = nodes[pk.e.b];
        const t  = pk.rev ? 1 - pk.t : pk.t;
        const t0 = Math.max(0, t - 0.13);
        const x  = na.x + (nb.x - na.x) * t,  y  = na.y + (nb.y - na.y) * t;
        const x0 = na.x + (nb.x - na.x) * t0, y0 = na.y + (nb.y - na.y) * t0;
        const rgb = pk.col === 'cyan' ? '34,211,238' : '168,85,247';

        const tg = ctx.createLinearGradient(x0, y0, x, y);
        tg.addColorStop(0, `rgba(${rgb},0)`);
        tg.addColorStop(1, `rgba(${rgb},0.9)`);
        ctx.strokeStyle = tg;
        ctx.lineWidth   = pk.sz;
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, pk.sz * 0.75, 0, Math.PI * 2);
        ctx.fill();
      });

      if (frame % 42 === 0 && pkts.length < 46) this._spawnPkt();
    }

    _drawWaves() {
      const { ctx } = this;
      this.waves = this.waves.filter(w => w.a > 0.015);
      this.waves.forEach(w => {
        w.r += 1.4;
        w.a *= 0.968;
        const rgb = w.col === 'cyan' ? '34,211,238' : '168,85,247';
        ctx.strokeStyle = `rgba(${rgb},${w.a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    _loop() {
      this.frame++;
      const { ctx, W, H } = this;
      ctx.clearRect(0, 0, W, H);
      this._drawEdges();
      this._drawWaves();
      this._drawPackets();
      this._drawNodes();
      this._raf = requestAnimationFrame(() => this._loop());
    }
  }

  /* ═══════════════════════════════════════════════════════
     3. THREE.JS PARTICLE CLOUD
     1400 glowing particles in cyan / indigo / purple,
     floating gently with smooth mouse-parallax on camera.
  ═══════════════════════════════════════════════════════ */
  class ThreeParticles {
    constructor(mountId) {
      this.mount = document.getElementById(mountId);
      if (!this.mount || typeof THREE === 'undefined') return;
      this.mouse  = { tx: 0, ty: 0, cx: 0, cy: 0 };
      this._raf   = null;
      this._init();
    }

    _init() {
      const W = window.innerWidth, H = window.innerHeight;

      this.scene    = new THREE.Scene();
      this.camera   = new THREE.PerspectiveCamera(62, W / H, 0.1, 2000);
      this.camera.position.z = 520;

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      this.renderer.setSize(W, H);
      this.renderer.setClearColor(0x000000, 0);
      this.mount.appendChild(this.renderer.domElement);

      this._buildParticles();
      this._bindEvents();
      this._loop();
    }

    _buildParticles() {
      const cnt   = window.innerWidth < 768 ? 500 : 1400;
      const pos   = new Float32Array(cnt * 3);
      const col   = new Float32Array(cnt * 3);
      this._vel   = [];

      const palette = [
        [0.13, 0.83, 0.93],  // cyan
        [0.39, 0.40, 1.00],  // indigo
        [0.66, 0.33, 1.00],  // purple
        [0.06, 0.58, 0.88],  // blue
      ];

      for (let i = 0; i < cnt; i++) {
        pos[i*3]   = (Math.random() - 0.5) * 950;
        pos[i*3+1] = (Math.random() - 0.5) * 620;
        pos[i*3+2] = (Math.random() - 0.5) * 320;
        const c = palette[Math.floor(Math.random() * palette.length)];
        col[i*3]   = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
        this._vel.push({
          x: (Math.random() - 0.5) * 0.18,
          y: (Math.random() - 0.5) * 0.14,
        });
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

      const mat = new THREE.PointsMaterial({
        size:          2.2,
        vertexColors:  true,
        transparent:   true,
        opacity:       0.60,
        blending:      THREE.AdditiveBlending,
        depthWrite:    false,
      });

      this.pts = new THREE.Points(geo, mat);
      this.scene.add(this.pts);
    }

    _bindEvents() {
      window.addEventListener('mousemove', e => {
        this.mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 55;
        this.mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 35;
      }, { passive: true });

      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }, { passive: true });
    }

    _loop() {
      this._raf = requestAnimationFrame(() => this._loop());

      const m = this.mouse;
      m.cx += (m.tx - m.cx) * 0.038;
      m.cy += (m.ty - m.cy) * 0.038;
      this.camera.position.x += (m.cx - this.camera.position.x) * 0.05;
      this.camera.position.y += (m.cy - this.camera.position.y) * 0.05;
      this.camera.lookAt(this.scene.position);

      if (this.pts) {
        const p = this.pts.geometry.attributes.position;
        for (let i = 0; i < this._vel.length; i++) {
          p.array[i*3]   += this._vel[i].x;
          p.array[i*3+1] += this._vel[i].y;
          if (p.array[i*3]   >  480) p.array[i*3]   = -480;
          if (p.array[i*3]   < -480) p.array[i*3]   =  480;
          if (p.array[i*3+1] >  310) p.array[i*3+1] = -310;
          if (p.array[i*3+1] < -310) p.array[i*3+1] =  310;
        }
        p.needsUpdate = true;
        this.pts.rotation.y += 0.00018;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  /* ═══════════════════════════════════════════════════════
     4. AI WAVE CANVAS
  ═══════════════════════════════════════════════════════ */
  class WaveRenderer {
    constructor(id) {
      this.cvs = document.getElementById(id);
      if (!this.cvs) return;
      this.ctx = this.cvs.getContext('2d');
      this.f   = 0;
      this._loop();
    }

    _loop() {
      const { ctx, cvs } = this;
      const W = cvs.width, H = cvs.height;
      ctx.clearRect(0, 0, W, H);

      [
        { rgb: '34,211,238',  amp: 9,  freq: 0.05, spd: 0.045, off: 0 },
        { rgb: '99,102,241',  amp: 6,  freq: 0.09, spd: 0.065, off: Math.PI },
        { rgb: '168,85,247',  amp: 4,  freq: 0.13, spd: 0.032, off: 1.5 },
      ].forEach(w => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${w.rgb},0.75)`;
        ctx.lineWidth   = 1.5;
        for (let x = 0; x <= W; x += 2) {
          const y = H / 2 + w.amp * Math.sin(x * w.freq + this.f * w.spd + w.off);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      this.f++;
      requestAnimationFrame(() => this._loop());
    }
  }

  /* ═══════════════════════════════════════════════════════
     5. DOT GRID (Cloud card)
  ═══════════════════════════════════════════════════════ */
  function initDotGrid() {
    const grid = document.getElementById('dot-grid');
    if (!grid) return;
    const dots = Array.from({ length: 50 }, () => {
      const d = document.createElement('div');
      d.className = 'ndot';
      grid.appendChild(d);
      return d;
    });
    setInterval(() => {
      dots.forEach(d => {
        const r = Math.random();
        if      (r < 0.12) { d.className = 'ndot hot'; setTimeout(() => d.className = 'ndot on', 900); }
        else if (r < 0.35) { d.className = 'ndot on';  }
        else if (r < 0.55) { d.className = 'ndot'; }
      });
    }, 420);
  }

  /* ═══════════════════════════════════════════════════════
     6. CARD TILT
  ═══════════════════════════════════════════════════════ */
  function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const cx = r.width / 2, cy = r.height / 2;
        const rx = ((e.clientY - r.top  - cy) / cy) * -9;
        const ry = ((e.clientX - r.left - cx) / cx) *  9;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        card.style.boxShadow = `0 24px 70px rgba(0,0,0,.55), 0 0 60px rgba(34,211,238,.10)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     7. LIVE METRICS
  ═══════════════════════════════════════════════════════ */
  function initMetrics() {
    const speed = document.getElementById('speed-val');
    const ai    = document.getElementById('ai-val');
    const nodes = document.getElementById('node-cnt');

    if (speed) setInterval(() => {
      speed.textContent = (4.6 + Math.random() * 2.6).toFixed(1);
    }, 2200);

    if (ai) {
      let v = 2.4;
      setInterval(() => {
        v += (Math.random() - 0.5) * 0.35;
        v = Math.max(1.6, Math.min(4.2, v));
        ai.textContent = v.toFixed(1) + 'M';
      }, 1600);
    }

    if (nodes) setInterval(() => {
      nodes.textContent = 136 + Math.floor(Math.random() * 14);
    }, 3200);
  }

  /* ═══════════════════════════════════════════════════════
     8. KPI COUNTER ANIMATION
  ═══════════════════════════════════════════════════════ */
  function animateCounters() {
    document.querySelectorAll('.kv[data-target]').forEach(el => {
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 55));
      const tick = () => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur < target) requestAnimationFrame(tick);
      };
      tick();
    });
  }

  /* ═══════════════════════════════════════════════════════
     9. GSAP ENTRANCE ANIMATIONS
  ═══════════════════════════════════════════════════════ */
  function initGSAP() {
    if (typeof gsap === 'undefined') {
      // Fallback: show everything without animation
      document.querySelectorAll('.badge,.hero-para,.cta-row,.kpi-row,.gc,.scroll-ind')
        .forEach(el => { el.style.opacity = '1'; });
      document.querySelectorAll('.ln')
        .forEach(el => { el.style.transform = 'none'; });
      animateCounters();
      return;
    }

    const tl = gsap.timeline({ delay: 0.25, onComplete: animateCounters });

    tl.to('#badge', {
      opacity: 1, y: 0,
      duration: 0.65, ease: 'power3.out',
    }, 'start')

    .to('.ln', {
      y: '0%',
      duration: 0.9,
      stagger: 0.11,
      ease: 'power4.out',
    }, 'start+=0.1')

    .to('#hero-para', {
      opacity: 1,
      duration: 0.7, ease: 'power3.out',
    }, 'start+=0.45')

    .to('#cta-row', {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power3.out',
    }, 'start+=0.58')

    .to('#kpi-row', {
      opacity: 1,
      duration: 0.55, ease: 'power3.out',
    }, 'start+=0.72')

    .to('.gc', {
      opacity: 1, x: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power3.out',
    }, 'start+=0.35')

    .to('#scroll-ind', {
      opacity: 1,
      duration: 0.5,
    }, 'start+=1.05');

    // Card float loops
    [
      ['.gc-a', 3.8, 0.4, -10],
      ['.gc-b', 3.1, 1.0,  -8],
      ['.gc-c', 4.3, 0.0, -13],
      ['.gc-d', 2.9, 1.6,  -7],
    ].forEach(([sel, dur, delay, y]) => {
      gsap.to(sel, { y, duration: dur, repeat: -1, yoyo: true, ease: 'sine.inOut', delay });
    });
  }

  /* ═══════════════════════════════════════════════════════
     10. MOUSE PARALLAX (background layers drift)
  ═══════════════════════════════════════════════════════ */
  function initParallax() {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const city = document.getElementById('city-canvas');
    const net  = document.getElementById('net-canvas');

    (function raf() {
      cx += (mx - cx) * 0.036;
      cy += (my - cy) * 0.036;
      if (city) city.style.transform = `translate(${cx * 9}px, ${cy * 5}px) scale(1.04)`;
      if (net)  net.style.transform  = `translate(${cx * 16}px, ${cy * 9}px)`;
      requestAnimationFrame(raf);
    })();
  }

  /* ═══════════════════════════════════════════════════════
     GSAP initial states (set before animation starts)
  ═══════════════════════════════════════════════════════ */
  function setInitialStates() {
    // Elements that fade/slide in — set opacity 0 is in CSS
    // Cards also need horizontal start
    if (typeof gsap !== 'undefined') {
      gsap.set('.gc', { x: 55 });
      gsap.set('#badge, #hero-para, #cta-row, #kpi-row', { y: 18 });
    }
  }

  /* ═══════════════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════════════ */
  function boot() {
    setInitialStates();
    new CityRenderer('city-canvas');
    new NetworkRenderer('net-canvas');
    if (typeof THREE !== 'undefined') new ThreeParticles('three-mount');
    new WaveRenderer('wave-cvs');
    initDotGrid();
    initTilt();
    initMetrics();
    initGSAP();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
