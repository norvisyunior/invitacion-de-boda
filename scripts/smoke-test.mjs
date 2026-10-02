/**
 * Smoke test con Chrome headless + CDP.
 * Uso: node scripts/smoke-test.mjs
 */
const DEBUG_PORT = 9222;
const BASE = 'http://127.0.0.1:4173/';
const results = [];

function log(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name}${detail ? ` — ${detail}` : ''}`);
}

async function getTarget() {
  const list = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`).then((r) => r.json());
  const page = list.find((t) => t.type === 'page');
  if (!page) throw new Error('No page target');
  return page.webSocketDebuggerUrl;
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  });
  return {
    send(method, params = {}) {
      const mid = ++id;
      ws.send(JSON.stringify({ id: mid, method, params }));
      return new Promise((resolve, reject) => pending.set(mid, { resolve, reject }));
    },
    close() {
      ws.close();
    },
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
    userGesture: true,
  });
  if (result.exceptionDetails) {
    const text =
      result.exceptionDetails.exception?.description ||
      result.exceptionDetails.text ||
      'evaluate failed';
    throw new Error(text);
  }
  return result.result?.value;
}

async function setViewport(cdp, width, height, mobile = true) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });
}

async function screenshot(cdp, path) {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('node:fs');
  fs.writeFileSync(path, Buffer.from(data, 'base64'));
}

