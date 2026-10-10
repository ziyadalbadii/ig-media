# Toolkit: carousels for @ziyadalbadi

أدوات وقوالب كاروسيلات إنستقرام زياد: نفس الملفات اللي انبنت فيها أول منشورات، عشان أي جلسة جاية تكمل بنفس الأسلوب.

## Setup (once per workspace)
```bash
git clone https://github.com/ziyadalbadii/ig-media && cd ig-media
bash toolkit/setup.sh        # Tajawal + Space Grotesk fonts, puppeteer-core, ffmpeg check
```

## Templates
| Folder | What it is | Used for |
|---|---|---|
| `templates/light-loop/cover.html` (`#d1s1`) | Photo cover: highlight-box hook (white boxes, last line red), short navy gradient behind the footer only, line + "اسحب" cue + handle | Cover of a news/data carousel |
| `templates/light-loop/slides-static.html` | Light sky theme (`#cfe2f5 → #f4f7fc`), navy `#0b1a33`, red `#e01e3c`, muted `#4f6386`, `.hl` title boxes, 230px navy footer | Static inner slides |
| `templates/light-loop/slides-anim.html` | Same theme as one connected panorama (7 slides × 1080 = 7560px) with a cable running through every slide, a Hajar ridge line, and `window.render(t)` for seamless 4 s loops | Animated ("GIF-like") inner slides |
| `templates/navy-dots/slides.html` | Navy dot-grid theme, app-window mockups with real screenshots, red rotated sticker, Arabic numerals ١ ٢ ٣ | Tools / apps list carousels |

Copy a template into a work folder, change the content, keep the tokens.

## Render
```bash
# static slides -> slide-1.jpg ... (every element matching the selector, in order)
node toolkit/render/stills.js page.html out/ '.s'
node toolkit/render/stills.js cover.html out/ '#d1s1'

# animated panorama -> PNG frames per slide (needs window.render(t), periodic in --secs)
node toolkit/render/loop.js slides-anim.html frames/ --first 2 --secs 4 --fps 30   # ~4 min for 7 slides
node toolkit/render/loop.js slides-anim.html check/ --still 0                      # one frame to review

# frames -> 8 s Instagram video (4 s loop x2, silent AAC, H.264, faststart)
bash toolkit/render/encode.sh frames/s2 out/slide-2.mp4

# swipe-through preview of the whole carousel (images and videos mixed)
bash toolkit/render/preview.sh out/carousel-preview.mp4 2.8 out/slide-1.jpg out/slide-2.mp4 ...
```

## Loop rules (seamless, nothing disappears)
- Everything is visible at t=0. No intro fade or build-up: on loop restart nothing may vanish and reappear.
- Only ambient motion, each with a period that divides the loop (4 s): pulses running along a path (2 s), shine sweeps, stripes flowing inside bars (shift by exactly one pattern period), gentle bob (±2.5 px), glow breathing, icon nudge.
- Check the seam: render `--still 0` and `--still 4` and compare. The mean pixel difference must be 0.

## Posts
`posts/YYYY-MM-DD-slug/` holds `slide-N.jpg|mp4`, `caption.txt`, and `post.json`. Media URLs are pinned to a commit SHA (raw.githubusercontent.com), so later edits never change a scheduled post. The repo must stay public so Instagram can fetch the files.

`plan/ziyad-content-schedule.xlsx` is the content tracker (date, time 5:00 PM, content, type, slides, status, notes).
