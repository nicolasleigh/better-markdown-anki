import os
import shutil
import sys

#!/usr/bin/env python3

def main():
    # Determine source and destination paths
    repo_root = os.path.dirname(os.path.abspath(__file__))
    dist_assets_dir = os.path.join(repo_root, "frontend", "dist", "assets")
    
    # Locate the built .js and .css files in the dist/assets folder
    js_files = [f for f in os.listdir(dist_assets_dir) if f.endswith(".js") and os.path.isfile(os.path.join(dist_assets_dir, f))]
    if not js_files:
        print(f"No .js files found in {dist_assets_dir}", file=sys.stderr)
        sys.exit(1)

    css_files = [f for f in os.listdir(dist_assets_dir) if f.endswith(".css") and os.path.isfile(os.path.join(dist_assets_dir, f))]
    if not css_files:
        print(f"No .css files found in {dist_assets_dir}", file=sys.stderr)
        sys.exit(1)

    # Define destination directory
    dest_dir = os.path.expanduser("~/.local/share/Anki2/User 1/collection.media")
    
    # Copy .js file
    src_js = os.path.join(dist_assets_dir, js_files[0])
    filename_js = "_anki-flashcard.js"
    dest_js = os.path.join(dest_dir, filename_js)
    
    # Copy .css file
    src_css = os.path.join(dist_assets_dir, css_files[0])
    filename_css = "_anki-flashcard.css"
    dest_css = os.path.join(dest_dir, filename_css)

    # Define source and destination for fonts folder
    src_fonts_dir = os.path.join(repo_root, "frontend", "dist", "assets", "fonts")
    dest_fonts_dir = os.path.join(dest_dir, "assets", "fonts")

    try:
        # Copy .js file
        shutil.copy2(src_js, dest_js)
        print(f"Copied {src_js} to {dest_js}")
        
        # Copy .css file
        shutil.copy2(src_css, dest_css)
        print(f"Copied {src_css} to {dest_css}")
        
        # Copy fonts folder
        if os.path.exists(src_fonts_dir):
            if os.path.exists(dest_fonts_dir):
                shutil.rmtree(dest_fonts_dir) # Remove existing fonts folder to ensure a clean copy
                print(f"Removed existing folder: {dest_fonts_dir}")
            shutil.copytree(src_fonts_dir, dest_fonts_dir)
            print(f"Copied folder {src_fonts_dir} to {dest_fonts_dir}")
        else:
            print(f"Source fonts directory not found: {src_fonts_dir}", file=sys.stderr)

    except Exception as e:
        print(f"Failed to copy files or folder: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()