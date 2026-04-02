// app/api/stream/route.js
import WebTorrent from 'webtorrent';

const client = new WebTorrent(); // Node.js — supports ALL tracker types

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const magnet = searchParams.get('magnet');

  return new Promise((resolve) => {
    client.add(magnet, (torrent) => {
      const file = torrent.files.find(f =>
        f.name.match(/\.(mp4|mkv|avi|m4v|webm)$/i)
      );

      if (!file) {
        resolve(new Response('No video file found', { status: 404 }));
        return;
      }

      // Stream the file directly to the client
      const stream = file.createReadStream();
      resolve(new Response(stream, {
        headers: {
          'Content-Type': 'video/mp4',
          'Transfer-Encoding': 'chunked',
        },
      }));
    });
  });
}