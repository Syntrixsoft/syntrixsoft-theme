#!/usr/bin/env python3
"""Generate SyntrixSoft service detail HTML pages and update links."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

MEGA_GRID = """              <motion class="mega-grid">
                <a href="service-web.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-code-slash" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>Web Development</h4><p>Scalable web applications</p></span>
                </a>
                <a href="service-mobile.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-phone" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>Mobile Apps</h4><p>iOS &amp; Android solutions</p></span>
                </a>
                <a href="service-cloud.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-cloud" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>Cloud Solutions</h4><p>AWS, Azure, GCP</p></span>
                </a>
                <a href="service-ai.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-cpu" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>AI Solutions</h4><p>Machine learning &amp; NLP</p></span>
                </a>
                <a href="service-devops.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-gear-wide-connected" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>DevOps</h4><p>CI/CD &amp; automation</p></span>
                </a>
                <a href="service-uiux.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-palette" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>UI/UX Design</h4><p>User-centered design</p></span>
                </a>
                <a href="service-security.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-shield-lock" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>Cybersecurity</h4><p>Zero-trust &amp; compliance</p></span>
                </a>
                <a href="service-data.html" class="mega-item" role="menuitem">
                  <span class="mega-item-icon"><i class="bi bi-graph-up-arrow" aria-hidden="true"></i></span>
                  <span class="mega-item-body"><h4>Data Analytics</h4><p>BI &amp; dashboards</p></span>
                </a>
              </motion>"""

MEGA_GRID = MEGA_GRID.replace("<motion", "<div").replace("</motion>", "</div>")

LINK_MAP = {
    'href="services.html#web"': 'href="service-web.html"',
    'href="services.html#mobile"': 'href="service-mobile.html"',
    'href="services.html#cloud"': 'href="service-cloud.html"',
    'href="services.html#ai"': 'href="service-ai.html"',
    'href="services.html#devops"': 'href="service-devops.html"',
    'href="services.html#uiux"': 'href="service-uiux.html"',
    'href="services.html#security"': 'href="service-security.html"',
    'href="services.html#data"': 'href="service-data.html"',
}

SERVICES = [
    {
        "file": "service-web.html",
        "title": "Web Development",
        "gradient": "Development",
        "icon": "bi-code-slash",
        "meta": "Enterprise web development — React, Next.js, scalable platforms by SyntrixSoft.",
        "lead": "We build high-performance web applications, design systems, and digital platforms that scale with your business.",
        "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
        "image_alt": "Web development workspace",
        "benefits": [
            ("bi-lightning-charge", "Blazing Performance", "Core Web Vitals, edge caching, and optimized bundles."),
            ("bi-shield-check", "Secure by Design", "OWASP practices, auth hardening, and audit-ready code."),
            ("bi-diagram-3", "Scalable Architecture", "Microservices, APIs, and cloud-native patterns."),
            ("bi-universal-access", "Accessibility", "WCAG-compliant interfaces for every user."),
            ("bi-search", "SEO Ready", "Semantic markup, structured data, and fast indexing."),
            ("bi-puzzle", "Integrations", "CRM, payments, analytics, and third-party APIs."),
        ],
        "process": [
            ("Discovery", "Requirements, user journeys, and technical feasibility."),
            ("Design & Build", "UI systems, sprint delivery, and continuous demos."),
            ("QA & Launch", "Automated tests, staging, and zero-downtime deploys."),
            ("Growth", "Monitoring, A/B tests, and iterative improvements."),
        ],
        "tech": ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "PostgreSQL"],
        "related": [("service-mobile.html", "bi-phone", "Mobile Apps"), ("service-cloud.html", "bi-cloud", "Cloud Solutions"), ("service-uiux.html", "bi-palette", "UI/UX Design")],
    },
    {
        "file": "service-mobile.html",
        "title": "Mobile Development",
        "gradient": "Engineering",
        "icon": "bi-phone",
        "meta": "iOS and Android app development — native and cross-platform by SyntrixSoft.",
        "lead": "Ship polished mobile experiences with offline support, secure data, and analytics built in from day one.",
        "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
        "image_alt": "Mobile application on smartphone",
        "benefits": [
            ("bi-apple", "iOS Excellence", "Swift/SwiftUI apps tuned for Apple ecosystems."),
            ("bi-android2", "Android Native", "Kotlin apps with Material Design fidelity."),
            ("bi-arrow-repeat", "Cross-Platform", "Shared logic with React Native or Flutter when it fits."),
            ("bi-wifi-off", "Offline First", "Sync, caching, and resilient local storage."),
            ("bi-bell", "Engagement", "Push notifications, deep links, and in-app messaging."),
            ("bi-graph-up", "Analytics", "Funnels, crash reporting, and product telemetry."),
        ],
        "process": [
            ("Strategy", "Platform choice, MVP scope, and store requirements."),
            ("Prototype", "Interactive flows validated with real users."),
            ("Engineering", "Sprints, TestFlight/beta, and store submission support."),
            ("Operate", "Crash fixes, OS updates, and feature releases."),
        ],
        "tech": ["Swift", "Kotlin", "React Native", "Firebase", "Fastlane", "App Store Connect"],
        "related": [("service-web.html", "bi-code-slash", "Web Development"), ("service-uiux.html", "bi-palette", "UI/UX Design"), ("service-devops.html", "bi-gear-wide-connected", "DevOps")],
    },
    {
        "file": "service-cloud.html",
        "title": "Cloud Solutions",
        "gradient": "Solutions",
        "icon": "bi-cloud",
        "meta": "AWS, Azure, and GCP cloud migration and architecture by SyntrixSoft.",
        "lead": "Modernize infrastructure with secure landing zones, Kubernetes, serverless, and FinOps-aware operations.",
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        "image_alt": "Cloud infrastructure visualization",
        "benefits": [
            ("bi-cloud-upload", "Migration", "Lift-and-shift or refactor with minimal downtime."),
            ("bi-hdd-stack", "Kubernetes", "EKS, AKS, GKE clusters with GitOps delivery."),
            ("bi-currency-dollar", "FinOps", "Right-sizing, reserved instances, and cost dashboards."),
            ("bi-shield-lock", "Security", "IAM, encryption, and network segmentation."),
            ("bi-arrow-clockwise", "Resilience", "Multi-AZ, backups, and disaster recovery drills."),
            ("bi-speedometer2", "Observability", "Metrics, logs, traces, and SLO dashboards."),
        ],
        "process": [
            ("Assess", "Inventory workloads, dependencies, and compliance needs."),
            ("Architect", "Landing zones, networking, and target reference designs."),
            ("Migrate", "Phased cutovers with rollback plans."),
            ("Optimize", "Cost, performance, and security continuous improvement."),
        ],
        "tech": ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Docker"],
        "related": [("service-devops.html", "bi-gear-wide-connected", "DevOps"), ("service-security.html", "bi-shield-lock", "Cybersecurity"), ("service-data.html", "bi-graph-up-arrow", "Data Analytics")],
    },
    {
        "file": "service-ai.html",
        "title": "AI Solutions",
        "gradient": "Intelligence",
        "icon": "bi-cpu",
        "meta": "Enterprise AI, machine learning, and automation solutions by SyntrixSoft.",
        "lead": "Deploy responsible AI—from copilots and RAG to MLOps—that delivers measurable ROI and governance.",
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
        "image_alt": "Artificial intelligence concept",
        "benefits": [
            ("bi-robot", "AI Copilots", "Assistants embedded in your workflows and products."),
            ("bi-database", "RAG Systems", "Ground models on your docs with secure retrieval."),
            ("bi-diagram-2", "Automation", "Intelligent routing, classification, and extraction."),
            ("bi-clipboard-data", "MLOps", "Training pipelines, evaluation, and drift monitoring."),
            ("bi-lock", "Governance", "PII controls, audit logs, and policy guardrails."),
            ("bi-bar-chart", "Impact", "KPIs tied to efficiency, revenue, or risk reduction."),
        ],
        "process": [
            ("Use Cases", "Prioritize high-value problems with stakeholders."),
            ("Pilot", "Rapid prototypes with offline evaluation harnesses."),
            ("Production", "Hardened APIs, scaling, and human-in-the-loop review."),
            ("Scale", "Continuous learning, monitoring, and cost control."),
        ],
        "tech": ["Python", "OpenAI", "LangChain", "TensorFlow", "PyTorch", "Vector DBs"],
        "related": [("service-data.html", "bi-graph-up-arrow", "Data Analytics"), ("service-cloud.html", "bi-cloud", "Cloud Solutions"), ("service-web.html", "bi-code-slash", "Web Development")],
    },
    {
        "file": "service-devops.html",
        "title": "DevOps",
        "gradient": "SRE",
        "icon": "bi-gear-wide-connected",
        "meta": "DevOps, CI/CD, and site reliability engineering by SyntrixSoft.",
        "lead": "Automate delivery with GitOps, infrastructure as code, and SRE practices your teams can trust.",
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
        "image_alt": "DevOps server operations",
        "benefits": [
            ("bi-git", "CI/CD Pipelines", "Fast, reliable builds and progressive deployments."),
            ("bi-file-code", "Infrastructure as Code", "Terraform, Helm, and policy-as-code."),
            ("bi-bug", "Quality Gates", "Tests, scans, and approval workflows."),
            ("bi-activity", "SRE & SLOs", "Error budgets, alerting, and incident response."),
            ("bi-key", "Secrets Management", "Vault integration and rotation policies."),
            ("bi-people", "Culture", "Playbooks, blameless postmortems, and enablement."),
        ],
        "process": [
            ("Baseline", "Map current delivery flow and bottlenecks."),
            ("Automate", "Pipelines, environments, and deployment strategies."),
            ("Observe", "Dashboards, alerts, and on-call readiness."),
            ("Improve", "Reliability targets and developer experience."),
        ],
        "tech": ["GitHub Actions", "GitLab CI", "ArgoCD", "Terraform", "Prometheus", "Grafana"],
        "related": [("service-cloud.html", "bi-cloud", "Cloud Solutions"), ("service-security.html", "bi-shield-lock", "Cybersecurity"), ("service-web.html", "bi-code-slash", "Web Development")],
    },
    {
        "file": "service-uiux.html",
        "title": "UI/UX Design",
        "gradient": "Experience",
        "icon": "bi-palette",
        "meta": "UI/UX design, research, and design systems by SyntrixSoft.",
        "lead": "Research-led product design that balances brand, usability, and engineering feasibility.",
        "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
        "image_alt": "UI UX design process",
        "benefits": [
            ("bi-people", "User Research", "Interviews, surveys, and usability testing."),
            ("bi-easel", "Visual Design", "Premium interfaces aligned to your brand."),
            ("bi-grid-3x3", "Design Systems", "Tokens, components, and documentation."),
            ("bi-phone", "Multi-Platform", "Consistent patterns across web and mobile."),
            ("bi-play-circle", "Prototyping", "Clickable flows for stakeholder alignment."),
            ("bi-translate", "Content Design", "Microcopy, tone, and localization ready."),
        ],
        "process": [
            ("Discover", "Personas, journeys, and problem framing."),
            ("Define", "IA, wireframes, and experience principles."),
            ("Design", "Hi-fi UI, motion, and developer handoff."),
            ("Validate", "Tests, analytics, and iteration loops."),
        ],
        "tech": ["Figma", "FigJam", "Storybook", "Principle", "Maze", "Hotjar"],
        "related": [("service-web.html", "bi-code-slash", "Web Development"), ("service-mobile.html", "bi-phone", "Mobile Apps"), ("service-ai.html", "bi-cpu", "AI Solutions")],
    },
    {
        "file": "service-security.html",
        "title": "Cybersecurity",
        "gradient": "Security",
        "icon": "bi-shield-lock",
        "meta": "Cybersecurity, zero-trust, and compliance services by SyntrixSoft.",
        "lead": "Protect applications and infrastructure with proactive security engineering and audit-ready controls.",
        "image": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80",
        "image_alt": "Cybersecurity protection",
        "benefits": [
            ("bi-shield-check", "Zero Trust", "Identity-centric access and least privilege."),
            ("bi-search", "Pen Testing", "Web, API, and infrastructure assessments."),
            ("bi-file-earmark-lock", "Compliance", "SOC 2, ISO 27001, GDPR readiness."),
            ("bi-bug", "Vuln Management", "Scanning, triage, and remediation SLAs."),
            ("bi-incognito", "Privacy", "Data classification and encryption standards."),
            ("bi-exclamation-triangle", "Incident Response", "Runbooks, forensics, and recovery."),
        ],
        "process": [
            ("Assess", "Risk review, asset inventory, and gap analysis."),
            ("Harden", "Controls, policies, and technical remediations."),
            ("Validate", "Tests, audits, and evidence collection."),
            ("Monitor", "Continuous scanning and security operations."),
        ],
        "tech": ["OWASP", "SIEM", "WAF", "Vault", "CIS Benchmarks", "NIST"],
        "related": [("service-cloud.html", "bi-cloud", "Cloud Solutions"), ("service-devops.html", "bi-gear-wide-connected", "DevOps"), ("service-data.html", "bi-graph-up-arrow", "Data Analytics")],
    },
    {
        "file": "service-data.html",
        "title": "Data Analytics",
        "gradient": "Analytics",
        "icon": "bi-graph-up-arrow",
        "meta": "Data analytics, BI dashboards, and data engineering by SyntrixSoft.",
        "lead": "Turn data into decisions with modern warehouses, pipelines, and executive-grade dashboards.",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        "image_alt": "Data analytics dashboard",
        "benefits": [
            ("bi-database", "Data Warehousing", "Snowflake, BigQuery, and lakehouse models."),
            ("bi-arrow-left-right", "Pipelines", "ETL/ELT, streaming, and data quality checks."),
            ("bi-pie-chart", "BI Dashboards", "Power BI, Looker, and custom portals."),
            ("bi-clock-history", "Real-Time", "Kafka, Flink, and live operational metrics."),
            ("bi-bullseye", "KPI Frameworks", "Metrics aligned to business outcomes."),
            ("bi-lock", "Governance", "Lineage, cataloging, and access policies."),
        ],
        "process": [
            ("Discover", "Sources, stakeholders, and key questions."),
            ("Model", "Schemas, metrics definitions, and pipelines."),
            ("Visualize", "Dashboards, alerts, and self-serve layers."),
            ("Evolve", "New data products and optimization."),
        ],
        "tech": ["Snowflake", "dbt", "Airflow", "Power BI", "Kafka", "Python"],
        "related": [("service-ai.html", "bi-cpu", "AI Solutions"), ("service-cloud.html", "bi-cloud", "Cloud Solutions"), ("service-security.html", "bi-shield-lock", "Cybersecurity")],
    },
]


def h1_html(s):
    words = s["title"].split()
    if len(words) == 1:
        return f'{s["title"]} <span class="text-gradient">{s["gradient"]}</span>'
    return f'{words[0]} <span class="text-gradient">{s["gradient"]}</span>'


def benefits_html(items):
    parts = []
    for icon, title, desc in items:
        parts.append(f"""          <article class="glass-card service-benefit-card tilt-card">
            <div class="tilt-card-inner">
              <i class="bi {icon}" aria-hidden="true"></i>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </article>""")
    return "\n".join(parts)


def process_html(steps):
    return "\n".join(
        f"""          <article class="glass-card process-step">
            <h3>{t}</h3>
            <p>{d}</p>
          </article>"""
        for t, d in steps
    )


def related_html(items):
    return "\n".join(
        f"""          <a href="{href}" class="glass-card related-service-link">
            <i class="bi {icon}" aria-hidden="true"></i>
            <span>{title}</span>
          </a>"""
        for href, icon, title in items
    )


def tech_html(tags):
    return "\n".join(f"          <span>{t}</span>" for t in tags)


def render_page(s):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{s['meta']}">
  <title>{s['title']} — SyntrixSoft</title>
  <link rel="icon" type="image/svg+xml" href="./assets/icons/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
  <link rel="stylesheet" href="./assets/css/style.css">
  <link rel="stylesheet" href="./assets/css/animation.css">
  <link rel="stylesheet" href="./assets/css/responsive.css">
</head>
<body>

  <!-- Page Transition Start -->
  <div class="page-transition" aria-hidden="true"></motion>
  <!-- Page Transition End -->

  <!-- Preloader Start -->
  <div id="page-loader" role="status" aria-label="Loading page">
    <div class="loader-inner">
      <div class="loader-logo">Syntrix<span>Soft</span></div>
      <div class="loader-bar"><div class="loader-progress"></div></div>
      <p class="loader-percent">0%</p>
    </div>
  </div>
  <!-- Preloader End -->

  <!-- Custom Cursor Start -->
  <div class="custom-cursor" aria-hidden="true">
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  </div>
  <!-- Custom Cursor End -->

  <!-- Navbar Start -->
  <header class="navbar scrolled" role="banner">
    <motion class="container navbar-inner">
      <a href="index.html" class="navbar-brand" aria-label="SyntrixSoft Home">Syntrix<span>Soft</span></a>
      <nav class="navbar-nav" role="navigation" aria-label="Main navigation">
        <div class="nav-item"><a href="index.html" class="nav-link">Home</a></div>
        <div class="nav-item has-mega">
          <a href="services.html" class="nav-link active">Services <i class="bi bi-chevron-down" aria-hidden="true"></i></a>
          <div class="mega-menu" role="menu" aria-label="Services menu">
            <div class="mega-menu-inner">
              <div class="mega-menu-head">
                <span class="mega-menu-label">Our Services</span>
                <a href="services.html" class="mega-menu-all">View all <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
              </div>
{MEGA_GRID}
            </div>
          </div>
        </div>
        <div class="nav-item"><a href="about.html" class="nav-link">About</a></div>
        <motion class="nav-item"><a href="portfolio.html" class="nav-link">Portfolio</a></div>
        <div class="nav-item"><a href="blog.html" class="nav-link">Blog</a></div>
        <div class="nav-item"><a href="careers.html" class="nav-link">Careers</a></div>
        <div class="nav-item"><a href="contact.html" class="nav-link">Contact</a></div>
      </nav>
      <div class="navbar-actions">
        <button class="icon-btn search-toggle" type="button" aria-label="Open search"><i class="bi bi-search" aria-hidden="true"></i></button>
        <button class="icon-btn theme-toggle" type="button" aria-label="Toggle theme"><i class="bi bi-moon-fill icon-moon" aria-hidden="true"></i><i class="bi bi-sun-fill icon-sun" aria-hidden="true"></i></button>
        <a href="contact.html" class="btn-primary btn-magnetic d-none d-lg-inline-flex">Get Started <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
        <button class="navbar-toggler" type="button" aria-label="Toggle mobile menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
  <!-- Navbar End -->

  <!-- Mobile Menu Start -->
  <div class="mobile-menu" aria-hidden="true">
    <div class="mobile-menu-backdrop"></div>
    <div class="mobile-menu-panel">
      <nav class="mobile-nav" aria-label="Mobile navigation">
        <a href="index.html" class="mobile-nav-link">Home</a>
        <a href="about.html" class="mobile-nav-link">About</a>
        <a href="services.html" class="mobile-nav-link active">Services</a>
        <a href="portfolio.html" class="mobile-nav-link">Portfolio</a>
        <a href="blog.html" class="mobile-nav-link">Blog</a>
        <a href="careers.html" class="mobile-nav-link">Careers</a>
        <a href="contact.html" class="mobile-nav-link">Contact</a>
      </nav>
      <a href="contact.html" class="btn-primary mobile-menu-cta">Get Started</a>
    </div>
  </div>
  <!-- Mobile Menu End -->

  <main id="main-content">

    <!-- Page Hero Start -->
    <section class="page-hero" aria-labelledby="service-page-title">
      <div class="blob blob-1" aria-hidden="true"></div>
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">
          <a href="index.html">Home</a>
          <span class="sep" aria-hidden="true">/</span>
          <a href="services.html">Services</a>
          <span class="sep" aria-hidden="true">/</span>
          <span aria-current="page">{s['title']}</span>
        </nav>
        <h1 class="page-hero-title" id="service-page-title">{h1_html(s)}</h1>
        <p class="page-hero-desc">{s['lead']}</p>
      </div>
    </section>
    <!-- Page Hero End -->

    <!-- Service Intro Start -->
    <section class="section section-compact">
      <div class="container">
        <div class="service-page-hero-grid">
          <div class="service-page-intro">
            <div class="service-icon"><i class="bi {s['icon']}" aria-hidden="true"></i></motion>
            <h2 class="h3 mb-3">Why choose our {s['title'].lower()} team?</h2>
            <p class="lead">{s['lead']}</p>
            <div class="service-page-actions">
              <a href="contact.html" class="btn-primary btn-magnetic">Start a Project <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
              <a href="portfolio.html" class="btn-outline btn-magnetic">View Case Studies</a>
            </div>
          </div>
          <div class="service-page-visual glass-card">
            <img src="{s['image']}" alt="{s['image_alt']}" width="1200" height="900" loading="lazy">
          </div>
        </div>
      </div>
    </section>
    <!-- Service Intro End -->

    <!-- Benefits Start -->
    <section class="section section-alt" aria-labelledby="benefits-heading">
      <div class="container">
        <header class="section-header">
          <span class="section-label">Capabilities</span>
          <h2 class="section-title" id="benefits-heading">What You <span class="text-gradient">Get</span></h2>
        </header>
        <div class="service-benefits-grid">
{benefits_html(s['benefits'])}
        </div>
      </div>
    </section>
    <!-- Benefits End -->

    <!-- Process Start -->
    <section class="section" aria-labelledby="process-heading">
      <div class="container">
        <header class="section-header">
          <span class="section-label">How We Work</span>
          <h2 class="section-title" id="process-heading">Our <span class="text-gradient">Process</span></h2>
        </header>
        <div class="service-process-grid">
{process_html(s['process'])}
        </div>
      </div>
    </section>
    <!-- Process End -->

    <!-- Tech Start -->
    <section class="section section-alt section-compact" aria-label="Technologies">
      <div class="container">
        <header class="section-header">
          <span class="section-label">Stack</span>
          <h2 class="section-title">Tools &amp; <span class="text-gradient">Technologies</span></h2>
        </header>
        <div class="service-tech-tags">
{tech_html(s['tech'])}
        </div>
      </div>
    </section>
    <!-- Tech End -->

    <!-- Related Start -->
    <section class="section" aria-labelledby="related-heading">
      <div class="container">
        <header class="section-header">
          <span class="section-label">Explore More</span>
          <h2 class="section-title" id="related-heading">Related <span class="text-gradient">Services</span></h2>
        </header>
        <div class="related-services-grid">
{related_html(s['related'])}
        </div>
      </div>
    </section>
    <!-- Related End -->

    <!-- CTA Start -->
    <section class="cta-section" aria-labelledby="service-cta">
      <div class="container">
        <div class="glass-card cta-box glow-pulse">
          <div class="cta-content">
            <h2 id="service-cta">Ready to build with <span class="text-gradient">SyntrixSoft</span>?</h2>
            <p>Tell us about your {s['title'].lower()} goals — we will respond within 24 hours.</p>
            <a href="contact.html" class="btn-primary btn-magnetic">Get a Free Consultation <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>
      </motion>
    </section>
    <!-- CTA End -->

  </main>

  <!-- Footer Start -->
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="navbar-brand">Syntrix<span>Soft</span></a>
          <p>Empowering enterprises with world-class technology solutions since 2014.</p>
          <div class="footer-social">
            <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a>
            <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x" aria-hidden="true"></i></a>
            <a href="#" aria-label="GitHub"><i class="bi bi-github" aria-hidden="true"></i></a>
            <a href="#" aria-label="YouTube"><i class="bi bi-youtube" aria-hidden="true"></i></a>
          </div>
        </div>
        <div class="footer-col"><h4>Company</h4><ul><li><a href="about.html">About Us</a></li><li><a href="careers.html">Careers</a></li><li><a href="blog.html">Blog</a></li><li><a href="contact.html">Contact</a></li></ul></div>
        <div class="footer-col"><h4>Services</h4><ul><li><a href="service-web.html">Web Development</a></li><li><a href="service-mobile.html">Mobile Apps</a></li><li><a href="service-cloud.html">Cloud Solutions</a></li><li><a href="service-ai.html">AI Solutions</a></li></ul></motion>
        <div class="footer-col"><h4>Newsletter</h4><p class="footer-newsletter-desc">Subscribe for tech insights and updates.</p><form class="footer-newsletter newsletter-form" aria-label="Newsletter signup"><input type="email" name="email" placeholder="Your email" required aria-label="Email"><button type="submit" class="btn-primary">Subscribe</button></form></div>
      </div>
      <div class="footer-bottom"><p>&copy; <span id="footer-year">2026</span> SyntrixSoft. All rights reserved.</p><div><a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Terms of Service</a></div></div>
    </div>
  </footer>
  <!-- Footer End -->

  <!-- Search Popup Start -->
  <div class="search-popup" role="dialog" aria-label="Search" aria-hidden="true">
    <div class="search-popup-inner">
      <form role="search" aria-label="Site search"><input type="search" placeholder="Search..." aria-label="Search query" autocomplete="off"><button type="button" class="search-close" aria-label="Close search"><i class="bi bi-x-lg" aria-hidden="true"></i></button></form>
      <div class="search-suggestions"><h4>Popular Searches</h4><a href="service-cloud.html">Cloud Solutions</a><a href="service-ai.html">AI Development</a><a href="portfolio.html">Case Studies</a><a href="careers.html">Open Positions</a></div>
    </div>
  </div>
  <!-- Search Popup End -->

  <!-- Back to Top Start -->
  <button class="back-to-top" type="button" aria-label="Back to top"><i class="bi bi-arrow-up" aria-hidden="true"></i></button>
  <!-- Back to Top End -->

  <!-- WhatsApp Float Start -->
  <a href="https://wa.me/14155550100" class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a>
  <!-- WhatsApp Float End -->

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
  <script src="./assets/js/main.js"></script>
  <script src="./assets/js/animation.js"></script>
</body>
</html>
"""


