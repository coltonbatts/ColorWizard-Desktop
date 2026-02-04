#!/bin/bash

# Generate TypeScript types from Rust commands using Specta
# This script should be run after building the Rust code

echo "Generating TypeScript types from Rust commands..."

cd src-tauri

# Build with specta feature to generate types
cargo build --features specta

if [ $? -eq 0 ]; then
    echo "✅ Types generated successfully!"
    echo "📁 Check src/lib/tauri-commands.ts for generated types"
else
    echo "❌ Failed to generate types"
    exit 1
fi
