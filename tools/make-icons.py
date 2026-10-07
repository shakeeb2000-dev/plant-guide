#!/usr/bin/env python3
"""
Makes the app icons.

There is no image software on this machine, so this draws the icon
pixel by pixel and writes the PNG itself using only the Python
standard library.

Run it from the plant-guide folder:

    python3 tools/make-icons.py

It writes icons/icon-192.png and icons/icon-512.png.
The matching icons/icon.svg is hand written and does not need this.
"""

import os
import struct
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "icons")

BG     = (13, 23, 20, 255)      # control room near-black green
PLATE  = (18, 32, 27, 255)      # slightly lifted panel
GREEN  = (44, 224, 140, 255)    # the accent
AMBER  = (255, 183, 77, 255)    # the warning colour
DIM    = (28, 52, 44, 255)      # quiet lines


class Canvas:
    def __init__(self, size, bg):
        self.n = size
        self.px = bytearray(size * size * 4)
        for i in range(size * size):
            self.px[i * 4:i * 4 + 4] = bytes(bg)

    def set(self, x, y, rgba):
        if 0 <= x < self.n and 0 <= y < self.n:
            i = (y * self.n + x) * 4
            a = rgba[3]
            if a == 255:
                self.px[i:i + 4] = bytes(rgba)
            else:
                # simple alpha blend, used for the soft edges
                f = a / 255.0
                for c in range(3):
                    old = self.px[i + c]
                    self.px[i + c] = int(round(old * (1 - f) + rgba[c] * f))
                self.px[i + 3] = 255

    def rect(self, x0, y0, x1, y1, rgba):
        for y in range(int(y0), int(y1)):
            for x in range(int(x0), int(x1)):
                self.set(x, y, rgba)

    def rounded(self, x0, y0, x1, y1, r, rgba):
        for y in range(int(y0), int(y1)):
            for x in range(int(x0), int(x1)):
                dx = dy = 0
                if x < x0 + r:
                    dx = (x0 + r) - x
                elif x > x1 - 1 - r:
                    dx = x - (x1 - 1 - r)
                if y < y0 + r:
                    dy = (y0 + r) - y
                elif y > y1 - 1 - r:
                    dy = y - (y1 - 1 - r)
                if dx and dy:
                    d = (dx * dx + dy * dy) ** 0.5
                    if d > r:
                        continue
                    if d > r - 1.4:
                        edge = (rgba[0], rgba[1], rgba[2],
                                int(rgba[3] * max(0.0, (r - d) / 1.4)))
                        self.set(x, y, edge)
                        continue
                self.set(x, y, rgba)

    def disc(self, cx, cy, r, rgba):
        for y in range(int(cy - r - 2), int(cy + r + 2)):
            for x in range(int(cx - r - 2), int(cx + r + 2)):
                d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
                if d <= r - 1:
                    self.set(x, y, rgba)
                elif d <= r:
                    self.set(x, y, (rgba[0], rgba[1], rgba[2],
                                    int(rgba[3] * (r - d))))

    def png(self, path):
        rows = []
        for y in range(self.n):
            start = y * self.n * 4
            rows.append(b"\x00" + bytes(self.px[start:start + self.n * 4]))
        raw = b"".join(rows)

        def chunk(tag, data):
            out = struct.pack(">I", len(data)) + tag + data
            return out + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

        ihdr = struct.pack(">IIBBBBB", self.n, self.n, 8, 6, 0, 0, 0)
        png = (b"\x89PNG\r\n\x1a\n"
               + chunk(b"IHDR", ihdr)
               + chunk(b"IDAT", zlib.compress(raw, 9))
               + chunk(b"IEND", b""))
        with open(path, "wb") as f:
            f.write(png)
        return len(png)


def draw(size):
    """The plant silhouette: four vessels of different heights on a
    baseline, a chimney, and a warm dot for the heat."""
    u = size / 512.0          # everything below is written at 512
    c = Canvas(size, BG)

    def R(x0, y0, x1, y1, col, rad=0):
        if rad:
            c.rounded(x0 * u, y0 * u, x1 * u, y1 * u, max(1.0, rad * u), col)
        else:
            c.rect(x0 * u, y0 * u, x1 * u, y1 * u, col)

    # inner plate, keeps the glyph inside the maskable safe area
    R(40, 40, 472, 472, PLATE, 72)

    # faint grid, a nod to the control room screens
    for gx in range(80, 472, 48):
        R(gx, 72, gx + 1, 440, DIM)
    for gy in range(80, 472, 48):
        R(72, gy, 440, gy + 1, DIM)

    # baseline
    R(96, 378, 416, 400, GREEN, 10)

    # four vessels, shortest to tallest and back
    R(104, 288, 166, 378, GREEN, 14)
    R(180, 248, 242, 378, GREEN, 14)
    R(256, 208, 318, 378, GREEN, 14)
    R(332, 272, 394, 378, GREEN, 14)

    # the gaps between them, cut back to the plate colour so the
    # shapes read as separate vessels even at 48 pixels
    R(166, 288, 180, 378, PLATE)
    R(242, 248, 256, 378, PLATE)
    R(318, 272, 332, 378, PLATE)

    # chimney on the tallest one
    R(272, 128, 302, 208, GREEN, 8)

    # heat
    c.disc(348 * u, 170 * u, 26 * u, AMBER)

    return c


def main():
    if not os.path.isdir(OUT):
        os.makedirs(OUT)
    for size in (192, 512):
        path = os.path.join(OUT, "icon-%d.png" % size)
        n = draw(size).png(path)
        print("wrote %s  (%d x %d, %d bytes)" % (path, size, size, n))


if __name__ == "__main__":
    main()
