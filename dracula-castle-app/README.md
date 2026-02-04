# 🦇 Dracula's Castle - Interactive Window Clicker

A spooky Tauri desktop app featuring Dracula's castle with clickable windows that light up!

## Features

- 🏰 Beautiful Dracula's castle image
- 💡 Click windows to light them up
- 🎭 Each window has a unique message about the room
- ✨ Smooth animations and transitions
- 🌙 Dark, atmospheric design

## How to Use

1. **Start the app:**
   ```bash
   npm run desktop:dev
   ```

2. **Click the windows** in the castle image to light them up
3. Each window reveals a message about what's inside
4. Watch the counter to see how many windows you've lit

## Customization

### Adjust Window Positions

Edit `src/App.tsx` to change window positions. Each window has:
- `x`, `y`: Position as percentage (0-100)
- `width`, `height`: Size as percentage
- `message`: Text shown when clicked

### Change the Castle Image

Replace `src/dracula-castle.png` with your own castle image!

## Development

```bash
# Install dependencies
npm install

# Run in dev mode (with hot reload)
npm run desktop:dev

# Build for production
npm run desktop:build
```

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Rust + Tauri v2
- **Build**: Vite

Enjoy exploring Dracula's castle! 🦇
