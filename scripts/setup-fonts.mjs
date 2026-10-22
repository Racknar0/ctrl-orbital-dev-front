import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const directory = new URL('../src/assets/fonts/satoshi/', import.meta.url);
const filenames = ['Satoshi-Variable.woff2', 'Satoshi-VariableItalic.woff2'];

if (!filenames.every((name) => existsSync(new URL(name, directory)))) {
  console.log('Downloading Satoshi from Fontshare for use in this application...');
  const response = await fetch('https://api.fontshare.com/v2/fonts/download/satoshi');
  if (!response.ok) throw new Error(`Fontshare download failed: HTTP ${response.status}`);
  const archive = Buffer.from(await response.arrayBuffer());

  // Read only the requested official files; never extract arbitrary archive paths.
  let end = archive.length - 22;
  while (end >= Math.max(0, archive.length - 65557) && archive.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < Math.max(0, archive.length - 65557)) throw new Error('Invalid font archive');
  const count = archive.readUInt16LE(end + 10);
  let offset = archive.readUInt32LE(end + 16);
  const entries = new Map();

  for (let index = 0; index < count; index++) {
    if (archive.readUInt32LE(offset) !== 0x02014b50) throw new Error('Invalid ZIP directory');
    const method = archive.readUInt16LE(offset + 10);
    const size = archive.readUInt32LE(offset + 20);
    const filenameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localOffset = archive.readUInt32LE(offset + 42);
    const filename = archive.toString('utf8', offset + 46, offset + 46 + filenameLength);
    entries.set(filename, { method, size, localOffset });
    offset += 46 + filenameLength + extraLength + commentLength;
  }

  const extract = (filename) => {
    const entry = entries.get(filename);
    if (!entry) throw new Error(`Missing font archive entry: ${filename}`);
    const { method, size, localOffset } = entry;
    if (archive.readUInt32LE(localOffset) !== 0x04034b50) throw new Error('Invalid ZIP entry');
    const start = localOffset + 30 + archive.readUInt16LE(localOffset + 26) + archive.readUInt16LE(localOffset + 28);
    const compressed = archive.subarray(start, start + size);
    if (method === 0) return compressed;
    if (method === 8) return inflateRawSync(compressed, { maxOutputLength: 2 * 1024 * 1024 });
    throw new Error('Unsupported font archive compression');
  };

  await mkdir(directory, { recursive: true });
  for (const name of filenames) {
    const content = extract(`Satoshi_Complete/Fonts/WEB/fonts/${name}`);
    if (content.toString('ascii', 0, 4) !== 'wOF2') throw new Error(`Invalid WOFF2 font: ${name}`);
    await writeFile(new URL(name, directory), content);
  }
  await writeFile(new URL('LICENSE.txt', directory), extract('Satoshi_Complete/License/FFL.txt'));
  console.log(`Satoshi ready in ${fileURLToPath(directory)}`);
}
