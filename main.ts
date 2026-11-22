// Tiny stack VM, hand-written from ISA.md for make.fun tiny-stack-vm-01-run-20261122.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input', O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output', E = new TextEncoder();
const S = "ABBEGKLP@@@@@@@@JJJJJJJFJJJFJJJ@JJJ@@@@@@@@@@@@@AEEAA@@@@@@@@@@@FI@@@@@@@@@@@@@@EEBE@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@";
function R(A, B) {
  const n = A.length, D = new Int32Array(256); let s = 0;
  const C = new Int32Array(64); let c = 0;
  const Y = new Int32Array(256), o = new Uint8Array(65536); let l = 0, p = 0, x = 0, t = 0, e = 0;
  const Z = v => ({ out: o.slice(0, l), exit: v });
  L: for (;;) {
    if (t === 1e6) { e = 10; break; }
    if (x < 0 || x >= n) { e = 9; break; }
    const k = A[x], v = S.charCodeAt(k) - 64;
    if (!v) { e = 5; break; }
    const m = k === 1 ? 1 : k === 2 ? 4 : k > 47 && k < 52 ? 2 : 0;
    if (x + m >= n) { e = 9; break; }
    t++;
    const q = x + 1 + m, d = v - 1, po = d >> 2, pu = d & 3;
    if (s < po) { e = 2; break; }
    if (s - po + pu > 256) { e = 3; break; }
    x = q;
    if (k < 8) {
      if (!k) return Z(0);
      if (k === 1) D[s++] = (A[q - 1] << 24) >> 24;
      else if (k === 2) D[s++] = A[q - 4] | A[q - 3] << 8 | A[q - 2] << 16 | A[q - 1] << 24;
      else if (k === 3) s--;
      else if (k === 4) { D[s] = D[s - 1]; s++; }
      else if (k === 5) { const w = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = w; }
      else if (k === 6) { D[s] = D[s - 2]; s++; }
      else { const a = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = a; }
    } else if (k === 23) D[s - 1] = -D[s - 1] | 0;
    else if (k === 27) D[s - 1] = ~D[s - 1];
    else if (k > 15 && k < 35 && k != 23 && k != 27) {
      const b = D[s - 1], a = D[s - 2];
      if (!b && k > 18 && k < 23) { e = 4; break L; }
      const r = k === 16 ? a + b | 0 : k === 17 ? a - b | 0 : k === 18 ? Math.imul(a, b)
        : k === 19 ? a / b | 0 : k === 20 ? a % b | 0 : k === 21 ? (a >>> 0) / (b >>> 0) | 0
        : k === 22 ? (a >>> 0) % (b >>> 0) | 0 : k === 24 ? a & b : k === 25 ? a | b : k === 26 ? a ^ b
        : k === 28 ? a << (b & 31) : k === 29 ? a >> (b & 31) : k === 30 ? (a >>> (b & 31)) | 0
        : k === 32 ? +(a === b) : k === 33 ? +(a < b) : +((a >>> 0) < (b >>> 0));
      s -= 2; D[s++] = r;
    } else if (k > 47 && k < 51) {
      const r = (A[q - 2] | A[q - 1] << 8) << 16 >> 16; let j = 1;
      if (k !== 48) { const v = D[--s]; j = k === 49 ? v === 0 : v !== 0; }
      if (j) x = q + r;
    } else if (k === 51) {
      if (c === 64) { e = 7; break L; }
      C[c++] = q; x = A[q - 2] | A[q - 1] << 8;
    } else if (k === 52) {
      if (!c) { e = 8; break L; }
      x = C[--c];
    } else if (k === 64) {
      const a = D[s - 1];
      if (a < 0 || a > 255) { e = 6; break L; }
      D[s - 1] = Y[a];
    } else if (k === 65) {
      const a = D[s - 1], w = D[s - 2];
      if (a < 0 || a > 255) { e = 6; break L; }
      s -= 2; Y[a] = w;
    } else if (k === 80) {
      const b = E.encode(String(D[s - 1]));
      if (l + b.length > 65536) { e = 11; break L; }
      s--; o.set(b, l); l += b.length;
    } else if (k === 81) {
      if (l > 65535) { e = 11; break L; }
      o[l++] = D[--s] & 255;
    } else if (k === 82) D[s++] = p < B.length ? B[p++] : -1;
    else return Z(D[--s] & 255);
  }
  return Z(e);
}
for (const d of readdirSync(I).sort()) {
  const r = R(readFileSync(join(I, d, 'program.bin')), readFileSync(join(I, d, 'input.bin')));
  mkdirSync(join(O, d), { recursive: true });
  writeFileSync(join(O, d, 'stdout.bin'), r.out);
  writeFileSync(join(O, d, 'exit.txt'), r.exit + '\n');
}
