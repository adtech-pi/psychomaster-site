/**
 * PsychoMaster - Main JavaScript
 * Navigation, animations, and common utilities
 */

(function () {
  'use strict';

  /* ================================================
     Mobile Navigation Toggle
     ================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.navbar-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* ================================================
     Navbar scroll effect
     ================================================ */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  }, { passive: true });

  /* ================================================
     Smooth Scroll to Section
     ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile nav if open
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });

  /* ================================================
     Intersection Observer for Reveal Animations
     ================================================ */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  /* ================================================
     Floating Particles (Hero Background)
     ================================================ */
  function createParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }

  createParticles();

  /* ================================================
     Quiz Card Click — navigate to quiz
     ================================================ */
  document.querySelectorAll('.quiz-card:not(.quiz-card-coming)').forEach(card => {
    card.addEventListener('click', function () {
      const href = this.dataset.href;
      if (href) {
        window.location.href = href;
      }
    });
  });

  /* ================================================
     Telegram Share
     ================================================ */
  window.shareToTelegram = function (text, url) {
    const shareUrl = encodeURIComponent(url || window.location.href);
    const shareText = encodeURIComponent(text || '我在 PsychoMaster 发现了一个很棒的心理测试！');
    window.open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`, '_blank', 'width=600,height=500');
  };

  /* ================================================
     Copy Link
     ================================================ */
  window.copyLink = function () {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('链接已复制到剪贴板！');
      }).catch(() => {
        showToast('复制失败，请手动复制');
      });
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('链接已复制到剪贴板！');
    }
  };

  /* ================================================
     Toast Notification
     ================================================ */
  function showToast(message, duration = 2500) {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(26, 26, 31, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 0.9rem;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  window.showToast = showToast;

  /* ================================================
     Page Load Animation
     ================================================ */
  document.body.classList.add('page-transition');

  /* ================================================
     Active Nav Link
     ================================================ */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

})();
