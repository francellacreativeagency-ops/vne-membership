#!/usr/bin/env python3
"""Push-up ladder overlay: 1..10..1 arc on top, timer + progress bar at the bottom.

Usage:
  python3 render.py INPUT.mp4 OUTPUT.mp4 --start 3.2 --ends 5.1,9.0,14.2,...   (19 values)

--start  second in the video when the first push-up begins (timer starts here)
--ends   second in the video when each of the 19 sets finishes (1,2,...,10,...,2,1)
"""
import argparse
import json
import math
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

SETS = list(range(1, 11)) + list(range(9, 0, -1))  # 19 sets, 100 reps
FONT = "/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf"

ACCENT = (255, 196, 0)       # lit / current
DONE = (255, 196, 0, 150)    # finished sets
IDLE_FILL = (0, 0, 0, 120)
IDLE_LINE = (255, 255, 255, 170)
WHITE = (255, 255, 255, 255)


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate:stream_side_data=rotation:format=duration",
         "-of", "json", path], check=True, capture_output=True, text=True).stdout
    info = json.loads(out)
    s = info["streams"][0]
    w, h = s["width"], s["height"]
    rot = 0
    for sd in s.get("side_data_list", []):
        rot = int(sd.get("rotation", 0))
    if abs(rot) in (90, 270):
        w, h = h, w
    num, den = map(int, s["r_frame_rate"].split("/"))
    return w, h, num / den, float(info["format"]["duration"])


def fmt_time(sec):
    sec = max(0.0, sec)
    return f"{int(sec // 60):02d}:{sec % 60:04.1f}"


class Overlay:
    def __init__(self, w, h, start, ends):
        self.w, self.h, self.start, self.ends = w, h, start, ends
        self.total = ends[-1] - start
        u = min(w, h)
        self.font_timer = ImageFont.truetype(FONT, int(u * 0.085))
        self.font_small = ImageFont.truetype(FONT, int(u * 0.032))
        # Inverted V: left base -> peak (10) -> right base
        top = h * 0.07
        base = top + min(h * 0.30, w * 0.55)
        left, right = w * 0.08, w * 0.92
        step = math.hypot((right - left) / 18, (base - top) / 9)
        self.r = min(step * 0.42, u * 0.045)
        self.font_num = ImageFont.truetype(FONT, int(self.r * 1.05))
        band = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(band).rectangle([0, h * 0.80, w, h], fill=(0, 0, 0, 110))
        self.band = band.filter(ImageFilter.GaussianBlur(h * 0.02))  # dark band for legibility
        self.pts = []
        for i in range(19):
            t = i / 9 if i <= 9 else (18 - i) / 9
            x = left + (right - left) * i / 18
            y = base + (top - base) * t
            self.pts.append((x, y))

    def state(self, t):
        """Index of the set being worked on, and seconds since it lit up."""
        prev = self.start
        for i, e in enumerate(self.ends):
            if t < e:
                return i, t - prev
            prev = e
        return 19, t - self.ends[-1]

    def frame(self, t):
        img = Image.new("RGBA", (self.w, self.h), (0, 0, 0, 0))
        cur, since = self.state(t)
        since = max(since, 0.0)
        self._arc(img, cur, since)
        self._bottom(img, t, cur)
        return img

    def _arc(self, img, cur, since):
        lw = max(3, int(self.r * 0.18))
        d = ImageDraw.Draw(img)
        for i in range(18):
            col = DONE if i < cur else IDLE_LINE
            d.line([self.pts[i], self.pts[i + 1]], fill=col, width=lw)

        # glow behind the current set
        if cur < 19:
            pulse = 0.5 + 0.5 * math.sin(since * 2 * math.pi * 1.2)
            gx, gy = self.pts[cur]
            gr = self.r * (1.9 + 0.3 * pulse)
            pad = int(self.r * 4)
            glow = Image.new("RGBA", (2 * pad, 2 * pad), (0, 0, 0, 0))
            ImageDraw.Draw(glow).ellipse(
                [pad - gr, pad - gr, pad + gr, pad + gr], fill=ACCENT + (int(140 + 80 * pulse),))
            img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(self.r * 0.6)),
                                (int(gx) - pad, int(gy) - pad))

        d = ImageDraw.Draw(img)
        for i, (x, y) in enumerate(self.pts):
            r = self.r
            if i < cur:
                fill, outline, text = DONE, None, (20, 20, 20, 255)
            elif i == cur:
                pop = 1 + 0.35 * max(0.0, 1 - since / 0.35)  # pop when it lights up
                r *= 1.25 * pop
                fill, outline, text = ACCENT + (255,), WHITE, (20, 20, 20, 255)
            else:
                fill, outline, text = IDLE_FILL, IDLE_LINE, WHITE
            d.ellipse([x - r, y - r, x + r, y + r], fill=fill, outline=outline,
                      width=max(2, int(self.r * 0.12)))
            f = self.font_num if i != cur else self.font_num.font_variant(size=int(r * 1.05))
            d.text((x, y), str(SETS[i]), font=f, fill=text, anchor="mm")

    def _bottom(self, img, t, cur):
        w, h = self.w, self.h
        elapsed = min(max(t - self.start, 0.0), self.total)
        frac = elapsed / self.total if self.total > 0 else 0
        reps = sum(SETS[:cur])

        bar_h = max(10, int(min(w, h) * 0.022))
        bx0, bx1 = w * 0.08, w * 0.92
        by1 = h * 0.94
        by0 = by1 - bar_h

        img.alpha_composite(self.band)

        d = ImageDraw.Draw(img)
        d.text((w / 2, by0 - h * 0.035), fmt_time(elapsed), font=self.font_timer,
               fill=WHITE, anchor="ms")
        d.text((bx0, by1 + h * 0.012), f"{reps}/100 PUSH-UPS", font=self.font_small,
               fill=(255, 255, 255, 210), anchor="lt")
        label = "DONE!" if cur >= 19 else f"SET {cur + 1}/19"
        d.text((bx1, by1 + h * 0.012), label, font=self.font_small,
               fill=ACCENT + (255,), anchor="rt")

        rad = bar_h / 2
        d.rounded_rectangle([bx0, by0, bx1, by1], radius=rad, fill=(255, 255, 255, 60))
        fx = bx0 + (bx1 - bx0) * frac
        if fx - bx0 > bar_h:
            d.rounded_rectangle([bx0, by0, fx, by1], radius=rad, fill=ACCENT + (255,))
        # moving head
        d.ellipse([fx - bar_h, by0 - rad, fx + bar_h, by1 + rad], fill=WHITE)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--start", type=float, required=True)
    ap.add_argument("--ends", required=True, help="19 comma-separated set end times (s)")
    a = ap.parse_args()
    ends = [float(x) for x in a.ends.split(",")]
    if len(ends) != 19 or ends != sorted(ends) or ends[0] <= a.start:
        sys.exit("--ends needs 19 increasing times, all after --start")

    w, h, fps, dur = probe(a.input)
    ov = Overlay(w, h, a.start, ends)
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-v", "error", "-i", a.input,
         "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
         "-filter_complex", "[0:v][1:v]overlay=0:0:shortest=1[v]",
         "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-crf", "18",
         "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", a.output],
        stdin=subprocess.PIPE)
    n = int(dur * fps)
    for i in range(n):
        ff.stdin.write(ov.frame(i / fps).tobytes())
        if i % int(fps * 10) == 0:
            print(f"\r{i}/{n} frames", end="", file=sys.stderr, flush=True)
    ff.stdin.close()
    sys.exit(ff.wait())


if __name__ == "__main__":
    main()
