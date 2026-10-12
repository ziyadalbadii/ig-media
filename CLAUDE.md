# ig-media

Media and tooling for Ziyad's Instagram @ziyadalbadi (Oman; Arabic; AI, tech, cars).

- Talk to Ziyad in Gulf Arabic. Work one step at a time and wait for his go-ahead. Never make design decisions alone: show numbered options.
- Toolkit, templates and render commands: `toolkit/README.md`. Run `bash toolkit/setup.sh` first in a fresh environment.
- Each post lives in `posts/YYYY-MM-DD-slug/`: `slide-N.jpg|mp4`, `caption.txt`, and `post.json` (media URLs pinned to a commit SHA; `status` is scheduled or published).
- Daily publishing time: 5:00 PM Asia/Muscat (13:00 UTC).
- Content tracker: `plan/ziyad-content-schedule.xlsx`.
- This repo is public (Instagram fetches media from raw.githubusercontent.com). Never commit secrets or private data.
- Captions are Arabic only (mixed Arabic/English gets scrambled on Instagram): write brand names in Arabic.

## Fixed review gate (every idea, carousel and reel; never skip)
Run it and show the result to Ziyad before presenting anything; fix what fails first.
1. Four questions, each scored /10: does the hook grab attention? does it give real value? does the text fit the audience (Omani, Gulf Arabic)? is the CTA clear and strong?
2. Curiosity to the end (@owais.media rule): every slide or second opens a question the next one answers, and the end delivers the useful payoff (never give it away in the hook). This is what moves the three reach metrics: lower skip rate, higher save rate, higher share rate.
3. Reels and videos: run Higgsfield Virality Predictor before publishing. It accepts 16 s max, so analyze the first 16 s (the hook). Host the cut on this repo and import it via `https://cdn.jsdelivr.net/gh/ziyadalbadii/ig-media@<sha>/<path>` (raw.githubusercontent serves mp4 as octet-stream, which the importer rejects).
