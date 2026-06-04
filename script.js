// ===== LIVE CLOCK =====
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => observer.observe(el));

// ===== TERMINAL TYPEWRITER =====
const terminalLines = [
  '> NEXUS-7 INITIALIZATION SEQUENCE',
  '> LOADING NEURAL BRIDGE v4.2.1...',
  '> CORTICAL MESH: CONNECTED ✓',
  '> OPTIC ARRAY: CALIBRATED ✓',
  '> EXO SKELETON: ENGAGED ✓',
  '> BIO-CELL: OPTIMAL ✓',
  '> COMMS UPLINK: ENCRYPTED ✓',
  '> REGEN MODULE: ACTIVE ✓',
  '> ALL SYSTEMS NOMINAL',
  '> AWAITING USER COMMAND...',
  '> _'
];

function runTerminal() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  let lineIndex = 0;
  let charIndex = 0;
  let currentDiv = null;

  const termObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      termObs.disconnect();
      type();
    }
  }, { threshold: 0.3 });

  termObs.observe(terminal);

  function type() {
    if (lineIndex >= terminalLines.length) return;

    if (charIndex === 0) {
      currentDiv = document.createElement('div');
      const color = terminalLines[lineIndex].startsWith('> ALL') || terminalLines[lineIndex].startsWith('> AWAIT')
        ? '#00ff88'
        : terminalLines[lineIndex].includes('✓')
        ? '#00ff88'
        : 'var(--cyan)';
      currentDiv.style.color = color;
      terminal.appendChild(currentDiv);
    }

    const line = terminalLines[lineIndex];
    currentDiv.textContent = line.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex >= line.length) {
      lineIndex++;
      charIndex = 0;
      setTimeout(type, lineIndex === terminalLines.length ? 0 : 150);
    } else {
      const delay = line[charIndex - 1] === '>' ? 60 : 28;
      setTimeout(type, delay);
    }
  }
}

runTerminal();

// ===== NAV ACTIVE HIGHLIGHT ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
  });
});

// ===== FADE-IN ON SCROLL =====
const fadeEls = document.querySelectorAll('.tech-card, .spec-row:not(.header-row), .blueprint-card');
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 0.05}s`;
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObs.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tech-card, .spec-row, .blueprint-card').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
});
