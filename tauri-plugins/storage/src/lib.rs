use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::fs;
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct StorageValue {
    pub value: String,
    pub timestamp: u64,
}

/// Get the storage directory for this app
fn get_storage_dir(app: &AppHandle) -> Result<PathBuf> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .context("Failed to get app data directory")?;
    
    let storage_dir = app_data_dir.join("storage");
    fs::create_dir_all(&storage_dir).context("Failed to create storage directory")?;
    
    Ok(storage_dir)
}

/// Get a value from storage
#[command]
#[specta::specta]
pub fn storage_get(app: AppHandle, key: String) -> Result<Option<String>, String> {
    let storage_dir = get_storage_dir(&app).map_err(|e| e.to_string())?;
    let file_path = storage_dir.join(format!("{}.json", key));
    
    if !file_path.exists() {
        return Ok(None);
    }
    
    let content = fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read storage file: {}", e))?;
    
    let storage_value: StorageValue = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse storage file: {}", e))?;
    
    Ok(Some(storage_value.value))
}

/// Set a value in storage
#[command]
#[specta::specta]
pub fn storage_set(app: AppHandle, key: String, value: String) -> Result<(), String> {
    let storage_dir = get_storage_dir(&app).map_err(|e| e.to_string())?;
    let file_path = storage_dir.join(format!("{}.json", key));
    
    let storage_value = StorageValue {
        value,
        timestamp: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs(),
    };
    
    let content = serde_json::to_string_pretty(&storage_value)
        .map_err(|e| format!("Failed to serialize storage value: {}", e))?;
    
    fs::write(&file_path, content)
        .map_err(|e| format!("Failed to write storage file: {}", e))?;
    
    Ok(())
}

/// Delete a value from storage
#[command]
#[specta::specta]
pub fn storage_delete(app: AppHandle, key: String) -> Result<(), String> {
    let storage_dir = get_storage_dir(&app).map_err(|e| e.to_string())?;
    let file_path = storage_dir.join(format!("{}.json", key));
    
    if file_path.exists() {
        fs::remove_file(&file_path)
            .map_err(|e| format!("Failed to delete storage file: {}", e))?;
    }
    
    Ok(())
}

/// List all storage keys
#[command]
#[specta::specta]
pub fn storage_list(app: AppHandle) -> Result<Vec<String>, String> {
    let storage_dir = get_storage_dir(&app).map_err(|e| e.to_string())?;
    
    let entries = fs::read_dir(&storage_dir)
        .map_err(|e| format!("Failed to read storage directory: {}", e))?;
    
    let mut keys = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        if let Some(name) = entry.file_name().to_str() {
            if name.ends_with(".json") {
                keys.push(name.trim_end_matches(".json").to_string());
            }
        }
    }
    
    Ok(keys)
}

/// Clear all storage
#[command]
#[specta::specta]
pub fn storage_clear(app: AppHandle) -> Result<(), String> {
    let storage_dir = get_storage_dir(&app).map_err(|e| e.to_string())?;
    
    let entries = fs::read_dir(&storage_dir)
        .map_err(|e| format!("Failed to read storage directory: {}", e))?;
    
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();
        if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("json") {
            fs::remove_file(&path)
                .map_err(|e| format!("Failed to delete storage file: {}", e))?;
        }
    }
    
    Ok(())
}
