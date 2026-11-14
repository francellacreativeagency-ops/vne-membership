"""Original soundtrack for the Safer Digital Community reel.
100 BPM (beat = 0.6s). All cue times are seconds from animation start.
Writes music.wav, sfx.wav and mix.wav (stereo 44.1k)."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave

SR = 44100
DUR = 40.0
N = int(SR * DUR)
B = 0.6  # beat
rng = np.random.default_rng(7)

def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(SR * d))

def add(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(buf): return
    sig = sig[: len(buf) - i]
    l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    buf[i:i + len(sig), 0] += sig * gain * l * 1.414
    buf[i:i + len(sig), 1] += sig * gain * r * 1.414

def saw(f, d, harm=14):
    t = tt(d); s = np.zeros_like(t)
    for k in range(1, harm + 1):
        if f * k > 12000: break
        s += np.sin(2 * np.pi * f * k * t) / k
    return s

def adsr(n, a=0.01, r=0.1):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

# ---------------- instruments ----------------
def kick():
    t = tt(0.45); f = 44 + 80 * np.exp(-t * 32)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    s += lp(noise(0.45), 3000) * np.exp(-t * 120) * 0.3
    return s

def clap():
    t = tt(0.3); n = bp(noise(0.3), 900, 3500)
    e = np.exp(-t * 20)
    for off in (0.0, 0.011, 0.022):
        e += np.where(t >= off, np.exp(-(t - off) * 140), 0) * 0.6
    return n * e * 0.8

def hat(open_=False):
    d = 0.25 if open_ else 0.06; t = tt(d)
    return hp(noise(d), 7000) * np.exp(-t * (14 if open_ else 70)) * 0.35

def bass(m, d):
    s = lp(saw(mtof(m), d, 8), 380, 4)
    return s * adsr(len(s), 0.005, 0.06) * 0.9

def pad(notes, d, cutoff=1400):
    s = np.zeros(int(SR * d))
    for m in notes:
        for det in (-0.12, 0, 0.12):
            s += saw(mtof(m + det), d, 10)
    s = lp(s, cutoff, 2) / (len(notes) * 3)
    return s * adsr(len(s), 0.35, 0.6)

def pluck(m, d=0.35):
    t = tt(d); f = mtof(m)
    s = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t))
    return s * np.exp(-t * 9) * adsr(len(t), 0.003, 0.02)

def reverb(x, sec=1.8, mix=0.22):
    ir = noise(sec) * np.exp(-tt(sec) * (6.0 / sec)); ir = lp(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
    wet = np.stack([fftconvolve(x[:, c], ir * (1 if c == 0 else -1) ** 0)[: len(x)] for c in (0, 1)], 1)
    return x * (1 - mix) + wet * mix * 0.6

# ---------------- music ----------------
mus = np.zeros((N, 2))
CH_MIN = {'Am': [57, 60, 64], 'F': [57, 60, 65], 'C': [55, 60, 64], 'G': [55, 59, 62]}
ROOT = {'Am': 45, 'F': 41, 'C': 48, 'G': 43}
BAR = 4 * B

def section(start, end, prog, drums, bassline, pads=True, arp=False, padcut=1400, padgain=0.5):
    t = start; i = 0
    while t < end - 1e-6:
        ch = prog[i % len(prog)]; d = min(BAR, end - t)
        if pads: add(mus, pad(CH_MIN[ch], d + 0.5, padcut), t, padgain)
        for b in range(8):  # eighths
            bt = t + b * B / 2
            if bt >= end - 1e-6: break
            if bassline == 'pulse' and b % 2 == 0: add(mus, bass(ROOT[ch], B * 0.45), bt, 0.55)
            if bassline == 'eighths': add(mus, bass(ROOT[ch] + (12 if b % 4 == 3 else 0), B * 0.4), bt, 0.6)
            if drums in ('full', 'half') and b % 2 == 0: add(mus, kick(), bt, 0.9)
            if drums == 'full' and b in (2, 6): add(mus, clap(), bt, 0.5)
            if drums in ('full', 'hats') and b % 2 == 1: add(mus, hat(), bt, 0.5, 0.3)
            if drums == 'heart' and b in (0, 1): add(mus, kick(), bt, 0.45 if b == 0 else 0.3)
            if arp:
                notes = CH_MIN[ch] + [CH_MIN[ch][0] + 12]
                add(mus, pluck(notes[b % 4] + 12), bt, 0.22, -0.4 if b % 2 else 0.4)
        t += BAR; i += 1

# A: 0–4.8 tense intro (heartbeat + dark pad)
section(0.0, 4.8, ['Am', 'F'], 'heart', None, padcut=900, padgain=0.45)
# B: 4.8–8.4 build (kick + hats + bass pulse)
section(4.8, 8.4, ['Am', 'F'], 'half', 'pulse', padcut=1100, padgain=0.45)
for k in range(8):  # snare roll into the stop
    add(mus, clap(), 7.2 + k * B / 4, 0.12 + 0.05 * k)
# 8.4–9.0: silence (stillness)
# C: 9.0–13.2 drop
section(9.0, 13.2, ['Am', 'F'], 'full', 'eighths', padcut=1800, padgain=0.5)
# D: 13.2–16.2 breakdown — hopeful, no drums
section(13.2, 16.2, ['C', 'G'], None, None, arp=True, padcut=1200, padgain=0.5)
# E: 16.2–33.6 main uplifting groove
section(16.2, 33.6, ['C', 'G', 'Am', 'F'], 'full', 'eighths', arp=True, padcut=2000, padgain=0.45)
# F: 33.6–40 end card — final hit + sustained chord
add(mus, kick(), 33.6, 1.0); add(mus, kick(), 34.2, 0.9)
add(mus, pad([48, 55, 60, 64, 67], 6.0, 1300), 33.6, 0.38)
add(mus, bass(36, 2.5), 33.6, 0.6)
for k, m in enumerate([72, 76, 79, 84]): add(mus, pluck(m, 1.2), 34.2 + k * B / 2, 0.2)

mus = reverb(mus, 1.8, 0.25)
# hard gap for stillness 8.4–9.0 (short fade so it's not a click)
g = np.ones(N); a, b_ = int(8.4 * SR), int(9.0 * SR); f = int(0.04 * SR)
g[a:b_] = 0; g[a - f:a] = np.linspace(1, 0, f)
mus *= g[:, None]
fo = int(2.0 * SR); mus[-fo:] *= np.linspace(1, 0, fo)[:, None]

# ---------------- SFX ----------------
sfx = np.zeros((N, 2))

def whoosh(d=0.6, lo=300, hi=4000):
    n = noise(d); t = tt(d); out = np.zeros_like(n); seg = 12; L = len(n) // seg
    for s in range(seg):
        c = lo * (hi / lo) ** (s / seg)
        y = bp(n, c * 0.6, min(c * 1.6, SR / 2 - 100))
        w = np.zeros_like(n); a0 = max(0, s * L - L // 2); a1 = min(len(n), (s + 1) * L + L // 2)
        w[a0:a1] = np.hanning(a1 - a0); out += y * w
    return out * np.sin(np.pi * t / d) ** 2

def impact():
    t = tt(1.4)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 10)) / SR) * np.exp(-t * 3.2)
    crack = lp(noise(1.4), 2500) * np.exp(-t * 25) * 0.5
    return boom + crack

def tick(f=2600):
    t = tt(0.03); return np.sin(2 * np.pi * f * t) * np.exp(-t * 250)

def pop(f0=900, f1=420):
    t = tt(0.09); f = f1 + (f0 - f1) * np.exp(-t * 60)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45)

def riser(d):
    t = tt(d); x = whoosh(d, 200, 7000) * (t / d) ** 2 * 2
    x += np.sin(2 * np.pi * np.cumsum(200 + 1000 * (t / d) ** 2) / SR) * (t / d) ** 2 * 0.25
    return x

def glitch(d=0.5):
    t = tt(d); out = np.zeros_like(t)
    for k in range(7):
        s, e = int(k * 0.07 * SR), int((k * 0.07 + 0.035) * SR)
        f = rng.choice([220, 330, 660, 880])
        out[s:e] = np.sign(np.sin(2 * np.pi * f * t[s:e])) * 0.5
    return np.round(out * 6) / 6 * np.exp(-t * 3)

def chime():
    t = tt(2.5); s = np.zeros_like(t)
    for f, a in ((1046.5, 1), (1568, .6), (2093, .35), (2637, .2)):
        s += a * np.sin(2 * np.pi * f * t) * np.exp(-t * (2.2 + f / 1500))
    return s * adsr(len(t), 0.004, 0.2) * 0.6

def blip(): t = tt(0.12); return np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 30)

# clock ticking under the hook (tick-tock on eighths)
for k in range(int((4.5 - 0.6) / (B / 2))):
    add(sfx, tick(2600 if k % 2 == 0 else 2000), 0.6 + k * B / 2, 0.35, 0.2)
add(sfx, whoosh(0.5), 0.35, 0.5)
for t_ in (1.2, 1.8, 3.0): add(sfx, pop(), t_, 0.55)
add(sfx, impact(), 2.4, 0.75)
# scene 2
add(sfx, whoosh(0.6), 4.5, 0.7, -0.3)
for t_ in (4.8, 4.95, 5.1): add(sfx, tick(1800), t_, 0.5)
for t_ in (6.0, 6.6): add(sfx, pop(700, 350), t_, 0.5)
add(sfx, riser(1.2), 7.2, 0.6)
# rehook
add(sfx, pop(500, 250), 9.0, 0.45)
for t_ in (9.6, 10.2, 10.8): add(sfx, impact(), t_, 0.85)
add(sfx, glitch(), 10.85, 0.35)
add(sfx, pop(), 12.0, 0.5)
# bridge
add(sfx, whoosh(0.6), 12.9, 0.6, 0.3)
for t_ in (13.2, 13.5, 13.8): add(sfx, tick(1500), t_, 0.4)
add(sfx, riser(1.2), 15.0, 0.55)
# invite
add(sfx, whoosh(0.5), 15.95, 0.6)
add(sfx, pop(1100, 600), 16.2, 0.5)
add(sfx, impact(), 16.8, 0.7)
for k, t_ in enumerate((17.1, 17.25, 17.4)): add(sfx, tick(1600 + 300 * k), t_, 0.4)
add(sfx, pop(), 18.6, 0.45)
# speaker
add(sfx, whoosh(0.8, 200, 2500), 20.6, 0.75)
add(sfx, pop(), 21.6, 0.5)
for k, t_ in enumerate((22.2, 22.5, 22.8, 23.1)): add(sfx, pop(700 + 120 * k, 400 + 80 * k), t_, 0.45, -0.3 + 0.2 * k)
# details
add(sfx, whoosh(0.6), 26.7, 0.7, -0.3)
add(sfx, pop(), 27.0, 0.45)
add(sfx, impact(), 27.6, 0.75)
add(sfx, pop(), 28.2, 0.5)
add(sfx, whoosh(0.35, 1500, 7000), 28.4, 0.45, 0.4)
add(sfx, blip(), 28.8, 0.4)
add(sfx, pop(1000, 500), 29.4, 0.5)
add(sfx, pop(), 30.0, 0.45)
# logo end card
add(sfx, whoosh(0.6, 3000, 300), 33.1, 0.6)
add(sfx, impact(), 34.2, 0.55); add(sfx, chime(), 34.2, 0.5)
for t_ in (34.8, 35.4): add(sfx, pop(800, 450), t_, 0.4)

# ---------------- mix: SFX kept well under the music ----------------
mus /= np.max(np.abs(mus)); sfx /= np.max(np.abs(sfx))
MUSIC_GAIN, SFX_GAIN = 0.85, 0.42   # SFX peak ~ -6 dB below music peak
mix = mus * MUSIC_GAIN + sfx * SFX_GAIN
mix /= max(1.0, np.max(np.abs(mix)) / 0.95)

def wav(path, x):
    y = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
wav('music.wav', mus * MUSIC_GAIN); wav('sfx.wav', sfx * SFX_GAIN); wav('mix.wav', mix)
print('done')
