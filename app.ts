if (process.env.NODE_ENV !== 'production')
    await import('dotenv/config');

import sharp from 'sharp';
import {join} from 'path';
import {parse} from 'url';
import {createServer} from 'http';

import {serveImage, NotImplementedError, RequestError} from '@archival-iiif/image-server-core';

sharp.concurrency(process.env.IIIF_IMAGE_CONCURRENCY ? parseInt(process.env.IIIF_IMAGE_CONCURRENCY) : 0);
if (process.env.NODE_ENV !== 'production')
    sharp.queue.on('change', queueLength =>
        console.log(`Image queue now contains ${queueLength} task(s)`));

console.log('Dependencies:');
console.table(sharp.versions);

console.log(`Available image input formats: ${(Object.values(sharp.format) as sharp.AvailableFormatInfo[])
    .filter(format => format.input.file)
    .map(format => format.id)
    .join(', ')}`);

console.log(`Available image output formats: ${(Object.values(sharp.format) as sharp.AvailableFormatInfo[])
    .filter(format => format.output.buffer)
    .map(format => format.id)
    .join(', ')}`);

console.log(`Number of image processing threads: ${sharp.concurrency()}`);

const server = createServer(async (req, res) => {
    try {
        const parsedUrl = parse(req.url as string, true);
        const path = parsedUrl.pathname as string;
        const parts = path.substring(1).split('/');

        if (parts.length === 5 && parts[4].indexOf('.') >= 0) {
            const imagePath = decodeURIComponent(parts[0]);
            const region = parts[1];
            const size = parts[2];
            const rotation = parts[3];
            const quality = parts[4].substring(0, parts[4].indexOf('.'));
            const format = parts[4].substring(parts[4].indexOf('.') + 1);

            process.env.NODE_ENV !== 'production' && console.log(`Received a request for an image on path ${imagePath}`);

            const path = join(process.env.IIIF_IMAGE_ROOT_PATH as string, imagePath);
            const maxSize = Array.isArray(parsedUrl.query.max)
                ? parseInt(parsedUrl.query.max[0])
                : parsedUrl.query.max
                    ? parseInt(parsedUrl.query.max)
                    : null;

            const image = await serveImage(path, maxSize, {region, size, rotation, quality, format});

            if (image.contentType) res.setHeader('Content-Type', image.contentType);
            if (image.contentLength) res.setHeader('Content-Length', String(image.contentLength));
            res.setHeader('Content-Disposition', `inline; filename="${imagePath}-${region}-${size}-${rotation}-${quality}.${format}"`);
            res.write(image.image);
            res.end();

            process.env.NODE_ENV !== 'production' && console.log(`Sending an image on path ${imagePath}`);
        }
        else {
            res.writeHead(404);
            res.end();
        }
    }
    catch (err: any) {
        if (err instanceof RequestError) {
            res.writeHead(400, err.message);
            res.end();
        }
        else if (err instanceof NotImplementedError) {
            res.writeHead(501, err.message);
            res.end();
        }
        else {
            console.error(`${err.status || 500} - ${req.method} - ${req.url} - ${err.message}`, {err});
            res.writeHead(500, 'Internal Server Error');
            res.end();
        }
    }
});

server.listen(parseInt(process.env.IIIF_IMAGE_PORT as string), () =>
    console.log(`Image server started on http://localhost:${process.env.IIIF_IMAGE_PORT} 🚀`));
