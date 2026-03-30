require('dotenv').config({ path: '.env.local' });

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const http = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Optional: Analytics proxy (e.g. Umami, Plausible)
// const ANALYTICS_TARGET = 'http://127.0.0.1:3001';
// Uncomment and configure if you use a self-hosted analytics service.

const STATS_FILE = path.join(__dirname, '.stats.json');

function loadStats() {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data.accumulatedRuntime === 'number' && typeof data.totalVisits === 'number') {
        console.log('[STATS] Loaded from file:', data);
        return data;
      }
    }
  } catch (err) {
    console.error('[STATS] Failed to load file, starting fresh:', err.message);
  }
  return { accumulatedRuntime: 0, totalVisits: 0 };
}

function saveStats(stats) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats), 'utf-8');
  } catch (err) {
    console.error('[STATS] Failed to save file:', err.message);
  }
}

async function main() {
  let stats = loadStats();
  let sessionStartTime = Date.now();
  let onlineCount = 0;

  const sseClients = new Set();

  const heartbeats = new Set();

  function broadcastOnlineCount() {
    const data = `data: ${JSON.stringify({ onlineCount })}\n\n`;
    for (const client of sseClients) {
      client.write(data);
    }
  }

  function flushRuntime() {
    const now = Date.now();
    stats.accumulatedRuntime += now - sessionStartTime;
    sessionStartTime = now;
  }

  function flushAndSave() {
    flushRuntime();
    saveStats(stats);
  }

  const saveInterval = setInterval(flushAndSave, 60000);

  await app.prepare();

  const httpServer = createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);

    if (parsedUrl.pathname === '/api/sse/stats') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      onlineCount++;
      stats.totalVisits++;
      flushAndSave();
      console.log(`SSE client connected. Online: ${onlineCount}, Total visits: ${stats.totalVisits}`);

      sseClients.add(res);
      res.write(`data: ${JSON.stringify({ onlineCount })}\n\n`);
      broadcastOnlineCount();

      const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
      }, 30000);
      heartbeats.add(heartbeat);

      req.on('close', () => {
        onlineCount = Math.max(0, onlineCount - 1);
        sseClients.delete(res);
        clearInterval(heartbeat);
        heartbeats.delete(heartbeat);
        console.log(`SSE client disconnected. Online: ${onlineCount}`);
        broadcastOnlineCount();
      });

      return;
    }

    if (parsedUrl.pathname === '/api/stats') {
      const currentRuntime = stats.accumulatedRuntime + (Date.now() - sessionStartTime);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        runtime: currentRuntime,
        visits: stats.totalVisits,
      }));
      return;
    }

    // Optional: Analytics proxy route
    // if (parsedUrl.pathname.startsWith('/analytics/')) {
    //   proxyToAnalytics(req, res, parsedUrl);
    //   return;
    // }

    handle(req, res, parsedUrl);
  });

  function gracefulShutdown(signal) {
    console.log(`[STATS] Received ${signal}, saving and shutting down...`);
    flushRuntime();
    saveStats(stats);
    clearInterval(saveInterval);
    for (const hb of heartbeats) {
      clearInterval(hb);
    }
    heartbeats.clear();
    for (const client of sseClients) {
      client.end();
    }
    sseClients.clear();
    httpServer.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 3000);
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

  const port = process.env.PORT || 3000;
  httpServer
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    })
    .on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
}

main().catch(ex => {
    console.error(ex.stack);
    process.exit(1);
});
