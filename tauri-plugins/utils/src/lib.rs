use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::command;
use uuid::Uuid;

/// Generate a UUID v4
#[command]
#[specta::specta]
pub fn generate_uuid() -> String {
    Uuid::new_v4().to_string()
}

/// Get current Unix timestamp in seconds
#[command]
#[specta::specta]
pub fn get_timestamp() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

/// Get current Unix timestamp in milliseconds
#[command]
#[specta::specta]
pub fn get_timestamp_ms() -> u128 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis()
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct TimestampInfo {
    pub seconds: u64,
    pub milliseconds: u128,
    pub iso_string: String,
}

/// Get detailed timestamp information
#[command]
#[specta::specta]
pub fn get_timestamp_info() -> TimestampInfo {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap();
    
    // Simple ISO string generation without chrono
    let datetime = std::time::UNIX_EPOCH + now;
    let iso_string = format!("{:?}", datetime);
    
    TimestampInfo {
        seconds: now.as_secs(),
        milliseconds: now.as_millis(),
        iso_string,
    }
}

/// Validate email address (simple check)
#[command]
#[specta::specta]
pub fn validate_email(email: String) -> bool {
    email.contains('@') && email.contains('.') && email.len() > 5
}

/// Sanitize filename (remove invalid characters)
#[command]
#[specta::specta]
pub fn sanitize_filename(filename: String) -> String {
    filename
        .chars()
        .map(|c| match c {
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*' => '_',
            _ => c,
        })
        .collect()
}
