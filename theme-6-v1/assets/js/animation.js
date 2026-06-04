/**
 * NexusIT Theme — Animation JavaScript
 * GSAP, ScrollTrigger, AOS, Swiper, Lottie
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 991px)").matches;
  const isLowPower = prefersReducedMotion || isMobile || navigator.connection?.saveData;

  const NexusAnimations = {
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
        window.addEventListener("nexusit:loaded", run, { once: true });
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
      }

      document.body.classList.add("animations-ready");

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh(true);
      }
    },

    scheduleHeroEffects() {
      if (isLowPower) return;

      const run = () => {
        if (window.innerWidth >= 992) {
          this.initHeroCanvas();
          this.initHeroNetwork();
          this.initHeroDataStream();
        }
        this.initShootingStars();
        this.initParticles();
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(run, { timeout: 1200 });
      } else {
        setTimeout(run, 400);
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

      const targets = gsap.utils.toArray(
        ".hero-badge, .hero-title .line, .hero-subtitle, .hero-cta > *, .hero-stats .hero-stat, .hero-scroll, #hero-lottie"
      );
      if (!targets.length) return;

      gsap.from(targets, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        overwrite: "auto",
      });
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
        star.style.left = Math.random() * 70 + "%";
        star.style.top = Math.random() * 45 + "%";
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
        p.style.left = Math.random() * 100 + "%";
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

  const start = () => NexusAnimations.init();

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

  window.NexusAnimations = NexusAnimations;
})();
