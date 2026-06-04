#!/usr/bin/env python3
"""Download Unsplash images used in the theme and rewrite HTML to local paths."""

from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "assets" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# (photo slug, filename, query string for high quality)
DOWNLOADS = [
    ("photo-1460925895917-afdab827c52f", "fintech-dashboard.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1551288049-bebda4e38f71", "healthcare-analytics.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1551434678-e076c223a692", "ecommerce-platform.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1677442136019-21780ecad995", "ai-neural-network.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1451187580459-43490279c0fa", "cloud-infrastructure.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1555949963-aa79dcee981c", "cybersecurity.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1555255707-c07966088b7b", "claims-ai.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1512941937669-90a1b58e7e9c", "mobile-app.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1620712943543-bcc4688e7485", "manufacturing-vision.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1551650975-87deedd944c3", "field-service-mobile.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1558494949-ef010cbdcc31", "data-platform.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1504384308090-c894fdcc538d", "developer-portal.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1498050108023-c5249f4df085", "web-development.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1561070791-2526d30994b5", "uiux-design.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1552664730-d307ca884978", "sales-team-crm.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    # Original slug removed from Unsplash; same visual used in blog cards
    ("photo-1485827404703-89b55fcc595e", "rag-robot-ai.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1527474305487-b87b222841cc", "machine-learning-workstation.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1563986768609-322da13575f3", "security-mobile.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1618401471353-b98afee0b2eb", "git-devops-screen.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1544197150-b99a580bb7a8", "kubernetes-terminal.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    ("photo-1605745341112-85968b19335b", "server-racks.jpg", "w=2400&q=90&auto=format&fm=jpg"),
    # Face crops
    ("photo-1472099645785-5658abf4ff4e", "avatar-james-mitchell.jpg", "w=800&h=800&fit=crop&crop=face&q=90&auto=format&fm=jpg"),
    ("photo-1494790108377-be9c29b29330", "avatar-sarah-chen.jpg", "w=800&h=800&fit=crop&crop=face&q=90&auto=format&fm=jpg"),
    ("photo-1507003211169-0a1dd7228f2d", "avatar-marcus-williams.jpg", "w=800&h=800&fit=crop&crop=face&q=90&auto=format&fm=jpg"),
    ("photo-1560250097-0b93528c311a", "team-david-richardson.jpg", "w=800&h=800&fit=crop&crop=face&q=90&auto=format&fm=jpg"),
    ("photo-1573496359142-b8d87734a5a2", "team-emily-parker.jpg", "w=800&h=800&fit=crop&crop=face&q=90&auto=format&fm=jpg"),
    ("photo-1519085360753-af0119f7cbe7", "team-michael-torres.jpg", "w=800&h=800&fit=crop&crop=face&q=90&auto=format&fm=jpg"),
    ("photo-1580489944761-15a19d654956", "team-lisa-anderson.jpg", "w=800&h=800&fit=crop&crop=face&q=90&auto=format&fm=jpg"),
    # Hero poster (tech / office)
    ("photo-1451187580459-43490279c0fa", "hero-poster.jpg", "w=1920&q=90&auto=format&fm=jpg"),
]

FACE_PHOTOS = {
    "photo-1472099645785-5658abf4ff4e",
    "photo-1494790108377-be9c29b29330",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1560250097-0b93528c311a",
    "photo-1573496359142-b8d87734a5a2",
    "photo-1519085360753-af0119f7cbe7",
    "photo-1580489944761-15a19d654956",
}

PHOTO_TO_FILE: dict[str, str] = {}
for slug, filename, _ in DOWNLOADS:
    if slug == "photo-1451187580459-43490279c0fa" and filename == "hero-poster.jpg":
        continue
    PHOTO_TO_FILE[slug] = filename

# Unavailable on Unsplash CDN — map old slug to local replacement file
PHOTO_TO_FILE["photo-1676277791608-ac54525aa047"] = "rag-robot-ai.jpg"

PHOTO_TO_FILE_FACE = {slug: fn for slug, fn, _ in DOWNLOADS if slug in FACE_PHOTOS}

URL_RE = re.compile(
    r"https://images\.unsplash\.com/(photo-[\w-]+)(?:\?[^\"'\s>]*)?",
    re.IGNORECASE,
)


def download_file(slug: str, filename: str, params: str) -> None:
    dest = IMAGES_DIR / filename
    if dest.exists() and dest.stat().st_size > 10_000:
        print(f"  skip (exists): {filename}")
        return
    url = f"https://images.unsplash.com/{slug}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (NexusIT theme asset downloader)"})
    ctx = ssl.create_default_context()
    print(f"  downloading: {filename}")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
            dest.write_bytes(resp.read())
    except Exception as exc:
        print(f"  FAILED {filename}: {exc}")


def local_path_for_photo(slug: str, full_url: str) -> str:
    if "crop=face" in full_url or ("fit=crop" in full_url and "face" in full_url):
        name = PHOTO_TO_FILE_FACE.get(slug)
    else:
        name = PHOTO_TO_FILE.get(slug)
    if not name:
        raise KeyError(f"No local mapping for {slug}")
    return f"./assets/images/{name}"


def replace_urls_in_html(content: str) -> tuple[str, int]:
    count = 0

    def replacer(match: re.Match[str]) -> str:
        nonlocal count
        slug = match.group(1)
        full = match.group(0)
        try:
            local = local_path_for_photo(slug, full)
        except KeyError:
            return full
        count += 1
        return local

    return URL_RE.sub(replacer, content), count


def main() -> None:
    seen: set[tuple[str, str]] = set()
    for slug, filename, params in DOWNLOADS:
        key = (slug, filename)
        if key in seen:
            continue
        seen.add(key)
        download_file(slug, filename, params)

    total = 0
    for html_path in sorted(ROOT.glob("*.html")):
        text = html_path.read_text(encoding="utf-8")
        new_text, n = replace_urls_in_html(text)
        if n:
            html_path.write_text(new_text, encoding="utf-8")
            print(f"updated {html_path.name}: {n} URLs")
            total += n

    print(f"\nDone. {total} URL replacements across HTML files.")
    print(f"Images saved to: {IMAGES_DIR}")


if __name__ == "__main__":
    main()
