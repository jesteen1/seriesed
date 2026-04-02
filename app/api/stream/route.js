/ app/api/stream/route.js
import WebTorrent from 'webtorrent';
import { Readable } from 'stream';
 
// Single shared client across requests
let client = null;
 
function getClient() {
  if (!client) {
    client = new WebTorrent();
    client.on('error', (err) => console.error('[WebTorrent Error]', err));
  }
  return client;
}
 
function sanitizeMagnet(magnet) {
  try {
    const url = new URL(magnet);
    const trackers = [];
 
    // Fix tr.1, tr.2, tr.3 style params → collect all tracker values
    url.searchParams.forEach((value, key) => {
      if (key === 'tr' || key.startsWith('tr.')) {
        trackers.push(value);
      }
    });
 
    const xt = url.searchParams.get('xt');
    const dn = url.searchParams.get('dn') || '';
 
    if (!xt) throw new Error('Missing xt in magnet');
 
    // Add reliable trackers
    const extraTrackers = [
      'udp://tracker.opentrackr.org:1337/announce',
      'udp://tracker.openbittorrent.com:6969/announce',
      'udp://open.demonii.com:1337/announce',
      'udp://tracker.torrent.eu.org:451/announce',
      'http://bt1.archive.org:6969/announce',
      'http://bt2.archive.org:6969/announce',
    ];
 
    const allTrackers = [...new Set([...trackers, ...extraTrackers])];
 
    let clean = `magnet:?xt=${encodeURIComponent(xt)}&dn=${encodeURIComponent(dn)}`;
    allTrackers.forEach((t) => {
      clean += `&tr=${encodeURIComponent(t)}`;
    });
 
    return clean;
  } catch (err) {
    console.error('[sanitizeMagnet error]', err);
    return magnet; // return original if parsing fails
  }
}
 
function getOrAddTorrent(wt, magnet) {
  return new Promise((resolve, reject) => {
    // Check if torrent already added
    const existing = wt.torrents.find(
      (t) => t.infoHash === extractInfoHash(magnet)
    );
    if (existing) {
      resolve(existing);
      return;
    }
 
    const timeout = setTimeout(() => {
      reject(new Error('Torrent magnetize timeout (30s)'));
    }, 30000);
 
    wt.add(magnet, (torrent) => {
      clearTimeout(timeout);
      resolve(torrent);
    });
 
    wt.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}
 
function extractInfoHash(magnet) {
  try {
    const match = magnet.match(/urn:btih:([a-zA-Z0-9]+)/i);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}
 
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const rawMagnet = searchParams.get('magnet');
 
  if (!rawMagnet) {
    return new Response(JSON.stringify({ error: 'magnet param is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
 
  const magnet = sanitizeMagnet(rawMagnet);
  const range = req.headers.get('range');
 
  console.log('[Stream API] magnet:', magnet.slice(0, 80) + '...');
  console.log('[Stream API] range:', range);
 
  try {
    const wt = getClient();
    const torrent = await getOrAddTorrent(wt, magnet);
 
    // Find first video file
    const file = torrent.files.find((f) =>
      f.name.match(/\.(mp4|mkv|avi|m4v|webm|mov)$/i)
    );
 
    if (!file) {
      const fileList = torrent.files.map((f) => f.name).join(', ');
      return new Response(
        JSON.stringify({ error: 'No video file found', files: fileList }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
 
    console.log('[Stream API] Streaming file:', file.name, 'size:', file.length);
 
    const fileLength = file.length;
 
    // ── Range request (video seeking) ──────────────────────────────
    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileLength - 1;
      const chunkSize = end - start + 1;
 
      const nodeStream = file.createReadStream({ start, end });
      const webStream = Readable.toWeb(nodeStream);
 
      return new Response(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileLength}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': 'video/mp4',
          'Cache-Control': 'no-cache',
        },
      });
    }
 
    // ── Full file stream ───────────────────────────────────────────
    const nodeStream = file.createReadStream();
    const webStream = Readable.toWeb(nodeStream);
 
    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Length': String(fileLength),
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('[Stream API Error]', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}