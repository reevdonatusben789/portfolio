/**
 * REEV DONATUS BEN — PORTFOLIO INTERACTION ENGINE
 * - Ambient Subtle Particle Constellation Canvas (Gentle & Non-distracting)
 * - Scroll-Spy & Sticky Glass Navbar
 * - Mobile Navigation Drawer Toggle
 * - Genuine Project Category Filtering
 * - Project Architecture Detail Modal
 * - Resume Summary Modal & Download Trigger
 * - Contact Form Handler with Feedback Toast
 * - Live Kochi Local Time Clock (IST / UTC+5:30)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. AMBIENT PARTICLE CONSTELLATION CANVAS (SUBTLE & GENTLE)
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 25 : 50;
    const maxDistance = 110;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mouse = { x: null, y: null, radius: 120 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Calm, subtle drifting velocity
        this.vx = (Math.random() - 0.5) * 0.28;
        this.vy = (Math.random() - 0.5) * 0.28;
        this.radius = Math.random() * 1.4 + 0.6;
        this.color = Math.random() > 0.4 ? 'rgba(148, 163, 184, ' : 'rgba(16, 185, 129, ';
        this.alpha = Math.random() * 0.25 + 0.12;
      }

      update() {
        if (!prefersReducedMotion) {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0) this.x = width;
          if (this.x > width) this.x = 0;
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;

          // Gentle mouse avoidance
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              this.x -= (dx / dist) * force * 1.5;
              this.y -= (dy / dist) * force * 1.5;
            }
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.1;
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ==========================================================================
     2. SCROLL PROGRESS INDICATOR & HEADER NAVBAR
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = scrollPercent + '%';
    }

    if (siteHeader) {
      if (scrollTop > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Scroll-Spy
    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });

  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!siteHeader.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================================================
     4. PROJECT CATEGORY FILTERS
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     5. PROJECT ARCHITECTURE DETAIL MODAL (AUTHENTIC DATA)
     ========================================================================== */
  const projectData = {
    roadtrip: {
      title: 'RoadTrip Pro — Smart Road Trip Planner',
      category: 'Major Academic Project (Full-Stack Web App)',
      image: 'assets/images/roadtrip_pro.jpg',
      badge: 'MAJOR CAPSTONE PROJECT',
      overview: 'RoadTrip Pro is a car-focused road-trip planning web application designed to help users plan journeys, estimate travel and fuel costs, discover places and fuel/EV stations along their route, manage vehicle information, and maintain trip history.',
      architecture: [
        'Route Planning Core: Interactive Google Maps JavaScript API with DirectionsService and DirectionsRenderer for driving corridor calculations.',
        'Corridor Station Discovery: Route geometry sampling along the highway overview path to query Google Places API for Petrol/Diesel pumps and EV charging stations.',
        'Calculated Journey Telemetry: Elevation-aware fuel volume consumption (Litres) and EV battery requirements (kWh) with dynamic trip expense estimates.',
        'Data Persistence Layer: SessionStorage preservation across pages and Firebase Cloud Firestore for persistent trip itineraries and vehicle garage records.'
      ],
      modules: [
        'Route Planning & Navigation',
        'Fuel Cost & Energy Estimation',
        'Fuel & EV Station Discovery',
        'Highway Points of Interest',
        'Trip Budget & Expense Log',
        'Group Trip Coordination',
        'Personal Trip Journal',
        'Vehicle Garage & Reminders',
        'Emergency Help Services (112 / 1033)',
        'Cloud Trip History & Archives'
      ],
      technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript (ES6+)', 'Google Maps API', 'Google Places API', 'Firebase Firestore', 'Web Storage APIs']
    },
    alibaba: {
      title: 'Alibaba B2B Mobile Marketplace Clone',
      category: 'Mobile Application Project (Flutter & Dart)',
      image: 'assets/images/project_app.jpg',
      badge: 'FLUTTER & DART APPLICATION',
      overview: 'A cross-platform mobile commerce interface built using Flutter and Dart, replicating the multi-tab B2B shopping experience with manufacturer directories, regional supplier catalogs, tab-view navigation, and custom user profile management.',
      architecture: [
        'Mobile Widget Tree: Engineered responsive screen layouts adhering to Material Design 3 guidelines for both phone and tablet displays.',
        'Multi-Tab Experience: Structured TabBar and TabBarView widgets managing category navigation, product feeds, and supplier lists.',
        'Component Modularity: Decomposed user interfaces into dedicated Dart modules (homescreen, manufactures, regional, profilepage).',
        'Mobile Environment: Configured with Dart SDK (^3.5.4) and prepared for Android/iOS deployment pipelines.'
      ],
      modules: [
        'Multi-Category Home Screen',
        'Global Manufacturer Directory',
        'Regional Supplier Catalogs',
        'Custom TabView Routing',
        'User Profile & Preferences'
      ],
      technologies: ['Flutter', 'Dart', 'Android Studio', 'Material 3', 'Mobile UI Architecture']
    },
    'student-mgmt': {
      title: 'Student Management & Academic Records Portal',
      category: 'Academic Database Application (PHP & MySQL)',
      image: 'assets/images/project_web.jpg',
      badge: 'DBMS & WEB PLATFORM',
      overview: 'An academic web database application designed to streamline student registration, course enrollments, attendance tracking, and examination grade management with relational schema integrity and normalized SQL tables.',
      architecture: [
        'Relational Database Modeling: Designed 3NF-compliant relational schema connecting students, departments, course enrollments, and academic grades.',
        'Backend CRUD Operations: Structured PHP scripts executing parameterized SQL queries for secure student record insertion, updates, and lookups.',
        'Client Interface: Responsive web forms with client-side input validation and dynamic data tables for administrative reporting.',
        'Academic Integrity: Formulated primary and foreign key constraints to prevent duplicate enrollments and orphaned records.'
      ],
      modules: [
        'Student Registration & Profile Directory',
        'Department & Course Allocation',
        'Academic Grade Entry & Transcripts',
        'Attendance Tracking Logs',
        'Administrative Summary Reports'
      ],
      technologies: ['PHP', 'MySQL / SQL', 'JavaScript', 'HTML5 / CSS3', 'Relational DBMS']
    },
    'linux-monitor': {
      title: 'Linux System Monitoring & Shell Automation Suite',
      category: 'Academic Systems Project (Linux & Bash)',
      image: 'assets/images/project_ai.jpg',
      badge: 'BASH & LINUX AUTOMATION',
      overview: 'A laboratory automation suite engineered on Ubuntu 24.04 LTS featuring defensive Bash scripts for end-to-end telemetry auditing, dynamic time-aware user greetings, proactive disk threshold surveillance via syslog, and scheduled cron automation.',
      architecture: [
        'Defensive Scripting Standards: Built scripts adhering to "set -euo pipefail" principles for deterministic command execution and error interception.',
        'System Telemetry Extraction: Automated collection of CPU utilization, RAM/swap memory buffers, virtual memory statistics, and process triage.',
        'Proactive Storage Alerting: Configured automated threshold evaluations dispatching system events via "logger" to syslog.',
        'Cron Automation: Configured crontab routines for automated periodic health check reports and administrative logging.'
      ],
      modules: [
        'System Telemetry & Diagnostic Utilities',
        'Automated Health Audit Generator',
        '24-Hour Time-Aware Login Greetings',
        'Proactive Disk Space Alerting',
        'Scheduled Cron Job Automation'
      ],
      technologies: ['Linux / Bash', 'Ubuntu 24.04', 'Python Utilities', 'Cron Scheduler', 'Shell Scripting']
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const viewProjectBtns = document.querySelectorAll('.view-project-btn');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;

    modalBody.innerHTML = `
      <div class="modal-image-preview">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; border-radius: 12px; display: block;">
      </div>

      <div style="margin-bottom: 22px;">
        <span class="badge-pill badge-status" style="margin-bottom: 12px; display: inline-flex;">${data.badge}</span>
        <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 8px;">Project Overview</h4>
        <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">${data.overview}</p>
      </div>

      <div style="margin-bottom: 22px;">
        <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 10px;">Implementation Highlights</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          ${data.architecture.map(item => `
            <li style="position: relative; padding-left: 18px; font-size: 0.92rem; color: #cbd5e1; line-height: 1.6;">
              <span style="position: absolute; left: 0; color: var(--emerald); font-weight: bold;">▹</span>
              ${item}
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 22px;">
        <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 10px;">Core Functional Modules</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px;">
          ${data.modules.map(mod => `
            <div style="padding: 8px 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 6px; font-size: 0.85rem; color: #e2e8f0;">
              ✓ ${mod}
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 10px;">Technology Stack</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.technologies.map(t => `<span class="tech-tag" style="background: rgba(255,255,255,0.06);">${t}</span>`).join('')}
        </div>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project-id');
      openProjectModal(pid);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  /* ==========================================================================
     6. RESUME MODAL & DOWNLOAD HANDLER
     ========================================================================== */
  const resumeModal = document.getElementById('resumeModal');
  const viewResumeModalBtn = document.getElementById('viewResumeModalBtn');
  const resumeModalCloseBtn = document.getElementById('resumeModalCloseBtn');
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  const modalDownloadResumeBtn = document.getElementById('modalDownloadResumeBtn');
  const navResumeBtn = document.getElementById('navResumeBtn');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (viewResumeModalBtn) {
    viewResumeModalBtn.addEventListener('click', openResumeModal);
  }

  if (resumeModalCloseBtn) {
    resumeModalCloseBtn.addEventListener('click', closeResumeModal);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  function handleResumeDownload() {
    openResumeModal();
    showToast('Resume summary opened. You can review academic qualifications, projects & skills directly.', true);
  }

  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', handleResumeDownload);
  }

  if (modalDownloadResumeBtn) {
    modalDownloadResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('open')) {
        closeProjectModal();
      }
      if (resumeModal && resumeModal.classList.contains('open')) {
        closeResumeModal();
      }
    }
  });

  /* ==========================================================================
     7. CONTACT FORM & TOAST NOTIFICATION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitFormBtn = document.getElementById('submitFormBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg, isSuccess = true) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;

    const icon = toastNotification.querySelector('svg');
    if (icon) {
      icon.style.stroke = isSuccess ? 'var(--emerald-light)' : '#ef4444';
    }

    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  }

  if (contactForm && submitFormBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all form fields before submitting.', false);
        return;
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', false);
        return;
      }

      submitFormBtn.disabled = true;
      submitFormBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        <span>Sending Message...</span>
      `;

      setTimeout(() => {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = `
          <span>Send Message</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;

        contactForm.reset();
        showToast(`Thank you, ${name}! Your message has been received. Reev will get back to you shortly.`, true);
      }, 700);
    });
  }

  /* ==========================================================================
     8. LIVE REAL-TIME CLOCK (KOCHI, KERALA &bull; IST / UTC+5:30)
     ========================================================================== */
  const liveClock = document.getElementById('liveClock');
  function updateLiveClock() {
    if (!liveClock) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    liveClock.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

});
