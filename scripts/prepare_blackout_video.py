"""Bake the closing tape failure into a local presentation copy; preserve the source."""
import argparse
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path)
args = parser.parse_args()
output = Path(__file__).resolve().parents[1] / "public/art/presentation/blackout-training.mp4"
video = ",".join([
    "rgbashift=rh=14:bh=-10:rv=2:edge=wrap:enable='gte(t,36.5)'",
    "noise=alls=28:allf=t+u:enable='gte(t,36.5)'",
    "scroll=vertical=0.06:enable='gte(t,37)'",
    "drawbox=x=0:y=ih*0.28:w=iw:h=18:color=white@0.3:t=fill:enable='gte(t,36.5)*lt(mod(t,0.43),0.12)'",
    "drawbox=x=0:y=ih*0.73:w=iw:h=36:color=black@0.6:t=fill:enable='gte(t,37)*lt(mod(t,0.31),0.14)'",
    "drawbox=x=0:y=0:w=iw:h=ih:color=black:t=fill:enable='gte(t,39.45)'",
])
audio = ",".join([
    "acrusher=bits=5:samples=12:mix=0.8:level_out=0.75:enable='gte(t,36.5)'",
    "tremolo=f=12:d=0.85:enable='gte(t,37)'",
    "alimiter=limit=0.9:level=false:latency=true",
    "volume=0:enable='gte(t,39.45)'",
])
subprocess.run([
    "ffmpeg", "-hide_banner", "-loglevel", "warning", "-y", "-i", str(args.source),
    "-t", "39.5", "-vf", video, "-af", audio,
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(output),
], check=True)
print(output)
