use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::command;

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub platform: String,
}

/// A simple greet command
#[command]
#[specta::specta]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Get app information
#[command]
#[specta::specta]
pub fn get_app_info() -> AppInfo {
    AppInfo {
        name: env!("CARGO_PKG_NAME").to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        platform: std::env::consts::OS.to_string(),
    }
}
