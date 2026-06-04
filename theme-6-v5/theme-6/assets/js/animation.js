/**
 * SyntrixSoft Theme — Animation JavaScript
 * GSAP, ScrollTrigger, AOS, Swiper, Lottie
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 991px)").matches;
  const isLowPower = prefersReducedMotion || isMobile || navigator.connection?.saveData;

  const SyntrixAnimations = {
    init() {
      if (isLowPower) {
        document.documentElement.classList.add("perf-lite");
      }

      this.initSwipers();
      this.initMarquee();

      if (prefersReducedMotion) {
        this.initReducedMotion();
        return;
      }

      this.waitForPageReady(() => this.initMotion());
    },

    waitForPageReady(callback) {
      const loader = document.getElementById("page-loader");
      const run = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(callback);
        });
      };

      if (!loader || loader.classList.contains("hidden")) {
        run();
      } else {
        window.addEventListener("syntrixsoft:loaded", run, { once: true });
      }
    },

    initMotion() {
      if (typeof gsap === "undefined") {
        document.body.classList.add("animations-ready");
        return;
      }

      this.registerGSAP();
      this.initAOS();
      this.initHeroAnimations();
      this.initPageHeroAnimations();
      this.initScrollAnimations();

      if (!isLowPower) {
        this.initMouseParallax();
        this.initLottie();
        this.scheduleHeroEffects();
      } else {
        this.initLottie();
        if (window.innerWidth >= 768) {
          this.initHeroGlobe();
        }
      }

      document.body.classList.add("animations-ready");

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh(true);
      }
    },

    scheduleHeroEffects() {
      if (isLowPower) return;

      const run = () => {
        if (window.innerWidth >= 768) {
          this.initHeroGlobe();
        }
      };

      run();
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {}, { timeout: 100 });
      }
    },

    initReducedMotion() {
      document.querySelectorAll(".reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => {
        el.classList.add("revealed");
      });
      document.querySelector(".hero-bg-img")?.style.removeProperty("animation");
      if (typeof AOS !== "undefined") AOS.init({ disable: true });
    },

    registerGSAP() {
      if (typeof gsap === "undefined") return;
      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ limitCallbacks: true });
      }
    },

    /* ---------- AOS ---------- */
    initAOS() {
      if (typeof AOS === "undefined" || !document.querySelector("[data-aos]")) return;
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
        disable: prefersReducedMotion
          ? true
          : () => window.matchMedia("(max-width: 991px)").matches,
      });
    },

    /* ---------- Swiper ---------- */
    initSwipers() {
      if (typeof Swiper === "undefined") return;

      document.querySelectorAll(".testimonials-swiper").forEach((el) => {
        new Swiper(el, {
          slidesPerView: 1,
          spaceBetween: 24,
          loop: true,
          autoplay: { delay: 5000, disableOnInteraction: false },
          pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
          navigation: {
            nextEl: el.querySelector(".swiper-button-next"),
            prevEl: el.querySelector(".swiper-button-prev"),
          },
          breakpoints: {
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          },
        });
      });

      document.querySelectorAll(".clients-swiper").forEach((el) => {
        new Swiper(el, {
          slidesPerView: 2,
          spaceBetween: 40,
          loop: true,
          autoplay: { delay: 0, disableOnInteraction: false },
          speed: 4000,
          allowTouchMove: false,
          breakpoints: {
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: { slidesPerView: 5 },
            1200: { slidesPerView: 6 },
          },
        });
      });
    },

    /* ---------- Lottie ---------- */
    initLottie() {
      if (typeof lottie !== "undefined") {
      document.querySelectorAll("[data-lottie]").forEach((container) => {
        const path = container.dataset.lottie;
        if (!path) return;

        lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path,
        });
      });
      }

      const heroLottie = document.getElementById("hero-lottie");
      if (heroLottie && !heroLottie.dataset.lottie && !heroLottie.querySelector("svg")) {
        heroLottie.innerHTML =
          '<div class="hero-lottie-fallback float"><svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#22d3ee"/></linearGradient></defs><circle cx="100" cy="100" r="80" fill="none" stroke="url(#lg)" stroke-width="2" class="spin-slow"/><circle cx="100" cy="100" r="50" fill="none" stroke="url(#lg)" stroke-width="1" opacity="0.5"/><circle cx="100" cy="30" r="8" fill="#22d3ee"/></svg></div>';
      }
    },

    /* ---------- Infinite Marquee ---------- */
    initMarquee() {
      document.querySelectorAll(".marquee-track").forEach((track) => {
        const items = track.innerHTML;
        track.innerHTML = items + items;
        track.classList.add("marquee-animate");
      });
    },

    /* ---------- Hero GSAP Timeline ---------- */
    initPageHeroAnimations() {
      if (typeof gsap === "undefined") return;
      const pageHero = document.querySelector(".page-hero");
      if (!pageHero) return;

      const targets = pageHero.querySelectorAll(
        ".breadcrumb-nav, .page-hero-title, .page-hero-desc, .blog-detail-meta"
      );
      if (!targets.length) return;

      gsap.from(targets, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        overwrite: "auto",
      });
    },

    initHeroAnimations() {
      if (typeof gsap === "undefined") return;

      const hero = document.getElementById("hero");
      if (!hero) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-bg-img", {
        scale: 1.14,
        opacity: 0,
        duration: 1.6,
        ease: "power2.out",
      })
        .from(
          [".hero-aurora", ".hero-grid-lines", ".hero-globe-stage"],
          { opacity: 0, duration: 1 },
          "-=1.1"
        )
        .from(
          ".hero-globe-stage",
          { scale: 0.88, duration: 1.2, ease: "power2.out" },
          "-=1"
        )
        .from(
          ".hero-shimmer",
          { opacity: 0, scaleX: 0.6, duration: 0.8, transformOrigin: "left center" },
          "-=0.9"
        )
        .from(".hero-badge", { y: 28, opacity: 0, duration: 0.55 }, "-=0.7")
        .from(".hero-title .line", { y: 48, opacity: 0, duration: 0.65, stagger: 0.1 }, "-=0.45")
        .from(".hero-subtitle", { y: 24, opacity: 0, duration: 0.55 }, "-=0.35")
        .from(".hero-cta > *", { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3")
        .from(".hero-stats .hero-stat", { y: 20, opacity: 0, duration: 0.5, stagger: 0.07 }, "-=0.25")
        .from(".hero-scroll", { opacity: 0, y: 12, duration: 0.45 }, "-=0.2");

      hero.classList.add("hero-revealed");
    },

    batchGridScroll(gridSelector, itemSelector, opts = {}) {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

      document.querySelectorAll(gridSelector).forEach((grid) => {
        const items = grid.querySelectorAll(itemSelector);
        if (!items.length) return;

        gsap.from(items, {
          y: opts.y ?? 36,
          opacity: 0,
          duration: opts.duration ?? 0.6,
          stagger: opts.stagger ?? 0.06,
          ease: opts.ease || "power3.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: {
            trigger: grid,
            start: opts.start || "top 92%",
            once: true,
            toggleActions: "play none none none",
          },
        });
      });
    },

    observeHeroVisibility(hero) {
      let visible = true;
      if (!hero) return () => visible;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0.06, rootMargin: "40px 0px" }
      );

      observer.observe(hero);
      return () => visible;
    },

    /* ---------- ScrollTrigger Sections ---------- */
    initScrollAnimations() {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

      gsap.utils.toArray(".section-header").forEach((header) => {
        gsap.from(header.children, {
          y: 40,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: header,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      this.batchGridScroll(".services-grid", ".service-card", { y: 40, duration: 0.6, stagger: 0.05 });
      this.batchGridScroll(".stats-grid", ".stat-card", { y: 24, duration: 0.5, stagger: 0.06 });
      this.batchGridScroll(".portfolio-grid", ".portfolio-card", { y: 36, duration: 0.6, stagger: 0.07 });
      this.batchGridScroll(".blog-grid", ".blog-card", { y: 36, duration: 0.6, stagger: 0.07 });

      gsap.utils.toArray(".text-reveal").forEach((el) => {
        this.splitTextReveal(el);
      });

      const ctaBox = document.querySelector(".cta-box");
      if (ctaBox) {
        gsap.from(".cta-content > *", {
          scrollTrigger: { trigger: ctaBox, start: "top 80%" },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      const clientsSection = document.querySelector(".clients-section");
      if (clientsSection) {
        gsap.from(".cs-headline__badge", {
          y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: clientsSection, start: "top 85%", once: true },
        });
        gsap.from(".cs-headline__title", {
          y: 30, opacity: 0, duration: 0.8, delay: 0.1, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: clientsSection, start: "top 85%", once: true },
        });
        gsap.from(".cs-headline__sub", {
          y: 20, opacity: 0, duration: 0.7, delay: 0.2, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: clientsSection, start: "top 85%", once: true },
        });
        gsap.from(".cs-stats .cs-stats__item", {
          y: 28, opacity: 0, scale: 0.92, duration: 0.65, stagger: 0.1, ease: "back.out(1.4)",
          immediateRender: false,
          scrollTrigger: { trigger: clientsSection, start: "top 75%", once: true },
        });
        gsap.from(".cs-logos", {
          y: 32, opacity: 0, scale: 0.97, duration: 0.85, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: clientsSection, start: "top 65%", once: true },
        });
      }
    },

  splitTextReveal(element) {
      if (typeof gsap === "undefined") return;
      const text = element.textContent;
      element.innerHTML = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.className = "split-char";
        span.textContent = char === " " ? "\u00A0" : char;
        element.appendChild(span);
      });

      gsap.to(element.querySelectorAll(".split-char"), {
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "power3.out",
      });
    },

    /* ---------- Parallax ---------- */
    initParallax() {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

      gsap.utils.toArray(".parallax-layer").forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed) || 0.5;
        gsap.to(layer, {
          scrollTrigger: {
            trigger: layer.parentElement || layer,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: () => window.innerHeight * speed * 0.2,
          ease: "none",
        });
      });
    },

    /* ---------- Mouse Movement Parallax ---------- */
    initMouseParallax() {
      const hero = document.querySelector(".hero");
      const layers = document.querySelectorAll(".hero [data-mouse-parallax]");
      if (!hero || !layers.length) return;

      hero.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const { width, height } = hero.getBoundingClientRect();
        const x = (clientX / width - 0.5) * 2;
        const y = (clientY / height - 0.5) * 2;

        layers.forEach((layer) => {
          const depth = parseFloat(layer.dataset.mouseParallax) || 10;
          layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
      });
    },

    /* ---------- Hero 3D Globe ---------- */
    initHeroGlobe() {
      if (typeof window.SyntrixHeroGlobe === "function") {
        window.SyntrixHeroGlobe(this);
      }
    },

    /* ---------- Hero Data Flow (legacy) ---------- */
    initHeroDataFlow() {
      const canvas = document.getElementById("hero-dataflow");
      const hero = document.getElementById("hero");
      if (!canvas || !hero || prefersReducedMotion) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      const glowCanvas = document.createElement("canvas");
      const glowCtx = glowCanvas.getContext("2d");

      const nodeLayout = [
        { x: 0.55, y: 0.5, hub: true },
        { x: 0.65, y: 0.26, hub: true },
        { x: 0.76, y: 0.2 },
        { x: 0.9, y: 0.28 },
        { x: 0.96, y: 0.44 },
        { x: 0.92, y: 0.58 },
        { x: 0.8, y: 0.5 },
        { x: 0.7, y: 0.64 },
        { x: 0.84, y: 0.74 },
        { x: 0.94, y: 0.8 },
        { x: 0.6, y: 0.36 },
        { x: 0.58, y: 0.7 },
        { x: 0.74, y: 0.4 },
        { x: 0.86, y: 0.66 },
      ];
      const edgePairs = [
        [0, 1], [0, 2], [0, 6], [0, 10], [0, 11], [1, 2], [1, 10], [2, 3],
        [2, 12], [3, 4], [3, 12], [4, 5], [4, 13], [5, 6], [5, 8], [6, 7],
        [7, 8], [7, 11], [8, 9], [8, 13], [10, 12], [12, 13],
      ];

      let width = 0;
      let height = 0;
      let nodes = [];
      let edges = [];
      let packets = [];
      let streams = [];
      let sparks = [];
      let tick = 0;
      let lastTime = 0;
      let mouse = { x: 0.75, y: 0.5, on: false };
      const isHeroVisible = this.observeHeroVisibility(hero);

      const spawnPacket = () => {
        const edge = edges[Math.floor(Math.random() * edges.length)];
        if (!edge) return;
        packets.push({
          edge,
          t: Math.random(),
          speed: 0.0009 + Math.random() * 0.0014,
          reverse: Math.random() > 0.4,
          color: Math.random() > 0.45 ? "cyan" : "magenta",
        });
      };

      const applyResize = () => {
        const rect = hero.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        width = Math.floor(rect.width);
        height = Math.floor(rect.height);
        canvas.width = glowCanvas.width = Math.floor(width * dpr);
        canvas.height = glowCanvas.height = Math.floor(height * dpr);
        canvas.style.width = glowCanvas.style.width = `${width}px`;
        canvas.style.height = glowCanvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        glowCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        nodes = nodeLayout.map((n) => ({
          x: n.x * width,
          y: n.y * height,
          hub: !!n.hub,
          phase: Math.random() * Math.PI * 2,
        }));
        edges = edgePairs.map(([a, b]) => ({ a, b }));

        packets = [];
        for (let i = 0; i < 55; i++) spawnPacket();

        streams = Array.from({ length: 22 }, (_, i) => ({
          y: height * (0.18 + (i / 16) * 0.7),
          x: width * (0.44 + Math.random() * 0.12),
          speed: 1.5 + Math.random() * 3,
          len: 50 + Math.random() * 110,
          hue: i % 2,
        }));

        sparks = Array.from({ length: 24 }, () => ({
          x: width * (0.5 + Math.random() * 0.48),
          y: Math.random() * height,
          vy: 0.15 + Math.random() * 0.4,
          r: 0.5 + Math.random() * 1.5,
        }));
      };

      const drawEdge = (c, a, b, alpha, w) => {
        const n1 = nodes[a];
        const n2 = nodes[b];
        if (!n1 || !n2) return;
        const g = c.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        g.addColorStop(0, `rgba(99,102,241,${alpha * 0.55})`);
        g.addColorStop(0.5, `rgba(34,211,238,${alpha})`);
        g.addColorStop(1, `rgba(236,72,153,${alpha * 0.65})`);
        c.strokeStyle = g;
        c.lineWidth = w;
        c.beginPath();
        c.moveTo(n1.x, n1.y);
        c.lineTo(n2.x, n2.y);
        c.stroke();
      };

      const drawEdgePulse = (c, a, b, phase) => {
        const n1 = nodes[a];
        const n2 = nodes[b];
        if (!n1 || !n2) return;
        const len = Math.hypot(n2.x - n1.x, n2.y - n1.y);
        const seg = len * 0.14;
        const t = phase % 1;
        const t0 = Math.max(0, t - seg / len);
        const x1 = n1.x + (n2.x - n1.x) * t0;
        const y1 = n1.y + (n2.y - n1.y) * t0;
        const x2 = n1.x + (n2.x - n1.x) * t;
        const y2 = n1.y + (n2.y - n1.y) * t;
        const grad = c.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "rgba(34,211,238,0)");
        grad.addColorStop(0.4, "rgba(34,211,238,0.9)");
        grad.addColorStop(1, "#fff");
        c.strokeStyle = grad;
        c.lineWidth = 3;
        c.lineCap = "round";
        c.globalAlpha = 0.85;
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.stroke();
        c.globalAlpha = 1;
      };

      const drawPacket = (c, pkt, glow) => {
        const { a, b } = pkt.edge;
        const n1 = nodes[a];
        const n2 = nodes[b];
        if (!n1 || !n2) return;
        const t = pkt.reverse ? 1 - pkt.t : pkt.t;
        const x = n1.x + (n2.x - n1.x) * t;
        const y = n1.y + (n2.y - n1.y) * t;
        const t0 = Math.max(0, t - 0.16);
        const x0 = n1.x + (n2.x - n1.x) * t0;
        const y0 = n1.y + (n2.y - n1.y) * t0;
        const rgb = pkt.color === "magenta" ? "244,114,182" : "34,211,238";
        const core = pkt.color === "magenta" ? "#fda4af" : "#67e8f9";

        c.lineCap = "round";
        if (glow) {
          c.globalAlpha = 0.75;
          c.strokeStyle = `rgba(${rgb},0.95)`;
          c.lineWidth = 8;
          c.beginPath();
          c.moveTo(x0, y0);
          c.lineTo(x, y);
          c.stroke();
          return;
        }
        const grad = c.createLinearGradient(x0, y0, x, y);
        grad.addColorStop(0, `rgba(${rgb},0)`);
        grad.addColorStop(0.5, `rgba(${rgb},0.75)`);
        grad.addColorStop(1, core);
        c.globalAlpha = 1;
        c.lineWidth = 3.2;
        c.strokeStyle = grad;
        c.beginPath();
        c.moveTo(x0, y0);
        c.lineTo(x, y);
        c.stroke();
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(x, y, 4.5, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = core;
        c.beginPath();
        c.arc(x, y, 1.5, 0, Math.PI * 2);
        c.fill();
      };

      const draw = (now) => {
        requestAnimationFrame(draw);
        if (document.hidden || !isHeroVisible() || width < 1) return;

        const dt = lastTime ? Math.min(40, now - lastTime) : 16.67;
        lastTime = now;
        tick += 1;

        glowCtx.clearRect(0, 0, width, height);
        glowCtx.globalCompositeOperation = "lighter";

        const vpX = width * 0.8;
        const vpY = height * 0.48;
        const panel = glowCtx.createLinearGradient(width * 0.35, 0, width, 0);
        panel.addColorStop(0, "rgba(5,5,12,0)");
        panel.addColorStop(0.35, "rgba(8,8,20,0.35)");
        panel.addColorStop(1, "rgba(12,10,28,0.55)");
        glowCtx.fillStyle = panel;
        glowCtx.fillRect(width * 0.32, 0, width * 0.68, height);

        const amb = glowCtx.createRadialGradient(vpX, vpY, 0, vpX, vpY, width * 0.55);
        amb.addColorStop(0, "rgba(34,211,238,0.35)");
        amb.addColorStop(0.4, "rgba(168,85,247,0.2)");
        amb.addColorStop(1, "rgba(0,0,0,0)");
        glowCtx.fillStyle = amb;
        glowCtx.fillRect(width * 0.35, 0, width * 0.65, height);

        edges.forEach((e) => drawEdge(glowCtx, e.a, e.b, 0.55, 2));

        streams.forEach((s) => {
          s.x += s.speed * (dt * 0.09);
          if (s.x > width) s.x = width * 0.4;
          const rgb = s.hue ? "244,114,182" : "34,211,238";
          glowCtx.strokeStyle = `rgba(${rgb},0.55)`;
          glowCtx.lineWidth = 1.8;
          glowCtx.beginPath();
          glowCtx.moveTo(s.x, s.y);
          glowCtx.lineTo(s.x + s.len, s.y);
          glowCtx.stroke();
        });

        packets.forEach((pkt) => {
          pkt.t += pkt.speed * dt * (mouse.on ? 1.35 : 1);
          if (pkt.t > 1) {
            pkt.t = 0;
            pkt.edge = edges[Math.floor(Math.random() * edges.length)];
          }
          drawPacket(glowCtx, pkt, true);
        });

        if (tick % 6 === 0) spawnPacket();
        if (packets.length > 55) packets.length = 55;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.filter = "blur(14px) saturate(1.6) brightness(1.35)";
        ctx.globalAlpha = 0.98;
        ctx.drawImage(glowCanvas, 0, 0, width, height);
        ctx.restore();

        ctx.globalCompositeOperation = "lighter";
        edges.forEach((e) => drawEdge(ctx, e.a, e.b, 0.65, 1.8));
        edges.forEach((e, i) => drawEdgePulse(ctx, e.a, e.b, (tick * 0.008 + i * 0.11) % 1));
        packets.forEach((pkt) => drawPacket(ctx, pkt, false));

        sparks.forEach((s) => {
          s.y -= s.vy * dt;
          if (s.y < 0) {
            s.y = height + 10;
            s.x = width * (0.5 + Math.random() * 0.48);
          }
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        nodes.forEach((n) => {
          n.phase += 0.05;
          const r = (n.hub ? 6 : 4.5) + Math.sin(n.phase) * 2;
          const ring = r + (n.hub ? 20 : 12);
          if (n.hub) {
            const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, ring);
            g.addColorStop(0, "rgba(34,211,238,0.55)");
            g.addColorStop(0.5, "rgba(168,85,247,0.25)");
            g.addColorStop(1, "rgba(34,211,238,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(n.x, n.y, ring, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.strokeStyle = `rgba(34,211,238,${0.2 + Math.sin(n.phase) * 0.15})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, ring, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = n.hub ? "#c084fc" : "#22d3ee";
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalCompositeOperation = "source-over";
      };

      let resizeRaf = 0;
      applyResize();
      requestAnimationFrame(draw);
      window.addEventListener("resize", () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(applyResize);
      }, { passive: true });
      hero.addEventListener("mousemove", (e) => {
        const r = hero.getBoundingClientRect();
        mouse.x = (e.clientX - r.left) / r.width;
        mouse.y = (e.clientY - r.top) / r.height;
        mouse.on = true;
      }, { passive: true });
      hero.addEventListener("mouseleave", () => { mouse.on = false; });
    },

    /* ---------- Hero Canvas (connected particles) ---------- */
    initHeroCanvas() {
      const canvas = document.getElementById("hero-canvas");
      const hero = document.getElementById("hero");
      if (!canvas || !hero || prefersReducedMotion) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let particles = [];
      let mouse = { x: 0, y: 0, active: false };
      let rafId = null;
      const isHeroVisible = this.observeHeroVisibility(hero);

      const count = () => 32;
      const linkDist = () => 115;

      const resize = () => {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = Math.floor(rect.width);
        height = canvas.height = Math.floor(rect.height);
      };

      const spawn = () => {
        particles = Array.from({ length: count() }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.6,
        }));
      };

      const draw = () => {
        if (!isHeroVisible()) {
          rafId = requestAnimationFrame(draw);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        const dist = linkDist();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d = Math.hypot(dx, dy);
            if (d < 180) {
              p.x -= dx * 0.012;
              p.y -= dy * 0.012;
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(34, 211, 238, 0.75)";
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const d = Math.hypot(dx, dy);
            if (d < dist) {
              const alpha = (1 - d / dist) * 0.35;
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }

        rafId = requestAnimationFrame(draw);
      };

      resize();
      spawn();
      draw();

      window.addEventListener("resize", () => {
        resize();
        spawn();
      });

      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });

      hero.addEventListener("mouseleave", () => {
        mouse.active = false;
      });
    },

    /* ---------- Hero Network Mesh (hubs + data pulses) ---------- */
    initHeroNetwork() {
      const canvas = document.getElementById("hero-network");
      const hero = document.getElementById("hero");
      if (!canvas || !hero || prefersReducedMotion) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let nodes = [];
      let edges = [];
      let pulses = [];
      let tick = 0;
      const isHeroVisible = this.observeHeroVisibility(hero);

      const layout = [
        { x: 0.72, y: 0.28 },
        { x: 0.88, y: 0.22 },
        { x: 0.94, y: 0.42 },
        { x: 0.82, y: 0.52 },
        { x: 0.68, y: 0.48 },
        { x: 0.76, y: 0.68 },
        { x: 0.9, y: 0.72 },
        { x: 0.58, y: 0.62 },
        { x: 0.62, y: 0.38 },
        { x: 0.5, y: 0.5 },
      ];

      const edgePairs = [
        [0, 1], [0, 2], [0, 4], [0, 8], [1, 2], [1, 3], [2, 3], [2, 6],
        [3, 4], [3, 5], [3, 7], [4, 5], [4, 8], [5, 6], [5, 7], [7, 8], [8, 9], [4, 9],
      ];

      const resize = () => {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = Math.floor(rect.width);
        height = canvas.height = Math.floor(rect.height);
        nodes = layout.map((n) => ({ x: n.x * width, y: n.y * height, pulse: Math.random() * Math.PI * 2 }));
        edges = edgePairs.map(([a, b]) => ({ a, b }));
      };

      const spawnPulse = () => {
        if (!edges.length) return;
        const edge = edges[Math.floor(Math.random() * edges.length)];
        pulses.push({
          edge,
          t: 0,
          speed: 0.004 + Math.random() * 0.006,
          reverse: Math.random() > 0.5,
        });
        if (pulses.length > 10) pulses.shift();
      };

      const drawEdge = (a, b, alpha) => {
        const n1 = nodes[a];
        const n2 = nodes[b];
        const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        grad.addColorStop(0, `rgba(168, 85, 247, ${alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(34, 211, 238, ${alpha})`);
        grad.addColorStop(1, `rgba(168, 85, 247, ${alpha * 0.5})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      };

      const draw = () => {
        if (!isHeroVisible()) {
          requestAnimationFrame(draw);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        tick += 1;

        edges.forEach((e) => drawEdge(e.a, e.b, 0.22));

        pulses = pulses.filter((p) => {
          p.t += p.speed;
          if (p.t > 1) return false;
          const { a, b } = p.edge;
          const n1 = nodes[a];
          const n2 = nodes[b];
          const t = p.reverse ? 1 - p.t : p.t;
          const x = n1.x + (n2.x - n1.x) * t;
          const y = n1.y + (n2.y - n1.y) * t;

          drawEdge(a, b, 0.45);

          const trailT = Math.max(0, t - 0.08);
          const tx = n1.x + (n2.x - n1.x) * trailT;
          const ty = n1.y + (n2.y - n1.y) * trailT;
          ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "#22d3ee";
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
          return true;
        });

        nodes.forEach((n, i) => {
          n.pulse += 0.04;
          const r = 4 + Math.sin(n.pulse) * 1.5;
          const isHub = i === 0 || i === 3;

          ctx.beginPath();
          ctx.arc(n.x, n.y, r + (isHub ? 10 : 6), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 + Math.sin(n.pulse) * 0.04})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = isHub ? "#6366f1" : "#22d3ee";
          ctx.fill();

          if (isHub) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        if (tick % 24 === 0) spawnPulse();

        if (tick % 90 === 0) {
          const hub = nodes[0];
          if (hub) {
            ctx.beginPath();
            ctx.arc(hub.x, hub.y, 40 + Math.sin(tick * 0.05) * 8, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        requestAnimationFrame(draw);
      };

      resize();
      for (let i = 0; i < 6; i++) spawnPulse();
      draw();

      window.addEventListener("resize", resize);
    },

    /* ---------- Hero Data Stream (vertical code rain) ---------- */
    initHeroDataStream() {
      const canvas = document.getElementById("hero-data-stream");
      const hero = document.getElementById("hero");
      if (!canvas || !hero || prefersReducedMotion) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const chars = "01アイウネクスIT{}[]<>/\\|#@$%&*";
      let width = 0;
      let height = 0;
      let columns = [];
      let fontSize = 14;
      const isHeroVisible = this.observeHeroVisibility(hero);

      const resize = () => {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = Math.floor(rect.width);
        height = canvas.height = Math.floor(rect.height);
        fontSize = window.innerWidth < 768 ? 11 : 14;
        const colCount = Math.min(18, Math.floor((width * 0.4) / fontSize));
        const startX = Math.floor(width * 0.55);
        columns = Array.from({ length: colCount }, (_, i) => ({
          x: startX + i * fontSize,
          y: Math.random() * height,
          speed: 0.6 + Math.random() * 1.4,
          char: chars[Math.floor(Math.random() * chars.length)],
        }));
      };

      const draw = () => {
        if (!isHeroVisible()) {
          requestAnimationFrame(draw);
          return;
        }

        ctx.fillStyle = "rgba(5, 5, 8, 0.08)";
        ctx.fillRect(width * 0.5, 0, width * 0.5, height);

        ctx.font = `${fontSize}px monospace`;
        columns.forEach((col) => {
          col.y += col.speed;
          if (col.y > height + 40) {
            col.y = -20;
            col.speed = 0.6 + Math.random() * 1.4;
          }
          if (Math.random() > 0.96) {
            col.char = chars[Math.floor(Math.random() * chars.length)];
          }
          ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
          ctx.fillText(col.char, col.x, col.y);
          ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
          ctx.fillText(col.char, col.x, col.y - fontSize);
        });

        requestAnimationFrame(draw);
      };

      resize();
      draw();
      window.addEventListener("resize", resize);
    },

    /* ---------- Hero Shooting Stars ---------- */
    initShootingStars() {
      const container = document.getElementById("hero-shooting-stars");
      if (!container || prefersReducedMotion) return;

      const createStar = () => {
        const star = document.createElement("span");
        star.className = "shooting-star";
        star.style.left = 42 + Math.random() * 55 + "%";
        star.style.top = Math.random() * 55 + "%";
        star.style.animationDelay = Math.random() * 6 + "s";
        star.style.animationDuration = 4 + Math.random() * 4 + "s";
        container.appendChild(star);
        setTimeout(() => star.remove(), 9000);
      };

      for (let i = 0; i < 4; i++) createStar();
      setInterval(createStar, 4000);
    },

    /* ---------- Hero Particles ---------- */
    initParticles() {
      const container = document.getElementById("hero-particles");
      if (!container || prefersReducedMotion) return;

      for (let i = 0; i < 22; i++) {
        const p = document.createElement("div");
        p.className = i % 5 === 0 ? "particle particle--lg" : "particle";
        p.style.left = 40 + Math.random() * 60 + "%";
        p.style.top = Math.random() * 100 + "%";
        p.style.animationDelay = Math.random() * 5 + "s";
        p.style.animation = `float ${4 + Math.random() * 5}s ease-in-out infinite`;
        container.appendChild(p);
      }
    },

    /* ---------- SVG Morph on Hover ---------- */
    initSVGMorph() {
      document.querySelectorAll(".morph-svg").forEach((svg) => {
        const path = svg.querySelector(".morph-path");
        if (!path) return;

        const d1 = path.getAttribute("d");
        const d2 = path.dataset.morphD;
        if (!d2) return;

        svg.closest(".service-card, .glass-card")?.addEventListener("mouseenter", () => {
          path.setAttribute("d", d2);
        });
        svg.closest(".service-card, .glass-card")?.addEventListener("mouseleave", () => {
          path.setAttribute("d", d1);
        });
      });
    },
  };

  const start = () => SyntrixAnimations.init();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh(true);
    }
  });

  window.SyntrixAnimations = SyntrixAnimations;
})();
