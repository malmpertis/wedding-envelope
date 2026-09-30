#!/usr/bin/env python3
"""Generate minimal stone-toned static map previews for the invitation.

Uses Esri World Topo raster tiles (zoomed street context) + a warm grade
matching the invite palette. Output: public/maps/*.jpg

Attribution: Esri, OpenStreetMap contributors (see README).
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
from staticmap import CircleMarker, StaticMap

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "maps"

UA = {"User-Agent": "WeddingInviteMapGen/1.0 (static invitation maps)"}
TILE = (
    "https://server.arcgisonline.com/ArcGIS/rest/services/"
    "World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
)

# width/height match the wide map frames on mobile (~1.875)
WIDTH, HEIGHT = 1125, 600

LOCATIONS = [
    # name, lat, lon, zoom (street-level; reception one step wider for park context)
    ("ceremony", 37.9386708, 23.6402461, 19),
    ("prep-bride", 37.9527040, 23.6571597, 19),
    ("prep-groom", 37.9557770, 23.6624515, 19),
    ("reception", 37.9733947, 23.7007129, 18),
]


def fetch_base(lat: float, lon: float, zoom: int) -> Image.Image:
    m = StaticMap(WIDTH, HEIGHT, url_template=TILE, headers=UA)
    # Invisible marker — centers the render on the venue
    m.add_marker(CircleMarker((lon, lat), "#00000000", 1))
    return m.render(zoom=zoom).convert("RGB")


def stone_grade(img: Image.Image) -> Image.Image:
    """Warm minimal grade toward the invite's paper/ink look."""
    img = ImageEnhance.Color(img).enhance(0.32)
    img = ImageEnhance.Contrast(img).enhance(0.94)
    img = ImageEnhance.Brightness(img).enhance(1.04)
    wash = Image.new("RGB", img.size, (243, 239, 232))
    img = Image.blend(img, wash, 0.16)
    return img.filter(ImageFilter.GaussianBlur(radius=0.3))


def draw_pin(img: Image.Image, tip_x: int, tip_y: int) -> Image.Image:
    """Ink teardrop pin; tip sits on the exact venue coordinate."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    # Head sits above the tip so the point marks the location
    head_y = tip_y - 18
    ink = (23, 20, 18, 250)
    accent = (138, 111, 92, 255)

    d.ellipse((tip_x - 15, tip_y - 6, tip_x + 15, tip_y + 10), fill=(23, 20, 18, 32))
    r = 13
    d.ellipse((tip_x - r, head_y - r, tip_x + r, head_y + r), fill=ink)
    d.polygon(
        [(tip_x - r + 2, head_y + 4), (tip_x + r - 2, head_y + 4), (tip_x, tip_y)],
        fill=ink,
    )
    d.ellipse((tip_x - 5, head_y - 5, tip_x + 5, head_y + 5), fill=(255, 255, 255, 255))
    d.ellipse((tip_x - 3, head_y - 3, tip_x + 3, head_y + 3), fill=accent)

    out = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    return out


def draw_credit(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img)
    text = "© Esri · OpenStreetMap"
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    pad = 8
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = img.width - tw - pad - 4
    y = img.height - th - pad - 2
    d.rectangle((x - 4, y - 2, x + tw + 4, y + th + 2), fill=(243, 239, 232, ))
    d.text((x, y), text, fill=(111, 104, 96), font=font)
    return img


def generate_one(name: str, lat: float, lon: float, zoom: int) -> Path:
    base = fetch_base(lat, lon, zoom)
    graded = stone_grade(base)
    # Tip at geometric center (= venue after StaticMap centering)
    pinned = draw_pin(graded, WIDTH // 2, HEIGHT // 2)
    credited = draw_credit(pinned)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / f"{name}.jpg"
    credited.save(path, "JPEG", quality=88, optimize=True, progressive=True)
    return path


def main() -> None:
    for name, lat, lon, zoom in LOCATIONS:
        path = generate_one(name, lat, lon, zoom)
        print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size} bytes, z={zoom})")


if __name__ == "__main__":
    main()