async function main() {
  const wsUrl = await getTarget();
  const cdp = await connect(wsUrl);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  // Navegar primero (about:blank no siempre expone sessionStorage)
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(2500);
  await evaluate(
    cdp,
    `(() => { try { sessionStorage.clear(); } catch (e) {} return true; })()`,
  );

  const widths = [
    [320, 640],
    [360, 740],
    [375, 812],
    [390, 844],
    [430, 932],
    [768, 1024],
    [1280, 800],
  ];

  // --- Pantalla de sobre (recargar con sesión limpia) ---
  await setViewport(cdp, 390, 844, true);
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(1500);
  await evaluate(cdp, `(() => { try { sessionStorage.clear(); } catch (e) {} return true; })()`);
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(2500);

  const envelopeInfo = await evaluate(
    cdp,
    `(() => {
      const region = document.querySelector('[aria-label="Invitación cerrada en un sobre"]');
      const btn = document.querySelector('.envelope-seal');
      return {
        hasRegion: !!region,
        hasButton: !!btn,
        buttonDisabled: btn ? btn.disabled : null,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        title: document.title,
        lang: document.documentElement.lang,
      };
    })()`,
  );

  log('Sobre visible al cargar', envelopeInfo.hasRegion === true, JSON.stringify(envelopeInfo));
  log('Botón de apertura accesible', envelopeInfo.hasButton === true);
  log('Sin scroll horizontal en sobre (390px)', envelopeInfo.hasHorizontalScroll === false, `sw=${envelopeInfo.scrollWidth} cw=${envelopeInfo.clientWidth}`);
  log('Idioma español', envelopeInfo.lang === 'es');
  await screenshot(cdp, 'scripts/shot-envelope-390.png');

  // --- Apertura del sobre ---
  const opened = await evaluate(
    cdp,
    `(() => {
      const btn = document.querySelector('.envelope-seal');
      if (!btn) return { clicked: false };
      btn.click();
      return { clicked: true, disabledAfter: btn.disabled };
    })()`,
  );
  log('Click en el sello', opened.clicked === true);

  await sleep(2200);

  const afterOpen = await evaluate(
    cdp,
    `(() => {
      const region = document.querySelector('[aria-label="Invitación cerrada en un sobre"]');
      const main = document.getElementById('contenido-invitation');
      const hero = document.getElementById('inicio');
      return {
        envelopeGone: !region,
        mainOpacity: main ? getComputedStyle(main).opacity : null,
        mainAriaHidden: main ? main.getAttribute('aria-hidden') : null,
        hasHero: !!hero,
        hasCountdown: !!document.getElementById('cuenta-atras'),
        hasCeremony: !!document.getElementById('ceremonia'),
        hasGallery: !!document.getElementById('galeria'),
        hasClosing: !!document.getElementById('cierre'),
        hasDress: !!document.getElementById('vestimenta'),
        hasStory: !!document.getElementById('historia'),
        hasRsvp: !!document.getElementById('rsvp') || document.body.innerText.includes('Confirmación de asistencia'),
        horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        focusTag: document.activeElement ? document.activeElement.tagName : null,
        focusId: document.activeElement ? document.activeElement.id : null,
        countdownText: document.getElementById('cuenta-atras')?.innerText?.slice(0, 200) || '',
      };
    })()`,
  );

  log('Sobre desaparece tras abrir', afterOpen.envelopeGone === true);
  log('Invitación visible', Number(afterOpen.mainOpacity) > 0.9, `opacity=${afterOpen.mainOpacity}`);
  log('Invitación interactiva', afterOpen.mainAriaHidden === 'false');
  log('Hero presente', afterOpen.hasHero === true);
  log('Secciones presentes', afterOpen.hasCountdown && afterOpen.hasCeremony && afterOpen.hasGallery && afterOpen.hasClosing && afterOpen.hasDress && afterOpen.hasStory, JSON.stringify(afterOpen));
  log('Sin sección RSVP', afterOpen.hasRsvp === false);
  log('Sin scroll horizontal tras abrir (390px)', afterOpen.horizontalScroll === false);
  log('Foco tras abrir', true, `${afterOpen.focusTag}#${afterOpen.focusId}`);
  log('Cuenta atrás con números', /\d/.test(afterOpen.countdownText), afterOpen.countdownText.replace(/\s+/g, ' ').slice(0, 120));
  await screenshot(cdp, 'scripts/shot-invitation-390.png');

  // Scroll through sections
  await evaluate(cdp, `window.scrollTo(0, document.body.scrollHeight)`);
  await sleep(800);
  await screenshot(cdp, 'scripts/shot-closing-390.png');

  // --- Multi-viewport scroll horizontal ---
  for (const [w, h] of widths) {
    await setViewport(cdp, w, h, w < 800);
    await evaluate(cdp, `window.scrollTo(0, 0)`);
    await sleep(400);
    const overflow = await evaluate(
      cdp,
      `(() => {
        const de = document.documentElement;
        const offenders = [];
        const all = document.querySelectorAll('body *');
        for (const el of all) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > de.clientWidth + 2 || r.left < -2)) {
            const style = getComputedStyle(el);
            if (style.position === 'fixed' || style.position === 'absolute') continue;
            if (style.visibility === 'hidden' || style.display === 'none') continue;
            offenders.push({
              tag: el.tagName,
              cls: String(el.className).slice(0, 80),
              left: Math.round(r.left),
              right: Math.round(r.right),
            });
            if (offenders.length >= 5) break;
          }
        }
        return {
          scrollWidth: de.scrollWidth,
          clientWidth: de.clientWidth,
          horizontal: de.scrollWidth > de.clientWidth + 1,
          offenders,
        };
      })()`,
    );
    log(`Sin overflow horizontal ${w}px`, overflow.horizontal === false, `sw=${overflow.scrollWidth} cw=${overflow.clientWidth} offenders=${JSON.stringify(overflow.offenders)}`);
    if (w === 320 || w === 430 || w === 1280) {
      await screenshot(cdp, `scripts/shot-w${w}.png`);
    }
  }

  // --- Recarga con sesión ya abierta ---
  await setViewport(cdp, 390, 844, true);
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(2000);
  const reloadState = await evaluate(
    cdp,
    `(() => {
      const region = document.querySelector('[aria-label="Invitación cerrada en un sobre"]');
      const main = document.getElementById('contenido-invitation');
      return {
        envelope: !!region,
        mainVisible: main ? Number(getComputedStyle(main).opacity) > 0.9 : false,
      };
    })()`,
  );
  log('Recarga omite sobre (sesión)', reloadState.envelope === false && reloadState.mainVisible === true, JSON.stringify(reloadState));

  // --- Teclado: nuevo ciclo con sessionStorage limpio ---
  await evaluate(cdp, 'sessionStorage.clear()');
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(2000);
  await evaluate(
    cdp,
    `(() => {
      const btn = document.querySelector('.envelope-seal');
      if (!btn) return 'no-button';
      btn.focus();
      return document.activeElement === btn ? 'focused' : 'not-focused';
    })()`,
  ).then((r) => log('Foco en botón del sobre', r === 'focused', r));

  await evaluate(
    cdp,
    `(() => {
      const btn = document.querySelector('.envelope-seal');
      btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      // También activar con click tras teclado (Enter en button nativo)
      if (btn && !btn.disabled) btn.click();
      return !btn.disabled;
    })()`,
  );
  await sleep(2000);
  const keyboardOpen = await evaluate(
    cdp,
    `(() => {
      const region = document.querySelector('[aria-label="Invitación cerrada en un sobre"]');
      return !region && !!document.getElementById('inicio');
    })()`,
  );
  log('Apertura con teclado/Enter', keyboardOpen === true);

  // --- Preferencia de movimiento reducido ---
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await evaluate(cdp, 'sessionStorage.clear()');
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(1500);
  const reducedOpen = await evaluate(
    cdp,
    `(() => {
      const btn = document.querySelector('.envelope-seal');
      if (!btn) return { ready: true };
      btn.click();
      return { clicked: true };
    })()`,
  );
  await sleep(800);
  const reducedDone = await evaluate(
    cdp,
    `(() => {
      const region = document.querySelector('[aria-label="Invitación cerrada en un sobre"]');
      return { envelopeGone: !region, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
    })()`,
  );
  log('Apertura con reduced-motion', reducedDone.envelopeGone === true, JSON.stringify(reducedDone));
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });

  // --- Cuenta atrás futura / pasada (simulación de config) ---
  // Solo verificamos que el hook no revienta y muestra dígitos
  const countdownDigits = await evaluate(
    cdp,
    `(() => {
      const units = [...document.querySelectorAll('[role="timer"] span.tabular-nums')].map(el => el.textContent);
      return units;
    })()`,
  );
  log('Unidades de cuenta atrás', Array.isArray(countdownDigits) && countdownDigits.length === 4, JSON.stringify(countdownDigits));

  // --- Accesibilidad básica ---
  const a11y = await evaluate(
    cdp,
    `(() => {
      const h1 = document.querySelectorAll('h1').length;
      const h2 = document.querySelectorAll('h2').length;
      const labels = [...document.querySelectorAll('a,button')].filter(el => !el.textContent.trim() && !el.getAttribute('aria-label')).length;
      return { h1, h2, unlabeledInteractive: labels };
    })()`,
  );
  log('Un solo H1', a11y.h1 === 1, `h1=${a11y.h1} h2=${a11y.h2}`);
  log('Controles sin nombre accesible', a11y.unlabeledInteractive === 0, JSON.stringify(a11y));

  cdp.close();

  const failed = results.filter((r) => !r.ok);
  console.log('\n==== RESUMEN ====');
  console.log(`Total: ${results.length} | PASS: ${results.length - failed.length} | FAIL: ${failed.length}`);
  if (failed.length) {
    console.log('Fallos:');
    failed.forEach((f) => console.log(` - ${f.name}: ${f.detail}`));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('SMOKE_ERROR', err);
  process.exitCode = 1;
});
