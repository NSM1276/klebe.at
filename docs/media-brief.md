# Media brief — Cinematic Scrollytelling (klebe.at)

Generation prompts + delivery specs for the hero/process videos and gallery
photos used by `components/Scrollytelling.tsx`. Drop finished files into
`public/media/` using the exact filenames below — the component picks them
up automatically (see the constants at the top of that file).

## Visual direction (all assets)

Dark industrial workshop mood — graphite/charcoal tones, one accent color:
vivid orange (`#ff6a1a`). Real craft, real tools, not a generic stock-photo
"digital service" look. Subtle film grain, moody directional lighting,
shallow depth of field on close-ups.

## Videos

Both clips: **6–8 seconds, seamlessly loopable** (first and last frame should
match in composition/lighting so the loop doesn't jump), **no audio needed**
(will be muted in the browser).

Deliver **two renditions of each**, framed as separate shots (not just a
crop of one master) so the subject stays well-composed in both formats:

| Rendition | Resolution | Aspect |
|---|---|---|
| Desktop | 1920×1080 (or 2560×1440 if the tool supports it) | 16:9 |
| Mobile | 1080×1920 | 9:16 |

### Prompt 1 — Hero video

```
Cinematic close-up of a vinyl plotter/cutting machine slowly cutting a
sticker design in a dark industrial workshop at night. Graphite and black
tones throughout, one strong warm orange accent light source raking across
the machine from the side. Slow, steady dolly-in camera movement toward the
cutting blade. Shallow depth of field, subtle film grain, small dust
particles visible in the light beam. Mood: professional craftsmanship,
precision, quiet confidence — not sterile or corporate. Seamless loop,
6-8 seconds, no text or logos in frame.
Aspect ratio: 16:9, 1920x1080 (desktop) — generate a second version framed
for 9:16, 1080x1920 (mobile) with the machine recomposed for a vertical
frame, same lighting and mood.
```

### Prompt 2 — Process video

```
Close-up macro shot of a craftsman's hands applying a vinyl opening-hours
sticker onto a glass shop door, smoothing it with a squeegee tool.
Natural daylight streaming through the glass from outside, soft warm orange
reflections from a nearby light or signage. Slow lateral tracking shot
following the squeegee left to right. Shallow depth of field, fingers and
tool in sharp focus, background softly blurred street/storefront. Mood:
careful, precise, real manual craft. Seamless loop, 6-8 seconds, no text or
logos in frame.
Aspect ratio: 16:9, 1920x1080 (desktop) — generate a second version framed
for 9:16, 1080x1920 (mobile) with the same action recomposed vertically.
```

### Encoding spec (do this after generating, before dropping into `public/media/`)

Target: instant playback, no stutter, small file size (~2.5–4 MB per
6-8s clip). Use `ffmpeg`:

```bash
# Desktop rendition
ffmpeg -i hero-source.mov \
  -c:v libx264 -profile:v high -level 4.0 \
  -crf 23 -preset slow -pix_fmt yuv420p \
  -vf "scale=1920:1080" -an -movflags +faststart \
  hero-desktop.mp4

# Mobile rendition
ffmpeg -i hero-source-vertical.mov \
  -c:v libx264 -profile:v high -level 4.0 \
  -crf 23 -preset slow -pix_fmt yuv420p \
  -vf "scale=1080:1920" -an -movflags +faststart \
  hero-mobile.mp4

# Poster frame (first frame, shown instantly before the video buffers)
ffmpeg -i hero-desktop.mp4 -vframes 1 -q:v 2 hero-poster.jpg
```

Notes:
- `-an` strips audio entirely (saves size, the tag is muted anyway).
- `-movflags +faststart` moves metadata to the front of the file so the
  browser can start playing before the whole file downloads — critical for
  a background video that must feel instant.
- `-crf 23 -preset slow` is a good quality/size balance for short clips; go
  down to `crf 26-28` if a file comes out bigger than ~4 MB.
- Repeat the same commands for `process-desktop.mp4` / `process-mobile.mp4`.
- If total combined weight of both videos exceeds ~6-8 MB, prefer trimming
  to 6s over dropping resolution — motion reads as low-quality faster than
  softness does.

### Player attributes (already wired in code)

`autoPlay muted loop playsInline preload="auto"` — required combination for
autoplay to work on mobile Safari/Chrome without a user gesture, and for the
video to loop seamlessly without a visible restart flash.

## Photos (gallery scene)

4 photos, **consistent 4:5 portrait aspect ratio**, minimum 2000×2500px so
they stay sharp on retina displays.

### Prompt 3 — Finished sticker macro

```
Macro photo of a finished professional opening-hours vinyl sticker applied
to a dark shop door glass. Sharp focus on the vinyl lettering edge showing
the clean cut quality, soft bokeh of a Vienna street reflected in the glass
behind it. Warm late-afternoon light, one subtle orange highlight. Realistic
photography, not illustration. Aspect ratio 4:5, portrait.
```

### Prompt 4 — Application process macro

```
Macro photo of hands smoothing a vinyl sticker onto glass with a squeegee
tool, mid-motion, small air bubbles being pushed out. Natural daylight,
shallow depth of field, background softly blurred. Realistic photography.
Aspect ratio 4:5, portrait.
```

### Prompt 5 — Storefront environmental shot

```
Photo of a small Vienna shopfront glass door with a professional black and
orange opening-hours vinyl sticker applied, shot from the street at a
slight angle, city street reflection visible in the glass, golden hour
light. Realistic photography, documentary style. Aspect ratio 4:5,
portrait.
```

### Prompt 6 — Vinyl plotter detail shot

```
Macro detail photo of a vinyl plotter/cutting machine blade actively
cutting a design into orange vinyl film, roll of film visible in the
background, dark industrial workshop setting. Realistic photography, sharp
focus on the blade and film, shallow depth of field. Aspect ratio 4:5,
portrait.
```

## File checklist

```
public/media/
  hero-desktop.mp4       (1920x1080, 16:9)  — shown on screens ≥768px
  hero-mobile.mp4        (1080x1920, 9:16)  — shown on screens <768px
  hero-poster.jpg
  process-desktop.mp4    (1920x1080, 16:9)  — shown on screens ≥768px
  process-mobile.mp4     (1080x1920, 9:16)  — shown on screens <768px
  process-poster.jpg
  gallery-1.jpg .. gallery-4.jpg   (4:5 portrait, 2000x2500px min)
```

Once files exist, set the matching `undefined` constants in
`components/Scrollytelling.tsx` to their `/media/...` path — no other code
changes needed.
