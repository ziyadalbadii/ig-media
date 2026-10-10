#!/usr/bin/env bash
# Swipe-through preview of a whole carousel, to send Ziyad before publishing.
# Accepts slide-1.jpg, slide-2.mp4 ... in order (images and videos can be mixed).
# Usage: preview.sh <out.mp4> <hold_seconds> <slide1> <slide2> ...
set -euo pipefail
out=${1:?out.mp4}; hold=${2:?hold seconds}; shift 2
n=$#; [ "$n" -ge 2 ] || { echo "need at least 2 slides"; exit 2; }
inputs=(); filt=""; i=0
for f in "$@"; do
  case "$f" in
    *.mp4|*.mov) inputs+=(-stream_loop -1 -t "$hold" -i "$f") ;;
    *) inputs+=(-loop 1 -t "$hold" -framerate 30 -i "$f") ;;
  esac
  filt+="[$i:v]scale=1080:1350,setsar=1,fps=30,format=yuv420p,trim=duration=$hold,setpts=PTS-STARTPTS[v$i];"
  i=$((i+1))
done
d=0.45; prev="v0"; off=0
for ((k=1;k<n;k++)); do
  off=$(python3 -c "print(round($k*($hold-$d),3))")
  filt+="[$prev][v$k]xfade=transition=slideleft:duration=$d:offset=$off[x$k];"
  prev="x$k"
done
ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "${filt%;}" -map "[$prev]" \
  -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$out"
