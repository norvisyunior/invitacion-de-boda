const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const list = await fetch('http://127.0.0.1:9223/json').then((r) => r.json());
  const page = list.find((t) => t.type === 'page');
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Network.enable');
  await send('Network.clearBrowserCache');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await sleep(2000);
  await send('Runtime.evaluate', { expression: 'sessionStorage.clear()', returnByValue: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await sleep(2500);
  await send('Runtime.evaluate', {
    expression: `(() => { const b = document.querySelector('.envelope-seal'); if (b) b.click(); return true; })()`,
    returnByValue: true,
  });
  await sleep(2200);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('node:fs');
  fs.writeFileSync('scripts/shot-hero-contrast.png', Buffer.from(shot.data, 'base64'));
  console.log('saved scripts/shot-hero-contrast.png');
  ws.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
