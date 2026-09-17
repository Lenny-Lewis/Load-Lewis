#!/usr/bin/env python3
"""
DiceBear Avatar SVG Generator for Portfolio Testimonials
Uses the DiceBear HTTP API (v9.x) using Python's standard library.
Provides rich avatar variety across multiple styles, seeds, and background palettes.
"""

import os
import re
import urllib.parse
import urllib.request

# ==============================================================================
# CONFIGURATION (EDITABLE)
# ==============================================================================

# Default global style & background colors (used when plain seed strings are provided)
DEFAULT_STYLE = "notionists"
DEFAULT_BACKGROUND_COLORS = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"]

# Diverse list of avatar configs for maximum visual variety and authentic individuality.
# Supports either a dict with {"seed", "style", "bg"} OR plain string seeds.
# Styles available: "micah", "lorelei", "personas", "notionists", "adventurer", "avataaars"
AVATARS = [
    {"seed": "EstherHoward", "style": "lorelei", "bg": "ffd5dc,ffdfbf"},
    {"seed": "WadeWarren", "style": "personas", "bg": "b6e3f4,d1d4f9"},
    {"seed": "GuyHawkins", "style": "micah", "bg": "d1d4f9,c0aede"},
    {"seed": "MarvinMcKinney", "style": "notionists", "bg": "ffdfbf,ffd5dc"},
    {"seed": "FloydMiles", "style": "personas", "bg": "c0aede,b6e3f4"},
    {"seed": "AlbertFlores", "style": "micah", "bg": "b6e3f4,ffd5dc"},
    {"seed": "EcommerceClient", "style": "lorelei", "bg": "ffd5dc,c0aede"},
]

# Target output directories (saved to both public/avatars for web serving and local avatars/)
OUTPUT_DIRS = ["public/avatars", "avatars"]

# ==============================================================================
# GENERATOR SCRIPT
# ==============================================================================

def sanitize_filename(name: str) -> str:
    """Sanitizes a seed string to produce a safe filename."""
    clean_name = re.sub(r'[^\w\s-]', '', name).strip()
    return re.sub(r'[\s]+', '_', clean_name)

def fetch_and_save_svg(seed: str, style: str, bg: str, output_dirs: list):
    params = {"seed": seed}
    if bg:
        # Strip any leading '#' if present
        clean_bg = bg.replace("#", "")
        params["backgroundColor"] = clean_bg
        
    url = f"https://api.dicebear.com/9.x/{style}/svg?{urllib.parse.urlencode(params)}"
    filename = f"{sanitize_filename(seed)}.svg"
    
    req = urllib.request.Request(
        url, 
        headers={"User-Agent": "Mozilla/5.0 (Python-DiceBear-Generator)"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                svg_content = response.read()
                for directory in output_dirs:
                    os.makedirs(directory, exist_ok=True)
                    filepath = os.path.join(directory, filename)
                    with open(filepath, "wb") as f:
                        f.write(svg_content)
                print(f"[+] Saved avatar for '{seed}' [{style}] -> {output_dirs[0]}/{filename}")
            else:
                print(f"[!] Failed to fetch '{seed}' (HTTP {response.status})")
    except Exception as e:
        print(f"[!] Error fetching avatar for '{seed}': {e}")

def generate_avatars():
    print(f"Starting avatar generation for {len(AVATARS)} avatar(s) with rich style variety...\n")
    
    for item in AVATARS:
        if isinstance(item, dict):
            seed = item.get("seed", "User")
            style = item.get("style", DEFAULT_STYLE)
            bg = item.get("bg", ",".join(DEFAULT_BACKGROUND_COLORS))
        else:
            seed = str(item)
            style = DEFAULT_STYLE
            bg = ",".join(DEFAULT_BACKGROUND_COLORS)
            
        fetch_and_save_svg(seed, style, bg, OUTPUT_DIRS)

    print("\nGeneration complete! Avatars updated with rich variety across multiple art styles.")
    print('HTML Reference: <img src="avatars/SEED.svg" alt="Avatar">')

if __name__ == "__main__":
    generate_avatars()
