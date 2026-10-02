const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const list = await fetch('http://127.0.0.1:9223/json').then((r) => r.json());
  const page = list.find((t) => t.type === 'page');
  if (!page) throw new Error('no page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m.result)));
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await sleep(2000);
  await send('Runtime.evaluate', { expression: 'sessionStorage.clear()', returnByValue: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await sleep(2500);

  const envelope = await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.querySelector('.envelope-seal img, .envelope-card img');
      return { hasLogo: !!img, src: img ? img.getAttribute('src') : null, natural: img ? img.naturalWidth : 0 };
    })()`,
    returnByValue: true,
  });
  console.log('ENVELOPE', JSON.stringify(envelope.result.value));

  await send('Runtime.evaluate', {
    expression: `(() => { const b = document.querySelector('.envelope-seal'); if (b) b.click(); return !!b; })()`,
    returnByValue: true,
  });
  await sleep(2300);

  const hero = await send('Runtime.evaluate', {
    expression: `(() => {
      const imgs = [...document.querySelectorAll('#inicio img')];
      const bg = imgs.find((i) => (i.getAttribute('src') || '').includes('fondo-header'));
      const logo = imgs.find((i) => (i.getAttribute('src') || '').includes('icono-app'));
      return {
        bgSrc: bg ? bg.getAttribute('src') : null,
        bgNatural: bg ? bg.naturalWidth : 0,
        logoSrc: logo ? logo.getAttribute('src') : null,
        logoNatural: logo ? logo.naturalWidth : 0,
      };
    })()`,
    returnByValue: true,
  });
  console.log('HERO', JSON.stringify(hero.result.value));

  const closing = await send('Runtime.evaluate', {
    expression: `(() => {
      const logo = document.querySelector('#cierre img');
      return { hasClosingLogo: !!logo, src: logo ? logo.getAttribute('src') : null };
    })()`,
    returnByValue: true,
  });
  console.log('CLOSING', JSON.stringify(closing.result.value));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('node:fs');
  fs.writeFileSync('scripts/shot-assets-hero.png', Buffer.from(shot.data, 'base64'));
  ws.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
