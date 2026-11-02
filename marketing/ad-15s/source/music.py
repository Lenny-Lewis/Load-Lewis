"""Original 15s hype beat for the ad (128 BPM, 8 bars), written from scratch so
it is royalty-free. Writes a 44.1 kHz stereo WAV."""
import sys
import wave
import numpy as np

SR = 44100
BPM = 128
BEAT = 60 / BPM                 # 0.46875 s
DUR = 15.0
N = int(SR * DUR)
rng = np.random.default_rng(3)
t_all = np.arange(N) / SR


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def place(buf, sig, start_s, gain=1.0):
    s = int(start_s * SR)
    e = min(N, s + len(sig))
    if s < N:
        buf[s:e] += sig[: e - s] * gain


def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    freq = 45 + 110 * np.exp(-t * 28)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    body = np.sin(phase) * env_exp(n, 0.16)
    click = rng.normal(0, 1, n) * env_exp(n, 0.004) * 0.25
    return np.tanh((body + click) * 1.6)


def clap():
    n = int(0.25 * SR)
    noise = rng.normal(0, 1, n)
    noise = noise - lowpass(noise, 900)              # band-ish
    env = np.zeros(n)
    for k, off in enumerate([0, 0.011, 0.022]):
        o = int(off * SR)
        env[o:] += env_exp(n - o, 0.06 if k == 2 else 0.008)
    return noise * env * 0.5


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    noise = rng.normal(0, 1, n)
    noise = noise - lowpass(noise, 7000)
    return noise * env_exp(n, 0.06 if open_ else 0.012) * 0.35


def saw(freq, n):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for h in range(1, 12):
        out += np.sin(2 * np.pi * freq * h * t) / h
    return out * 0.6


def note_hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


drums = np.zeros(N)
bass = np.zeros(N)
pad = np.zeros(N)
fx = np.zeros(N)

BAR = 4 * BEAT
# chord roots per bar (A, F, C, G) — Am F C G loop over the drop
roots = [45, 41, 48, 43]                          # MIDI: A2, F2, C3, G2
chords = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]]

# --- bar 1: intro riser (0 → 1.875s) ------------------------------------
n = int(BAR * SR)
t = np.arange(n) / SR
rise = rng.normal(0, 1, n)
cut = np.linspace(400, 9000, n)
# time-varying lowpass by blocks
blk = 512
out = np.zeros(n)
acc = 0.0
for i in range(0, n, blk):
    a = np.exp(-2 * np.pi * cut[i] / SR)
    for j in range(i, min(n, i + blk)):
        acc = (1 - a) * rise[j] + a * acc
        out[j] = acc
fx[:n] += out * np.linspace(0.0, 0.35, n) ** 1.5
# filtered chord stab swell in the intro
for m in chords[0]:
    pad[:n] += lowpass(saw(note_hz(m), n), 700) * np.linspace(0, 0.08, n)

# --- bars 2–7: the drop ---------------------------------------------------
kick_s, clap_s = kick(), clap()
for bar in range(1, 7):
    b0 = bar * BAR
    for beat in range(4):
        place(drums, kick_s, b0 + beat * BEAT, 0.9)
        if beat in (1, 3):
            place(drums, clap_s, b0 + beat * BEAT, 0.8)
        for eighth in range(2):
            open_ = eighth == 1 and beat == 3
            place(drums, hat(open_), b0 + beat * BEAT + eighth * BEAT / 2, 0.55 if eighth else 0.35)
    # bass: offbeat 8ths on the bar's root
    r = roots[(bar - 1) % 4]
    seg = int(BEAT / 2 * SR)
    for k in range(8):
        if k % 2 == 1:
            sig = lowpass(saw(note_hz(r), seg), 380) * env_exp(seg, 0.18)
            place(bass, sig, b0 + k * BEAT / 2, 0.75)
    # pad chord for the bar
    nb = int(BAR * SR)
    for m in chords[(bar - 1) % 4]:
        place(pad, lowpass(saw(note_hz(m), nb), 1800) * 0.09, b0)
    # 16th-note hat roll in the last half-beat of bar 7 into the end card
    if bar == 6:
        for k in range(8):
            place(drums, hat(), b0 + 3 * BEAT + k * BEAT / 8, 0.2 + k * 0.05)

# --- bar 8: impact + tail (13.125s → 15s) ---------------------------------
b0 = 7 * BAR
imp_n = int(1.9 * SR)
imp = kick()
place(drums, imp, b0, 1.0)
boom = rng.normal(0, 1, imp_n)
boom = lowpass(boom, 220) * env_exp(imp_n, 0.6) * 1.4
place(fx, boom, b0)
for m in [45, 57, 60, 64]:
    place(pad, lowpass(saw(note_hz(m), imp_n), 1400) * env_exp(imp_n, 0.9) * 0.11, b0)

# --- sidechain: duck bass + pad on every kick in the drop ------------------
duck = np.ones(N)
for bar in range(1, 7):
    for beat in range(4):
        s = int((bar * BAR + beat * BEAT) * SR)
        ln = int(BEAT * SR)
        e = min(N, s + ln)
        shape = 1 - 0.65 * np.exp(-np.arange(e - s) / (0.09 * SR))
        duck[s:e] = np.minimum(duck[s:e], shape)

mix_mono = drums + (bass + pad) * duck + fx
# gentle stereo: pad/fx widened with a tiny delay
d = int(0.012 * SR)
left = mix_mono + np.concatenate([np.zeros(d), (pad * duck + fx)[:-d]]) * 0.25
right = mix_mono + (pad * duck + fx) * 0.25
st = np.stack([left, right], axis=1)
# fade the very end
fade = int(0.35 * SR)
st[-fade:] *= np.linspace(1, 0, fade)[:, None]
st = np.tanh(st * 1.1)
st /= np.max(np.abs(st)) / 0.89

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("wrote", sys.argv[1])
