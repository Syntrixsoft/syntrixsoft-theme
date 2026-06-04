/**
 * SyntrixSoft Theme — Main JavaScript
 * Modular, Django-template ready
 */

(function () {
  "use strict";

  const SyntrixSoft = {
    init() {
      this.preloader();
      this.navbar();
      this.megaMenu();
      this.mobileMenu();
      this.themeToggle();
      this.customCursor();
      this.backToTop();
      this.searchPopup();
      this.magneticButtons();
      this.smoothScroll();
      this.lazyLoad();
      this.pageTransition();
      this.typewriter();
      this.counterStats();
      this.tiltCards();
      this.footerYear();
      this.newsletterForm();
      this.contactFormTeaser();
      this.contactForm();
      this.portfolioFilter();
      this.portfolioModal();
      this.blogFilter();
      this.careersApply();
    },

    /* ---------- Preloader ---------- */
    preloader() {
      const loader = document.getElementById("page-loader");
      const progress = document.querySelector(".loader-progress");
      const percent = document.querySelector(".loader-percent");
      if (!loader) return;

      let value = 0;
      let done = false;
      const started = performance.now();
      const MAX_MS = 1000;

      const finish = () => {
        if (done) return;
        done = true;
        if (progress) progress.style.width = "100%";
        if (percent) percent.textContent = "100%";
        loader.classList.add("hidden");
        document.body.classList.remove("no-scroll");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.dispatchEvent(new Event("syntrixsoft:loaded"));
          });
        });
      };

      const interval = setInterval(() => {
        value += 12 + Math.random() * 10;
        if (value >= 100 || performance.now() - started > MAX_MS) {
          value = 100;
          clearInterval(interval);
          setTimeout(finish, 150);
        } else {
          if (progress) progress.style.width = value + "%";
          if (percent) percent.textContent = Math.floor(value) + "%";
        }
      }, 70);

      window.addEventListener("load", () => setTimeout(finish, 120), { once: true });
    },

    /* ---------- Navbar Scroll ---------- */
    navbar() {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;

      const onScroll = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      const path = window.location.pathname;
      const page = path.split("/").pop();
      const isHome =
        !page ||
        page === "index.html" ||
        path.endsWith("/");

      document
        .querySelectorAll(".navbar-nav .nav-link, .mobile-nav .mobile-nav-link")
        .forEach((link) => {
          link.classList.remove("active");
          const href = (link.getAttribute("href") || "").split("#")[0];
          if (!href) return;

          const homeHref =
            href === "index.html" || href === "./" || href === "/" || href === "./index.html";

          if (isHome && homeHref) {
            link.classList.add("active");
          } else if (!isHome && href === page) {
            link.classList.add("active");
          }
        });
    },

    /* ---------- Mega Menu (hover bridge) ---------- */
    megaMenu() {
      const item = document.querySelector(".nav-item.has-mega");
      const menu = item?.querySelector(".mega-menu");
      if (!item || !menu || window.matchMedia("(max-width: 991px)").matches) return;

      let closeTimer = null;
      const OPEN_DELAY = 0;
      const CLOSE_DELAY = 200;

      const open = () => {
        clearTimeout(closeTimer);
        item.classList.add("mega-open");
      };

      const scheduleClose = () => {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          item.classList.remove("mega-open");
        }, CLOSE_DELAY);
      };

      const bind = (el) => {
        el.addEventListener("mouseenter", () => {
          clearTimeout(closeTimer);
          setTimeout(open, OPEN_DELAY);
        });
        el.addEventListener("mouseleave", scheduleClose);
        el.addEventListener("focusin", open);
        el.addEventListener("focusout", (e) => {
          if (!item.contains(e.relatedTarget)) scheduleClose();
        });
      };

      bind(item);
      bind(menu);

      menu.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          item.classList.remove("mega-open");
          item.querySelector(".nav-link")?.focus();
        }
      });
    },

    /* ---------- Mobile Menu ---------- */
    mobileMenu() {
      const toggler = document.querySelector(".navbar-toggler");
      const menu = document.querySelector(".mobile-menu");
      const panel = document.querySelector(".mobile-menu-panel");
      const backdrop = document.querySelector(".mobile-menu-backdrop");
      const links = document.querySelectorAll(".mobile-nav-link");

      if (!toggler || !menu) return;

      const close = () => {
        toggler.classList.remove("active");
        toggler.setAttribute("aria-expanded", "false");
        menu.classList.remove("active");
        panel?.classList.remove("active");
        menu.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
        links.forEach((l) => l.classList.remove("revealed"));
      };

      const open = () => {
        toggler.classList.add("active");
        toggler.setAttribute("aria-expanded", "true");
        menu.classList.add("active");
        panel?.classList.add("active");
        menu.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        links.forEach((l, i) => {
          setTimeout(() => l.classList.add("revealed"), 80 * i);
        });
      };

      toggler.setAttribute("aria-expanded", "false");
      toggler.setAttribute("aria-controls", "mobile-menu-panel");

      toggler.addEventListener("click", () => {
        menu.classList.contains("active") ? close() : open();
      });

      backdrop?.addEventListener("click", close);
      links.forEach((link) => link.addEventListener("click", close));

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("active")) close();
      });

      window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 992px)").matches && menu.classList.contains("active")) {
          close();
        }
      });
    },

    /* ---------- Theme Toggle ---------- */
    themeToggle() {
      const toggle = document.querySelector(".theme-toggle");
      if (!toggle) return;

      const saved = localStorage.getItem("syntrixsoft-theme");
      if (saved) document.documentElement.setAttribute("data-theme", saved);

      toggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";
        if (next === "dark") {
          document.documentElement.removeAttribute("data-theme");
          localStorage.setItem("syntrixsoft-theme", "dark");
        } else {
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("syntrixsoft-theme", "light");
        }
      });
    },

    /* ---------- Custom Cursor ---------- */
    customCursor() {
      const cursor = document.querySelector(".custom-cursor");
      if (!cursor || window.matchMedia("(max-width: 991px)").matches) return;

      const dot = cursor.querySelector(".cursor-dot");
      const ring = cursor.querySelector(".cursor-ring");
      let mouseX = 0;
      let mouseY = 0;
      let ringX = 0;
      let ringY = 0;
      let rafId = null;
      let idleTimer = null;

      const animateRing = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
        rafId = requestAnimationFrame(animateRing);
      };

      const startLoop = () => {
        if (!rafId) rafId = requestAnimationFrame(animateRing);
      };

      const stopLoop = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      document.addEventListener(
        "mousemove",
        (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          dot.style.left = mouseX + "px";
          dot.style.top = mouseY + "px";
          startLoop();
          clearTimeout(idleTimer);
          idleTimer = setTimeout(stopLoop, 140);
        },
        { passive: true }
      );

      const interactive = "a, button, .btn-primary, .btn-outline, .icon-btn, .service-card, .portfolio-card";
      document.querySelectorAll(interactive).forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
      });
    },

    /* ---------- Back to Top ---------- */
    backToTop() {
      const btn = document.querySelector(".back-to-top");
      if (!btn) return;

      window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 600);
      }, { passive: true });

      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },

    /* ---------- Search Popup ---------- */
    searchPopup() {
      const popup = document.querySelector(".search-popup");
      const openBtn = document.querySelector(".search-toggle");
      const closeBtn = document.querySelector(".search-close");
      const input = popup?.querySelector("input");

      if (!popup) return;

      const open = () => {
        popup.classList.add("active");
        document.body.classList.add("no-scroll");
        setTimeout(() => input?.focus(), 300);
      };

      const close = () => {
        popup.classList.remove("active");
        document.body.classList.remove("no-scroll");
      };

      openBtn?.addEventListener("click", open);
      closeBtn?.addEventListener("click", close);

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          popup.classList.contains("active") ? close() : open();
        }
      });
    },

    /* ---------- Magnetic Buttons ---------- */
    magneticButtons() {
      document.querySelectorAll(".btn-magnetic").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "";
        });
      });
    },

    /* ---------- Smooth Scroll ---------- */
    smoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const targetId = anchor.getAttribute("href");
          if (targetId === "#") return;
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      });
    },

    /* ---------- Lazy Load ---------- */
    lazyLoad() {
      if ("loading" in HTMLImageElement.prototype) {
        document.querySelectorAll("img[loading='lazy']").forEach((img) => {
          if (img.dataset.src) img.src = img.dataset.src;
        });
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
        document.body.appendChild(script);
      }
    },

    /* ---------- Page Transition ---------- */
    pageTransition() {
      const overlay = document.querySelector(".page-transition");
      if (!overlay) return;

      document.querySelectorAll('a[href$=".html"]').forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#")) return;
        if (link.target === "_blank") return;

        link.addEventListener("click", (e) => {
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          overlay.classList.add("active");
          setTimeout(() => {
            window.location.href = href;
          }, 500);
        });
      });
    },

    /* ---------- Typewriter ---------- */
    typewriter() {
      const el = document.querySelector(".typewriter");
      if (!el) return;

      const words = (el.dataset.words || "Cloud Solutions,AI Innovation,Digital Excellence").split(",");
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const type = () => {
        const current = words[wordIndex % words.length].trim();
        const text = isDeleting
          ? current.substring(0, charIndex - 1)
          : current.substring(0, charIndex + 1);

        el.innerHTML = text + '<span class="typewriter-cursor">|</span>';

        if (!isDeleting) {
          charIndex++;
          if (charIndex === current.length + 1) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
          }
        } else {
          charIndex--;
          if (charIndex === 0) {
            isDeleting = false;
            wordIndex++;
          }
        }

        setTimeout(type, isDeleting ? 50 : 100);
      };

      setTimeout(type, 1500);
    },

    /* ---------- Counter Stats ---------- */
    counterStats() {
      const counters = document.querySelectorAll("[data-count]");
      if (!counters.length) return;

      const animate = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.floor(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target + suffix;
        };

        requestAnimationFrame(update);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((c) => observer.observe(c));
    },

    /* ---------- 3D Tilt Cards ---------- */
    tiltCards() {
      if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

      document.querySelectorAll(".tilt-card").forEach((card) => {
        const inner = card.querySelector(".tilt-card-inner") || card;

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          inner.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
        });

        card.addEventListener("mouseleave", () => {
          inner.style.transform = "";
        });
      });
    },

    /* ---------- Footer Year ---------- */
    footerYear() {
      const yearEl = document.getElementById("footer-year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    },

    /* ---------- Newsletter ---------- */
    newsletterForm() {
      document.querySelectorAll(".newsletter-form").forEach((form) => {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector("input[type='email']");
          if (input?.value) {
            form.reset();
            alert("Thank you for subscribing!");
          }
        });
      });
    },

    /* ---------- Contact Teaser Form ---------- */
    contactFormTeaser() {
      const form = document.querySelector(".contact-teaser-form");
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        form.reset();
        alert("Message sent! We will get back to you soon.");
      });
    },

    contactForm() {
      const form = document.querySelector(".contact-page-form");
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        form.reset();
        alert("Thank you! Your message has been sent successfully.");
      });
    },

    portfolioFilter() {
      const buttons = document.querySelectorAll(".filter-btn");
      const items = document.querySelectorAll(".portfolio-item");
      if (!buttons.length || !items.length) return;

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const filter = btn.dataset.filter;

          items.forEach((item) => {
            const cat = item.dataset.category;
            const show = filter === "all" || cat === filter;
            item.classList.toggle("hidden", !show);
          });
        });
      });
    },

    portfolioModal() {
      const modal = document.getElementById("project-modal");
      if (!modal) return;

      const backdrop = modal.querySelector(".project-modal-backdrop");
      const closeBtn = modal.querySelector(".project-modal-close");
      const title = modal.querySelector(".modal-title");
      const desc = modal.querySelector(".modal-desc");
      const img = modal.querySelector(".modal-image");
      const client = modal.querySelector(".modal-client");
      const year = modal.querySelector(".modal-year");

      const open = (btn) => {
        if (title) title.textContent = btn.dataset.title || "";
        if (desc) desc.textContent = btn.dataset.desc || "";
        if (img) img.src = btn.dataset.image || "";
        if (img) img.alt = btn.dataset.title || "";
        if (client) client.textContent = btn.dataset.client || "";
        if (year) year.textContent = btn.dataset.year || "";
        modal.classList.add("active");
        document.body.classList.add("no-scroll");
      };

      const close = () => {
        modal.classList.remove("active");
        document.body.classList.remove("no-scroll");
      };

      document.querySelectorAll("[data-modal]").forEach((btn) => {
        btn.addEventListener("click", () => open(btn));
      });

      closeBtn?.addEventListener("click", close);
      backdrop?.addEventListener("click", close);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) close();
      });
    },

    blogFilter() {
      const buttons = document.querySelectorAll(".blog-filter-btn");
      const items = document.querySelectorAll(".blog-item");
      if (!buttons.length || !items.length) return;

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const filter = btn.dataset.filter;

          items.forEach((item) => {
            const cat = item.dataset.category;
            item.classList.toggle("hidden", filter !== "all" && cat !== filter);
          });
        });
      });
    },

    careersApply() {
      document.querySelectorAll(".job-apply-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const title = btn.dataset.job || "this position";
          window.location.href = "contact.html?role=" + encodeURIComponent(title);
        });
      });
    },
  };

  const boot = () => {
    document.body.classList.add("no-scroll");
    SyntrixSoft.init();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.SyntrixSoft = SyntrixSoft;
})();
