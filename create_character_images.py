#!/usr/bin/env python3
"""
Download Buddhist character images and create placeholders.
"""

import os
import requests
from PIL import Image, ImageDraw, ImageFont
import io

def download_image(url, output_path):
    """Download an image from URL and save it locally."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print(f"✅ Downloaded: {output_path}")
        return True
    except Exception as e:
        print(f"❌ Failed to download {url}: {e}")
        return False

def create_placeholder_image(character_name, output_path, size=(400, 400)):
    """Create a placeholder image for a Buddhist character."""
    # Create a gradient background
    img = Image.new('RGB', size, color='#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Create a subtle gradient
    for i in range(size[1]):
        alpha = i / size[1]
        color = (
            int(26 + alpha * 30),   # Dark purple to lighter purple
            int(26 + alpha * 30),
            int(46 + alpha * 40)
        )
        draw.line([(0, i), (size[0], i)], fill=color)
    
    # Add a Buddhist symbol (lotus-like circle)
    center_x, center_y = size[0] // 2, size[1] // 2
    circle_radius = min(size) // 4
    
    # Outer circle
    draw.ellipse(
        [center_x - circle_radius, center_y - circle_radius,
         center_x + circle_radius, center_y + circle_radius],
        outline='#8b5cf6', width=3
    )
    
    # Inner circle
    inner_radius = circle_radius - 20
    draw.ellipse(
        [center_x - inner_radius, center_y - inner_radius,
         center_x + inner_radius, center_y + inner_radius],
        outline='#a855f7', width=2
    )
    
    # Add character name
    try:
        # Try to load a system font
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Calculate text position
    text_bbox = draw.textbbox((0, 0), character_name, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (size[0] - text_width) // 2
    text_y = center_y + circle_radius + 20
    
    # Add text shadow
    draw.text((text_x + 2, text_y + 2), character_name, font=font, fill='#000000')
    # Add main text
    draw.text((text_x, text_y), character_name, font=font, fill='#ffffff')
    
    # Save the image
    img.save(output_path, 'JPEG', quality=85)
    print(f"✅ Created placeholder: {output_path}")

if __name__ == "__main__":
    # Character names and their corresponding images
    characters = {
        'budha': 'Buda Śākyamuni',
        'samantabhadra': 'Samantabhadra',
        'manjusri': 'Manjuśrī',
        'meghasri': 'Meghaśrī',
        'sagara_megha': 'Sāgaramegha',
        'supratisthita': 'Supratiṣṭhita',
        'avalokitesvara': 'Avalokiteśvara',
        'maitreya': 'Maitreya',
        'vajrapani': 'Vajrapāṇi',
        'kshitigarbha': 'Kṣitigarbha'
    }
    
    images_dir = "/app/frontend/public/images"
    
    # Download reference images
    reference_images = [
        ("https://images.unsplash.com/photo-1529485726363-95c8d62f656f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxidWRkaGF8ZW58MHx8fHwxNzUyODYxMDc2fDA&ixlib=rb-4.1.0&q=85", "budha.jpg"),
        ("https://images.unsplash.com/photo-1589400554239-7c6cf8393a6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxidWRkaGF8ZW58MHx8fHwxNzUyODYxMDc2fDA&ixlib=rb-4.1.0&q=85", "samantabhadra.jpg"),
        ("https://images.unsplash.com/photo-1631949136465-af801b6c5244?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxidWRkaGF8ZW58MHx8fHwxNzUyODYxMDc2fDA&ixlib=rb-4.1.0&q=85", "manjusri.jpg"),
        ("https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9ufGVufDB8fHx8MTc1MjgzMDg1M3ww&ixlib=rb-4.1.0&q=85", "meghasri.jpg"),
        ("https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxtZWRpdGF0aW9ufGVufDB8fHx8MTc1MjgzMDg1M3ww&ixlib=rb-4.1.0&q=85", "sagara_megha.jpg"),
    ]
    
    # Download reference images
    for url, filename in reference_images:
        output_path = os.path.join(images_dir, filename)
        download_image(url, output_path)
    
    # Create placeholder images for all characters
    for character_id, character_name in characters.items():
        output_path = os.path.join(images_dir, f"{character_id}.jpg")
        create_placeholder_image(character_name, output_path)
    
    print("✅ All character images created successfully!")