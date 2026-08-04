(function () {
  var KEY = 'abp_gate_unlocked_v1';
  if (localStorage.getItem(KEY) === '1') return;

  var PASS_HASH = 'a5ac1f967df633ef08906d2d95b022c36aad8a61d7256edb7b2b294c8407d8a5';

  function sha256(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  var style = document.createElement('style');
  style.textContent =
    'body > *:not(#site-gate){display:none !important;}' +
    '@keyframes gateIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}' +
    '#site-gate{position:fixed;inset:0;z-index:99999;background:#16283F;color:#F6F1E7;display:flex;align-items:center;justify-content:center;font-family:"Inter",-apple-system,sans-serif;}' +
    '#site-gate::before,#site-gate::after{content:"";position:absolute;width:22px;height:22px;pointer-events:none;}' +
    '#site-gate::before{top:24px;left:24px;border-top:1px solid #DDD8CB;border-left:1px solid #DDD8CB;opacity:0.55;}' +
    '#site-gate::after{bottom:24px;right:24px;border-bottom:1px solid #DDD8CB;border-right:1px solid #DDD8CB;opacity:0.55;}' +
    '#site-gate .box{text-align:center;padding:24px;max-width:360px;animation:gateIn 0.6s ease both;}' +
    '#site-gate .gate-logo{height:34px;width:auto;margin:0 auto 28px;}' +
    '#site-gate .gate-coord{display:block;font-family:"Space Mono",monospace;font-size:0.7rem;letter-spacing:0.1em;color:#8C97A6;margin-bottom:18px;}' +
    '#site-gate h1{font-family:"Newsreader",Georgia,serif;font-style:italic;font-weight:500;font-size:1.7rem;line-height:1.25;margin:0 0 30px;color:#F6F1E7;}' +
    '#site-gate input{font-family:"Space Mono",monospace;font-size:0.9rem;letter-spacing:0.04em;padding:13px 16px;border:1px solid #33455E;background:rgba(255,255,255,0.03);color:#F6F1E7;width:260px;text-align:center;transition:border-color 0.15s ease;}' +
    '#site-gate input::placeholder{color:#6C7A8C;}' +
    '#site-gate input:focus{outline:none;border-color:#2B5C61;}' +
    '#site-gate button{display:block;margin:16px auto 0;font-family:"Space Mono",monospace;font-size:0.78rem;letter-spacing:0.08em;padding:13px 26px;border:1px solid #DDD8CB;background:transparent;color:#F6F1E7;cursor:pointer;transition:background 0.15s ease,color 0.15s ease;}' +
    '#site-gate button:hover{background:#DDD8CB;color:#16283F;}' +
    '#site-gate .err{color:#C97B63;font-family:"Space Mono",monospace;font-size:0.75rem;margin-top:16px;min-height:1em;letter-spacing:0.03em;}';
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'site-gate';
  overlay.innerHTML =
    '<div class="box">' +
    '<img class="gate-logo" src="images/logo/logo-white.png" alt="Alef Beta Properties">' +
    '<span class="gate-coord">LIMASSOL, CYPRUS &mdash; SITE IN PROGRESS</span>' +
    '<h1>Something new is on its way.</h1>' +
    '<div><input type="password" id="site-gate-pw" placeholder="PASSWORD" autocomplete="off"></div>' +
    '<button id="site-gate-btn">ENTER</button>' +
    '<div class="err" id="site-gate-err"></div>' +
    '</div>';
  document.body.insertBefore(overlay, document.body.firstChild);

  var input = document.getElementById('site-gate-pw');
  var btn = document.getElementById('site-gate-btn');
  var err = document.getElementById('site-gate-err');
  input.focus();

  function tryUnlock() {
    sha256(input.value).then(function (hash) {
      if (hash === PASS_HASH) {
        localStorage.setItem(KEY, '1');
        style.remove();
        overlay.remove();
      } else {
        err.textContent = 'Incorrect password.';
        input.value = '';
        input.focus();
      }
    });
  }
  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });
})();
