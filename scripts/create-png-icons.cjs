const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure-node PNG encoder
function createSolidPNG(width, height, r, g, b, a = 255) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8 bits per channel
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression: deflate
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace: none

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image scanlines
  // Each scanline begins with filter byte 0
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // filter type 0 (None)

    // Center gradient or shape
    const cy = height / 2;
    const dy = (y - cy) / cy;

    for (let x = 0; x < width; x++) {
      const cx = width / 2;
      const dx = (x - cx) / cx;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const pixelOffset = rowOffset + 1 + x * 4;
      if (dist < 0.85) {
        // Inner gradient
        const blend = 1 - dist;
        rawData[pixelOffset] = Math.min(255, Math.floor(r + (99 - r) * blend));
        rawData[pixelOffset + 1] = Math.min(255, Math.floor(g + (102 - g) * blend));
        rawData[pixelOffset + 2] = Math.min(255, Math.floor(b + (241 - b) * blend));
        rawData[pixelOffset + 3] = a;
      } else {
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = a;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)) >>> 0;
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Brand dark theme colors #0f172a
const r = 15, g = 23, b = 42;

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidPNG(192, 192, r, g, b));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidPNG(512, 512, r, g, b));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidPNG(512, 512, r, g, b));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPNG(180, 180, r, g, b));

console.log('Successfully generated compliant PWA icons in /public!');
