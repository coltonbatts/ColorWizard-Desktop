# 🎯 Try It Right Now!

**See the Tauri boilerplate in action in under 1 minute.**

## ⚡ Quick Test

Run these commands:

```bash
# 1. Create a test app
npm run tauri:new hello-world

# 2. Start it
cd hello-world
npm run dev
```

**That's it!** The app will open with a simple UI showing:
- A welcome message
- An input field
- A "Greet" button
- Type-safe Rust commands working

## 🎨 What You'll See

1. **App window opens** with "Welcome to Tauri!"
2. **Input field** to enter a name
3. **Greet button** that calls a Rust command
4. **Response** appears below showing the greeting

## 🔍 What's Happening Behind the Scenes

1. **Frontend (React)** → User types name, clicks button
2. **IPC Call** → `invoke('greet', { name })`
3. **Rust Command** → Processes in `src-tauri/src/commands/example.rs`
4. **Response** → Returns formatted string
5. **UI Updates** → Shows the greeting

## 🛠️ Try These Next

### 1. Modify the Command

Edit `hello-world/src-tauri/src/commands/example.rs`:

```rust
#[command]
#[specta::specta]
pub fn greet(name: &str) -> String {
    format!("Hey there, {}! 🚀", name)  // Changed message
}
```

Save and watch it hot-reload!

### 2. Add a New Command

Add to `example.rs`:

```rust
#[command]
#[specta::specta]
pub fn get_time() -> String {
    format!("Current time: {:?}", std::time::SystemTime::now())
}
```

Register in `main.rs`:
```rust
.invoke_handler(tauri::generate_handler![
    greet,
    get_app_info,
    get_time,  // Add this
])
```

Use in `App.tsx`:
```typescript
const time = await invoke('get_time');
console.log(time);
```

### 3. Add a Plugin

```bash
# Copy storage plugin
cp -r ../tauri-plugins/storage src-tauri/src/plugins/storage

# Add to Cargo.toml
# [dependencies]
# storage-plugin = { path = "src/plugins/storage" }

# Register in main.rs
use storage_plugin::*;
```

Now use it:
```typescript
await invoke('storage_set', { key: 'test', value: 'hello' });
const value = await invoke('storage_get', { key: 'test' });
console.log(value); // "hello"
```

## 📊 Check What Was Created

```bash
# List all apps
npm run tauri:list

# You should see:
#   📱 app (your ColorWizard app)
#   📱 hello-world (the test app)
```

## 🎓 Learn More

- **QUICK_START.md** - More examples
- **WORKFLOW.md** - Daily workflow
- **DEVELOPMENT.md** - Complete guide (in boilerplate)
- **BEST_PRACTICES.md** - Production tips (in boilerplate)

## 🚀 Next Steps

1. ✅ **You just created an app!** - Keep experimenting
2. 📖 **Read the docs** - Understand what's happening
3. 🔧 **Customize it** - Make it yours
4. 🎨 **Add features** - Build something real
5. 📦 **Build it** - `npm run tauri:build`

## 💡 Pro Tips

- **Hot reload works** - Edit Rust code, see changes instantly
- **Type safety** - Specta generates TypeScript types automatically
- **Reuse plugins** - Copy from `tauri-plugins/`
- **Check examples** - See `tauri-boilerplate/src-tauri/src/commands/`

---

**You did it!** 🎉 Now go build something awesome!
