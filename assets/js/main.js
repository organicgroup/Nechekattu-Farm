/* Nechekattu Farm — buildless HTML, CSS and JavaScript. No network required. */
(() => {
  'use strict';
  const config = window.FARM_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
  const email = isEmail(config.email) ? config.email.trim() : '';
  const phone = /^\+?[\d\s()-]{7,25}$/.test(config.phone || '') ? config.phone : '';
  const whatsapp = /^\d{8,15}$/.test(config.whatsappNumber || '') ? config.whatsappNumber : '';
  const safeURL = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
  let toastTimer;
  function toast(message) {
    const el = $('.toast'); if (!el) return;
    clearTimeout(toastTimer); el.textContent = message; el.classList.add('show');
    toastTimer = setTimeout(() => el.classList.remove('show'), 5500);
  }
  function lockForDialog() { document.body.classList.add('locked'); }
  function unlockIfFree() { if (!$('dialog[open]') && !$('.menu-toggle[aria-expanded="true"]')) document.body.classList.remove('locked'); }
  $$('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
  $$('[data-contact="email"]').forEach(el => { if (email) { el.href = 'mailto:' + email; if (!el.closest('.contact-row')) el.textContent = email; } });
  $$('[data-contact="phone"]').forEach(el => { if (phone) { el.href = 'tel:' + phone.replace(/[^+\d]/g, ''); if (!el.closest('.contact-row')) el.textContent = phone; } });
  $$('[data-contact-label]').forEach(el => { const v = {email, phone, whatsapp: phone || (whatsapp ? '+' + whatsapp : '')}[el.dataset.contactLabel]; if (v) el.textContent = v; });
  const configuredMap = safeURL(config.mapsUrl);
  if (configuredMap) $$('a[href^="https://www.google.com/maps/search/"], a[href^="https://maps.app.goo.gl/"]').forEach(el => el.href = configuredMap);
  $$('[data-social]').forEach(el => {
    const url = safeURL(config[el.dataset.social + 'Url']);
    if (url) { el.href = url; el.target = '_blank'; el.rel = 'noopener'; }
    else el.addEventListener('click', evt => { evt.preventDefault(); toast('Our official social profile will be added soon.'); });
  });
  $$('[data-whatsapp]').forEach(el => {
    if (whatsapp) { el.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent('Hello Nechekattu Farm, I would like to enquire about a farm visit.'); el.target = '_blank'; el.rel = 'noopener'; if (!el.closest('.contact-row')) el.textContent = 'WhatsApp · +91 97786 99064'; }
    else el.addEventListener('click', evt => {
      evt.preventDefault();
      toast('Our WhatsApp contact will be added soon. You can prepare a visit enquiry on the Visit Us page.');
      if (document.body.dataset.page === 'contact') $('#enquiry')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
  });
  const origin = safeURL(config.websiteUrl);
  if (origin) {
    const page = document.body.dataset.page || 'index';
    const canonical = document.createElement('link'); canonical.rel = 'canonical'; canonical.href = new URL(page === 'index' ? './' : page + '.html', origin.endsWith('/') ? origin : origin + '/').href; document.head.append(canonical);
    const ogURL = document.createElement('meta'); ogURL.setAttribute('property','og:url'); ogURL.content = canonical.href; document.head.append(ogURL);
    const ogImage = $('meta[property="og:image"]'); if (ogImage) ogImage.content = new URL(ogImage.getAttribute('content'), origin.endsWith('/') ? origin : origin + '/').href;
  }
  // Shared responsive navigation; native links work when JavaScript is off.
  const header = $('.site-header'); const menuButton = $('.menu-toggle'); const mobileNav = $('.mobile-nav'); const backTop = $('.back-top');
  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
    if (open) { document.body.classList.add('locked'); $('a', mobileNav)?.focus(); }
    else { unlockIfFree(); if (restoreFocus) menuButton.focus(); }
  }
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('a', mobileNav || document.createElement('nav')).forEach(el => el.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (menuButton?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { setMenu(false, true); return; }
    if (event.key !== 'Tab') return;
    const nodes = [menuButton, ...$$('a', mobileNav)]; const first = nodes[0], last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 1001px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  let scheduled = false;
  function updateScroll() { header?.classList.toggle('scrolled', scrollY > 70); backTop?.classList.toggle('visible', scrollY > 700); scheduled = false; }
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  updateScroll();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
  // Native dialog provides keyboard focus containment, Escape and focus return.
  $$('dialog').forEach(dialog => {
    $('[data-close]', dialog)?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', unlockIfFree);
    dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
  });
  const lightbox = $('.lightbox'); let activePhotos = [], photoIndex = 0;
  function showPhoto(index) {
    if (!activePhotos.length || !lightbox) return;
    photoIndex = (index + activePhotos.length) % activePhotos.length;
    const button = activePhotos[photoIndex]; const image = $('img', lightbox);
    image.src = button.dataset.lightbox; image.alt = $('img', button)?.alt || button.dataset.caption;
    $('[data-lightbox-caption]', lightbox).textContent = button.dataset.caption + ' · ' + (photoIndex + 1) + ' / ' + activePhotos.length;
  }
  $$('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    activePhotos = $$('[data-lightbox]').filter(el => !el.hidden); showPhoto(activePhotos.indexOf(button));
    lightbox.showModal(); lockForDialog();
  }));
  $('[data-lightbox-prev]')?.addEventListener('click', () => showPhoto(photoIndex - 1));
  $('[data-lightbox-next]')?.addEventListener('click', () => showPhoto(photoIndex + 1));
  lightbox?.addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); } if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); } });
  $$('.filter-btn').forEach(button => button.addEventListener('click', () => {
    $$('.filter-btn').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    $$('.bird-gallery [data-group]').forEach(el => { el.hidden = button.dataset.filter !== 'all' && el.dataset.group !== button.dataset.filter; if (!el.hidden) { el.style.opacity = '1'; el.style.transform = 'none'; } });
    window.ScrollTrigger?.refresh();
  }));
  const journey = [
    ['Coffee blossoms','A new beginning','The journey begins with delicate white coffee blossoms. Flowering gives way to fruit, shaped by the growing season and the care of the farm team.','assets/images/blossom.webp','White Robusta coffee blossoms'],
    ['Growing cherries','Time to grow','Green cherries develop along the branch. Fruit on the same tree can mature at different rates, so careful observation guides the harvest.','assets/images/green-coffee.webp','Unripe green coffee cherries on a branch'],
    ['Selective harvesting','Every cherry matters','Ripe cherries are selected by hand while younger fruit remains on the tree for another round. Availability follows crop conditions.','assets/images/farm/coffee-harvest.jpg','A basket of handpicked coffee cherries at Nechekattu Farm'],
    ['Processing','Care after harvest','The harvest is sorted and prepared for its chosen method. Natural coffee dries in the whole cherry; pulped coffee has the outer skin removed.','assets/images/harvest.webp','Coffee harvest and handling'],
    ['Raised bed drying','Air, sunlight & attention','Raised beds allow airflow beneath the coffee. Regular turning and monitoring help the team follow the drying progress of each lot.','assets/images/farm/coffee-drying.jpg','Coffee cherries drying on raised beds at Nechekattu Farm'],
    ['Green coffee','Ready for the next chapter','After drying and preparation, green coffee carries the work of the farm towards roasting and the cup. Discover the process on a seasonal farm visit.','assets/images/beans.webp','Unroasted green coffee beans']
  ];
  let step = 0;
  function selectStep(index, focus = false) {
    step = Math.max(0, Math.min(journey.length - 1, index)); const data = journey[step];
    $$('[data-step]').forEach((el,i) => { el.setAttribute('aria-selected', String(i === step)); el.tabIndex = i === step ? 0 : -1; if (i === step && focus) el.focus(); });
    const image = $('.journey-photo'); if (image) { image.src = data[3]; image.alt = data[4]; }
    $('[data-journey-title]').textContent = data[0]; $('[data-journey-eyebrow]').textContent = data[1]; $('[data-journey-copy]').textContent = data[2];
    $('#journey-panel').setAttribute('aria-labelledby', 'journey-tab-' + step);
    $('[data-journey-prev]').disabled = step === 0; $('[data-journey-next]').disabled = step === journey.length - 1;
    $('.journey-progress span').style.width = ((step + 1) / journey.length * 100) + '%';
    if (!reducedMotion.matches && window.gsap) gsap.fromTo('.journey-photo', { opacity:.4 }, { opacity:1, duration:.45, overwrite:true });
  }
  $$('[data-step]').forEach(el => el.addEventListener('click', () => selectStep(Number(el.dataset.step))));
  $('[data-journey-prev]')?.addEventListener('click', () => selectStep(step - 1));
  $('[data-journey-next]')?.addEventListener('click', () => selectStep(step + 1));
  $('.journey-tabs')?.addEventListener('keydown', event => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault(); let target = event.key === 'Home' ? 0 : event.key === 'End' ? 5 : (step + (event.key === 'ArrowRight' ? 1 : 5)) % 6; selectStep(target, true);
  });
  // Enquiry preparation is deliberately honest: no backend, no false delivery state.
  const form = $('#visit-form'); let enquiryText = '';
  if (form) {
    const dateInput = $('#date');
    const localToday = () => { const now = new Date(); return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-'); };
    dateInput.min = localToday();
    if (whatsapp) $('[data-delivery-note]').textContent = 'Complete the form and submit to open a prepared WhatsApp message to +91 97786 99064. Review the details, then press Send in WhatsApp.';
    else if (email) $('[data-delivery-note]').textContent = 'Complete the form to prepare an email enquiry for the farm team.';
    const validateField = (field, show = true) => {
      let error = ''; const value = field.value.trim();
      if (field.name === 'consent') { if (!field.checked) error = 'Please confirm consent before preparing your enquiry.'; }
      else if (!value) error = 'Please complete this field.';
      else if (field.name === 'email' && !isEmail(value)) error = 'Enter a valid email address.';
      else if (field.name === 'phone' && (!/^[+\d\s().-]+$/.test(value) || value.replace(/\D/g,'').length < 7 || value.replace(/\D/g,'').length > 15)) error = 'Enter a valid phone number with country code.';
      else if (field.name === 'date' && (field.validity.badInput || value < localToday())) error = 'Choose today or a future date.';
      else if (field.name === 'visitors' && (!Number.isInteger(Number(value)) || Number(value) < 1)) error = 'Enter a whole number of at least 1 visitor.';
      if (show) { field.setAttribute('aria-invalid', String(Boolean(error))); const target = $('#' + field.id + '-error'); if (target) target.textContent = error; }
      return !error;
    };
    $$('[required]', form).forEach(field => { field.addEventListener('blur', () => validateField(field)); field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); }); field.addEventListener('change', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); }); });
    form.addEventListener('reset', () => { $$('.field-error',form).forEach(el => el.textContent=''); $$('[aria-invalid]',form).forEach(el => el.removeAttribute('aria-invalid')); $('.form-status').textContent=''; });
    form.addEventListener('submit', event => {
      event.preventDefault(); dateInput.min = localToday();
      const fields = $$('[required]', form); const invalid = fields.filter(field => !validateField(field));
      if (invalid.length) { $('.form-status').textContent = 'Please check the highlighted fields.'; invalid[0].focus(); return; }
      $('.form-status').textContent='';
      const data = new FormData(form); const activities = data.getAll('activities');
      enquiryText = ['NECHEKATTU FARM — VISIT ENQUIRY','', 'Name: ' + data.get('name').trim(), 'Email: ' + data.get('email').trim(), 'Phone / WhatsApp: ' + data.get('phone').trim(), 'Preferred date: ' + data.get('date'), 'Visitors: ' + data.get('visitors'), 'Experience: ' + data.get('experience'), 'Preferred activities: ' + (activities.join(', ') || 'Please advise'), '', 'Additional requirements:', data.get('requirements').trim() || 'None specified', '', 'Message:', data.get('message').trim() || 'I would like to enquire about a farm visit.', '', 'I consent to sharing these details so the farm team can respond to this enquiry.', 'I understand that the visit and seasonal activities require confirmation.'].join('\n');
      const dialog = $('.enquiry-dialog'); $('.enquiry-preview').textContent = enquiryText;
      $('[data-enquiry-feedback]').textContent = whatsapp ? 'WhatsApp has been opened with your enquiry for +91 97786 99064. Review the details and press Send. If it did not open, use the Open WhatsApp button below.' : email ? 'Your email enquiry is prepared. Open the email draft below, review it and press Send.' : 'Your enquiry is prepared. Copy or download your message to keep it; it has not been sent.';
      const emailLink = $('[data-send-email]'); emailLink.hidden = !email; if(email) emailLink.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Farm visit enquiry — ' + data.get('date')) + '&body=' + encodeURIComponent(enquiryText);
      const waLink = $('[data-send-whatsapp]'); waLink.hidden = !whatsapp;
      if(whatsapp) {
        const waUrl = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(enquiryText);
        waLink.href = waUrl;
        window.open(waUrl, '_blank', 'noopener');
      }
      dialog.showModal(); lockForDialog();
    });
    $('[data-copy-enquiry]').addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.writeText && window.isSecureContext) await navigator.clipboard.writeText(enquiryText);
        else { const textarea=document.createElement('textarea'); textarea.value=enquiryText; textarea.style.position='fixed'; textarea.style.opacity='0'; $('.enquiry-dialog').append(textarea); textarea.select(); const copied=document.execCommand('copy'); textarea.remove(); if(!copied) throw new Error('Copy unavailable'); }
        toast('Enquiry copied. It has not been sent.');
      } catch { toast('Copy is unavailable here. Use Download .txt to save your enquiry.'); }
    });
    $('[data-download-enquiry]').addEventListener('click', () => {
      const url=URL.createObjectURL(new Blob([enquiryText],{type:'text/plain;charset=utf-8'})); const a=document.createElement('a'); a.href=url; a.download='Nechekattu-Farm-Visit-Enquiry.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  // Progressive enhancement: content stays readable if GSAP is unavailable.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-reveal', { opacity:0, y:30, duration:1.1, stagger:.12, ease:'power2.out', clearProps:'opacity,transform' });
      gsap.fromTo('.hero-media', { scale:1.06 }, { scale:1, duration:2.4, ease:'power2.out', clearProps:'transform' });
      $$('.reveal').forEach(el => gsap.from(el, { opacity:0, y:30, duration:.85, ease:'power2.out', clearProps:'opacity,transform', scrollTrigger:{ trigger:el, start:'top 94%', once:true } }));
      $$('.cta-banner img').forEach(el => gsap.fromTo(el, { yPercent:-6, scale:1.12 }, { yPercent:6, ease:'none', scrollTrigger:{ trigger:el.parentElement, start:'top bottom', end:'bottom top', scrub:true } }));
      gsap.from('.site-footer .footer-top', { opacity:.5, y:20, duration:.8, clearProps:'opacity,transform', scrollTrigger:{ trigger:'.site-footer',start:'top 95%',once:true } });
    });
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once:true });
  }
})();
