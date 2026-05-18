const https = require('https');
const { URL } = require('url');

async function sendWebhook(webhookUrl, payload) {
  if (!webhookUrl) return false;
  const body = JSON.stringify(payload);
  const url = new URL(webhookUrl);

  return new Promise((resolve) => {
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => resolve(res.statusCode === 204 || res.statusCode === 200));
    req.on('error', () => resolve(false));
    req.write(body);
    req.end();
  });
}

module.exports = { sendWebhook };
