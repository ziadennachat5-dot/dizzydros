/* =============================================
   DIZZY DROS — main.js
   ============================================= */

/* ---- Custom Cursor ---- */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .gallery-item, .platform-btn, .social-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    cursor.style.background = '#9B0F06';
    follower.style.width  = '52px';
    follower.style.height = '52px';
    follower.style.borderColor = 'rgba(155,15,6,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '10px';
    cursor.style.height = '10px';
    follower.style.width  = '36px';
    follower.style.height = '36px';
    follower.style.borderColor = 'rgba(155,15,6,0.5)';
  });
});

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- Mobile menu ---- */
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

toggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  const spans = toggle.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  });
});

/* ---- Scroll fade-up animations ---- */
const fadeEls = document.querySelectorAll(
  '.section-header, .about-text, .about-visual, .timeline-item, ' +
  '.music-cover, .music-links, .gallery-item, .social-card, .stat, .puma-item'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* ---- Staggered children fade ---- */
document.querySelectorAll('.platform-list, .hero-badges').forEach(parent => {
  const children = parent.children;
  Array.from(children).forEach((child, i) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  });
  const staggerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Array.from(children).forEach(child => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  staggerObserver.observe(parent);
});

/* ---- Hero parallax ---- */
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight && heroImg) {
    heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.2}px)`;
  }
}, { passive: true });

/* ---- Active nav link highlight ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#9B0F06' : '';
  });
}, { passive: true });

/* ---- Gallery lightbox simple ---- */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:20000;
      background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;backdrop-filter:blur(12px);
      animation:fadeIn 0.25s ease;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(style);
    const clone = document.createElement('img');
    clone.src = img.src;
    clone.alt = img.alt;
    clone.style.cssText = `
      max-width:90vw;max-height:88vh;
      object-fit:contain;border-radius:0;
      box-shadow:0 0 60px rgba(155,15,6,0.15);
    `;
    overlay.appendChild(clone);
    overlay.addEventListener('click', () => {
      overlay.style.animation = 'fadeIn 0.2s ease reverse';
      setTimeout(() => overlay.remove(), 200);
    });
    document.body.appendChild(overlay);
  });
});

/* ---- Neon glow pulse on hero title ---- */
const neonText = document.querySelector('.neon-text');
if (neonText) {
  let pulse = 0;
  setInterval(() => {
    pulse += 0.05;
    const intensity = 0.3 + Math.sin(pulse) * 0.2;
    neonText.style.textShadow = `0 0 ${40 + Math.sin(pulse) * 20}px rgba(155,15,6,${intensity})`;
  }, 50);
}

console.log('%cDIZZY DROS — Da Rhymes of Streets 🎤', 'color:#9B0F06;font-family:monospace;font-size:18px;font-weight:bold;');
