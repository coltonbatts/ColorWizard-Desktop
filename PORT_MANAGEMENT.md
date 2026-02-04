# 🔌 Port Management for Tauri Apps

## The Problem

When running multiple Tauri apps, they all try to use port `1420` by default, causing conflicts:
```
Error: Port 1420 is already in use
```

## The Solution

We've implemented **automatic port detection** - apps will find the next available port automatically.

## How It Works

### 1. Dynamic Port Finding

Each app's `vite.config.ts` now includes:

```typescript
function findFreePort(startPort = 1420, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    try {
      execSync(`lsof -Pi :${port} -sTCP:LISTEN -t`, { stdio: 'ignore' })
    } catch {
      return port  // Port is free!
    }
  }
  return startPort
}
```

### 2. Vite Configuration

```typescript
server: {
  port: PORT,  // Dynamically found
  strictPort: false,  // Allow fallback
}
```

### 3. Tauri Configuration

The `tauri.conf.json` uses the port that Vite selects automatically.

## Benefits

✅ **No conflicts** - Each app finds its own port
✅ **Automatic** - No manual configuration needed
✅ **Works with multiple apps** - Run as many as you want
✅ **Fallback** - If port detection fails, uses default

## How Developers Handle This

### Option 1: Dynamic Ports (Our Solution) ✅

**Best for**: Multiple apps, development
- Apps auto-detect free ports
- No configuration needed
- Works out of the box

### Option 2: Fixed Ports Per App

**Best for**: Production, specific requirements
- Each app gets a unique port
- Configured in `vite.config.ts`
- More predictable

### Option 3: Environment Variables

**Best for**: CI/CD, team environments
```bash
export VITE_PORT=1421
npm run dev
```

### Option 4: Port Range Assignment

**Best for**: Large teams
- App 1: 1420-1429
- App 2: 1430-1439
- App 3: 1440-1449

## Current Setup

All new apps created with `npm run tauri:new` will:
1. ✅ Auto-detect free ports
2. ✅ Start from 1420 and go up
3. ✅ Never conflict with other apps
4. ✅ Log the port they're using

## Troubleshooting

### Port Still in Use?

```bash
# Check what's using a port
lsof -i :1420

# Kill a specific process
kill -9 <PID>

# Or use our script
./scripts/find-free-port.sh 1420
```

### Want a Specific Port?

Edit `vite.config.ts`:
```typescript
server: {
  port: 1425,  // Your chosen port
  strictPort: true,
}
```

### Multiple Apps Running?

Each will automatically use:
- App 1: 1420
- App 2: 1421
- App 3: 1422
- etc.

## Best Practices

1. **Let it auto-detect** - Don't hardcode ports unless necessary
2. **Use strictPort: false** - Allows fallback
3. **Check logs** - Vite shows which port it's using
4. **Document exceptions** - If you need a specific port, note why

## Example

```bash
# Start ColorWizard (uses 1420)
cd app && npm run dev

# Start demo-app (auto-finds 1421)
cd demo-app && npm run dev

# Start another app (auto-finds 1422)
cd my-app && npm run dev

# All running simultaneously! 🎉
```

---

**No more port conflicts!** 🚀
