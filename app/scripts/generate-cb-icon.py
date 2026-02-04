#!/usr/bin/env python3
"""
Generate CB app icons with white background and black CB text.
Requires Pillow: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Create an icon with white background and black CB text."""
    # Create white background
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Try to use a bold font, fallback to default if not available
    try:
        # Try system fonts
        font_size = int(size * 0.6)
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            # Fallback to default font
            font = ImageFont.load_default()
            font_size = int(size * 0.4)
    
    # Draw "CB" text centered
    text = "CB"
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - bbox[1]
    
    draw.text((x, y), text, fill='black', font=font)
    
    # Save the image
    img.save(output_path)
    print(f"Created {output_path} ({size}x{size})")

def main():
    icon_dir = os.path.join(os.path.dirname(__file__), '../src-tauri/icons')
    os.makedirs(icon_dir, exist_ok=True)
    
    # Generate different sizes
    sizes = {
        '32x32.png': 32,
        '128x128.png': 128,
        '128x128@2x.png': 256,
        'icon.png': 512,
    }
    
    for filename, size in sizes.items():
        output_path = os.path.join(icon_dir, filename)
        create_icon(size, output_path)
    
    print(f"\nIcons generated in {icon_dir}")
    print("Note: You may need to convert icon.png to .icns (macOS) and .ico (Windows) formats")
    print("For macOS: iconutil -c icns icon.icns --convert icon.png")
    print("For Windows: Use an online converter or ImageMagick")

if __name__ == '__main__':
    main()
