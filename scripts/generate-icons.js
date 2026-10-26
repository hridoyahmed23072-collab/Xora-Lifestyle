import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Table for CRC-32
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createPng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0; // Filter: None
    const rowOffsetRgba = y * width * 4;
    const rowOffsetScanline = y * (1 + width * 4) + 1;
    rgbaBuffer.copy(scanlines, rowOffsetScanline, rowOffsetRgba, rowOffsetRgba + width * 4);
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTarget = Buffer.alloc(4 + len);
  chunk.copy(crcTarget, 0, 4, 8 + len);
  const crcVal = crc32(crcTarget);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function renderXoraIcon(size, isMaskable = false) {
  const buf = Buffer.alloc(size * size * 4);

  const bgR = 150, bgG = 45, bgB = 62; // #962D3E
  const deepR = 92, deepG = 16, deepB = 31; // #5C101F
  const goldR = 212, goldG = 175, goldB = 55; // #D4AF37
  const goldLightR = 245, goldLightG = 222, goldLightB = 140;
  const bagR = 250, bagG = 247, bagB = 242; // #FAF7F2

  const cornerRadius = isMaskable ? 0 : size * 0.22;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Check rounded corner clip for standard icon
      if (!isMaskable && cornerRadius > 0) {
        let inCorner = false;
        let cx = 0, cy = 0;
        if (x < cornerRadius && y < cornerRadius) { cx = cornerRadius; cy = cornerRadius; inCorner = true; }
        else if (x > size - 1 - cornerRadius && y < cornerRadius) { cx = size - 1 - cornerRadius; cy = cornerRadius; inCorner = true; }
        else if (x < cornerRadius && y > size - 1 - cornerRadius) { cx = cornerRadius; cy = size - 1 - cornerRadius; inCorner = true; }
        else if (x > size - 1 - cornerRadius && y > size - 1 - cornerRadius) { cx = size - 1 - cornerRadius; cy = size - 1 - cornerRadius; inCorner = true; }

        if (inCorner) {
          const dist = Math.hypot(x - cx, y - cy);
          if (dist > cornerRadius) {
            buf[idx + 3] = 0; // transparent
            continue;
          }
        }
      }

      // Base background: luxury gradient top-left to bottom-right
      const gradT = (x + y) / (size * 2);
      let r = Math.round(bgR * (1 - gradT * 0.5) + deepR * (gradT * 0.5));
      let g = Math.round(bgG * (1 - gradT * 0.5) + deepG * (gradT * 0.5));
      let b = Math.round(bgB * (1 - gradT * 0.5) + deepB * (gradT * 0.5));
      let a = 255;

      // Normal coordinates [0, 1]
      const nx = x / size;
      const ny = y / size;

      // Safe area scaling: if maskable, keep bag icon centered at scale 0.7
      const scale = isMaskable ? 0.68 : 0.85;
      const sx = (nx - 0.5) / scale + 0.5;
      const sy = (ny - 0.5) / scale + 0.5;

      // Handle arch: centered between sx: [0.38, 0.62], sy: [0.22, 0.38]
      const hx = (sx - 0.5) / 0.14; // -1 to 1
      const hy = (sy - 0.36) / 0.16; // handle arch top ~ 0.20
      const handleDist = Math.hypot(hx, Math.min(0, hy));
      const handleStroke = Math.abs(handleDist - 1.0);
      if (handleStroke < 0.15 && sy < 0.38 && sy > 0.18) {
        r = goldR; g = goldG; b = goldB;
      }

      // Bag Body: Trapezoid from sy: 0.35 to 0.76
      if (sy >= 0.35 && sy <= 0.76) {
        // Trapezoid width expands from 0.28 half-width at top to 0.24 half-width at bottom (fashion tote)
        const prog = (sy - 0.35) / 0.41;
        const halfW = 0.26 - prog * 0.04;
        const dx = Math.abs(sx - 0.5);

        if (dx <= halfW) {
          // Inside bag body
          if (sy <= 0.46) {
            // Bag Flap / Accent Stripe
            r = bgR; g = bgG; b = bgB;

            // Gold clasp at center
            if (Math.abs(sx - 0.5) < 0.04 && sy >= 0.42 && sy <= 0.47) {
              r = goldLightR; g = goldLightG; b = goldLightB;
            }
          } else {
            // Main Bag body: Off-white luxury leather texture
            r = bagR; g = bagG; b = bagB;

            // Monogram 'X' in the center: sy in [0.52, 0.68], dx in [0, 0.09]
            if (sy >= 0.52 && sy <= 0.68 && dx <= 0.09) {
              const xNorm = dx / 0.09;
              const yNorm = (sy - 0.60) / 0.08;
              const diagDist1 = Math.abs(xNorm - Math.abs(yNorm));
              if (diagDist1 < 0.28) {
                r = bgR; g = bgG; b = bgB;
              }
            }
          }

          // Bag outer border stitch/shadow
          if (dx > halfW - 0.012 || sy > 0.748) {
            r = Math.round(r * 0.85);
            g = Math.round(g * 0.85);
            b = Math.round(b * 0.85);
          }
        }
      }

      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = a;
    }
  }

  return buf;
}

// Generate all required icons
const publicDir = path.resolve('public');
const sizes = [
  { file: 'pwa-192x192.png', size: 192, maskable: false },
  { file: 'pwa-512x512.png', size: 512, maskable: false },
  { file: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
  { file: 'favicon.ico', size: 64, maskable: false },
];

for (const item of sizes) {
  const rgba = renderXoraIcon(item.size, item.maskable);
  const pngBuf = createPng(item.size, item.size, rgba);
  const dest = path.join(publicDir, item.file);
  fs.writeFileSync(dest, pngBuf);
  console.log(`Generated ${item.file} (${item.size}x${item.size}, ${pngBuf.length} bytes)`);
}
