#!/usr/bin/env bash
# PNG loop frames -> Instagram-ready carousel video (1080x1350, H.264, 30 fps, silent AAC, faststart).
# The 4 s loop is repeated so the clip is 8 s (Instagram carousel videos must be at least 3 s,
# and a longer clip makes the loop restart less often). Because frames are periodic, the seam is invisible.
# Usage: encode.sh <frames_dir> <out.mp4> [repeats=2] [fps=30]
set -euo pipefail
dir=${1:?frames dir}; out=${2:?out.mp4}; rep=${3:-2}; fps=${4:-30}
ffmpeg -y -loglevel error -stream_loop $((rep-1)) -framerate "$fps" -i "$dir/f%04d.png" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -map 0:v -map 1:a -shortest \
  -vf "scale=1080:1350:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 18 -r "$fps" \
  -c:a aac -b:a 128k -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration -show_entries stream=codec_name,width,height -of csv=p=0 "$out"
