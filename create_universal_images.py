#!/usr/bin/env python3
"""
Create placeholder images for all 56 characters in the new universal dark theme.
"""

import os
from PIL import Image, ImageDraw, ImageFont
import random

def create_universal_placeholder(character_number, output_path, size=(400, 400)):
    """Create a dark-themed placeholder image for a universal character."""
    
    # Dark theme color palette
    dark_colors = [
        (15, 23, 42),    # slate-900
        (30, 41, 59),    # slate-800
        (51, 65, 85),    # slate-700
        (71, 85, 105),   # slate-600
    ]
    
    accent_colors = [
        (139, 92, 246),  # violet-500
        (59, 130, 246),  # blue-500
        (6, 182, 212),   # cyan-500
        (16, 185, 129),  # emerald-500
        (245, 158, 11),  # amber-500
        (244, 63, 94),   # rose-500
    ]
    
    # Create base image with dark gradient
    img = Image.new('RGB', size, dark_colors[0])
    draw = ImageDraw.Draw(img)
    
    # Create a subtle dark gradient
    for i in range(size[1]):
        alpha = i / size[1]
        r = int(dark_colors[0][0] + alpha * (dark_colors[1][0] - dark_colors[0][0]))
        g = int(dark_colors[0][1] + alpha * (dark_colors[1][1] - dark_colors[0][1]))
        b = int(dark_colors[0][2] + alpha * (dark_colors[1][2] - dark_colors[0][2]))
        draw.line([(0, i), (size[0], i)], fill=(r, g, b))
    
    # Add decorative elements
    center_x, center_y = size[0] // 2, size[1] // 2
    
    # Choose accent color based on character number
    accent_color = accent_colors[character_number % len(accent_colors)]
    
    # Create geometric pattern
    if character_number % 4 == 0:
        # Circle pattern
        for radius in [60, 80, 100]:
            draw.ellipse(
                [center_x - radius, center_y - radius,
                 center_x + radius, center_y + radius],
                outline=accent_color + (100,), width=2
            )
    elif character_number % 4 == 1:
        # Square pattern
        for size_offset in [50, 70, 90]:
            draw.rectangle(
                [center_x - size_offset, center_y - size_offset,
                 center_x + size_offset, center_y + size_offset],
                outline=accent_color + (100,), width=2
            )
    elif character_number % 4 == 2:
        # Triangle pattern
        for offset in [40, 60, 80]:
            points = [
                (center_x, center_y - offset),
                (center_x - offset, center_y + offset),
                (center_x + offset, center_y + offset)
            ]
            draw.polygon(points, outline=accent_color + (100,), width=2)
    else:
        # Diamond pattern
        for offset in [45, 65, 85]:
            points = [
                (center_x, center_y - offset),
                (center_x + offset, center_y),
                (center_x, center_y + offset),
                (center_x - offset, center_y)
            ]
            draw.polygon(points, outline=accent_color + (100,), width=2)
    
    # Add chapter number
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Chapter number
    chapter_text = str(character_number)
    text_bbox = draw.textbbox((0, 0), chapter_text, font=font_large)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (size[0] - text_width) // 2
    text_y = center_y - text_height // 2
    
    # Add glow effect
    for offset in range(3):
        draw.text((text_x + offset, text_y + offset), chapter_text, font=font_large, fill=(0, 0, 0, 50))
    
    # Main text
    draw.text((text_x, text_y), chapter_text, font=font_large, fill=accent_color)
    
    # Add "Chapter" label
    label_text = "Chapter"
    label_bbox = draw.textbbox((0, 0), label_text, font=font_small)
    label_width = label_bbox[2] - label_bbox[0]
    label_x = (size[0] - label_width) // 2
    label_y = text_y + text_height + 10
    
    draw.text((label_x, label_y), label_text, font=font_small, fill=(203, 213, 225))
    
    # Add subtle texture
    for _ in range(50):
        x = random.randint(0, size[0])
        y = random.randint(0, size[1])
        draw.point((x, y), fill=accent_color + (30,))
    
    # Save the image
    img.save(output_path, 'JPEG', quality=90)
    print(f"✅ Created: {output_path}")

if __name__ == "__main__":
    images_dir = "/app/frontend/public/images"
    
    # Create placeholder images for all 56 characters
    for i in range(1, 57):
        output_path = os.path.join(images_dir, f"character-{i}.jpg")
        create_universal_placeholder(i, output_path)
    
    print("✅ All 56 character placeholder images created successfully!")