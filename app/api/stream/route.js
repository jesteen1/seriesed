export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const magnet = searchParams.get('magnet');
  const range = req.headers.get('range');

  return new Promise((resolve) => {
    const wt = getClient();

    wt.add(magnet, (torrent) => {
      const file = torrent.files.find(f =>
        f.name.match(/\.(mp4|mkv|avi|m4v|webm)$/i)
      );

      if (!file) {
        resolve(new Response('Not found', { status: 404 }));
        return;
      }

      const fileLength = file.length;

      // Handle range request
      if (range) {
        const [startStr, endStr] = range.replace('bytes=', '').split('-');
        const start = parseInt(startStr);
        const end = endStr ? parseInt(endStr) : fileLength - 1;
        const chunkSize = end - start + 1;

        const nodeStream = file.createReadStream({ start, end });
        const { Readable } = require('stream');
        const webStream = Readable.toWeb(nodeStream);

        resolve(new Response(webStream, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${fileLength}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize.toString(),
            'Content-Type': 'video/mp4',
          },
        }));
      } else {
        const nodeStream = file.createReadStream();
        const { Readable } = require('stream');
        const webStream = Readable.toWeb(nodeStream);

        resolve(new Response(webStream, {
          headers: {
            'Content-Length': fileLength.toString(),
            'Accept-Ranges': 'bytes',
            'Content-Type': 'video/mp4',
          },
        }));
      }
    });
  });
}