def sanitize(html):
    html = html.replace("<motion", "<div").replace("</motion>", "</div>")
    return html


def patch_file(path):
    text = path.read_text()
    for old, new in LINK_MAP.items():
        text = text.replace(old, new)
    text = re.sub(
        r'<div class="mega-grid">.*?</motion>\s*</motion>\s*</motion>',
        MEGA_GRID + "\n            </motion>\n          </motion>",
        text,
        count=1,
        flags=re.DOTALL,
    )
    text = re.sub(
        r'<div class="mega-grid">.*?</div>\s*(?=\s*</motion>\s*</motion>\s*</motion>\s*</motion>)',
        MEGA_GRID.strip(),
        text,
        count=1,
        flags=re.DOTALL,
    )
    text = re.sub(
        r'<div class="mega-grid">.*?</div>\s*(?=\s*</div>\s*</motion>\s*</motion>)',
        MEGA_GRID.strip(),
        text,
        count=1,
        flags=re.DOTALL,
    )
    text = re.sub(
        r'<div class="mega-grid">.*?</div>\s*(?=\s*</div>\s*</div>\s*</div>\s*</div>)',
        MEGA_GRID.strip(),
        text,
        count=1,
        flags=re.DOTALL,
    )
    return sanitize(text)


def main():
    for s in SERVICES:
        html = sanitize(render_page(s))
        (ROOT / s["file"]).write_text(html)
        print("Created", s["file"])

    for f in sorted(ROOT.glob("*.html")):
        if f.name.startswith("service-"):
            continue
        f.write_text(patch_file(f))
        print("Updated", f.name)


if __name__ == "__main__":
    main()
