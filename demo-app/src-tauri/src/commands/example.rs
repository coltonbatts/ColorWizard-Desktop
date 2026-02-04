use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub platform: String,
}

/// A simple greet command
#[command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust! 🦀", name)
}

/// Get app information
#[command]
pub fn get_app_info() -> AppInfo {
    AppInfo {
        name: env!("CARGO_PKG_NAME").to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        platform: std::env::consts::OS.to_string(),
    }
}
