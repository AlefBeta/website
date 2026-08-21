(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCount(el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    var target = parseInt(match[1], 10);
    var suffix = match[2];
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(easeOutExpo(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  function initCountUp() {
    var els = document.querySelectorAll('.stat-value');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animateCount(entry.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  function splitIntoWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    var wordIndex = 0;
    var allWords = [];
    var frag = document.createDocumentFragment();
    nodes.forEach(function (node) {
      if (node.nodeType === 1 && node.tagName === 'BR') {
        frag.appendChild(document.createElement('br'));
        return;
      }
      var text = node.textContent || '';
      var words = text.split(/\s+/).filter(Boolean);
      words.forEach(function (word) {
        allWords.push(word);
        var outer = document.createElement('span');
        outer.className = 'word';
        var inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = word;
        inner.style.transitionDelay = (wordIndex * 45) + 'ms';
        wordIndex++;
        outer.appendChild(inner);
        frag.appendChild(outer);
        frag.appendChild(document.createTextNode(' '));
      });
    });
    el.setAttribute('aria-label', allWords.join(' '));
    el.innerHTML = '';
    el.appendChild(frag);
  }

  function initWordReveal() {
    var els = document.querySelectorAll('.reveal-words');
    if (!els.length) return;
    els.forEach(splitIntoWords);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        entry.target.classList.add('in-view');
      });
    }, { threshold: 0.3 });
    els.forEach(function (el) { io.observe(el); });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (reduceMotion || !canObserve) return;
    initCountUp();
    initWordReveal();
  });
})();
