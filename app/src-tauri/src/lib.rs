use rfd::FileDialog;
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct MarkdownFile {
    name: String,
    path: String,
    content: String,
    modified: String,
}

#[tauri::command]
fn get_default_markdown_dir(app: tauri::AppHandle) -> Result<String, String> {
    // Use Documents folder
    let documents = app
        .path()
        .document_dir()
        .map_err(|err| format!("Could not find Documents folder: {err}"))?;
    let markdown_dir = documents.join("CB Markdown");
    // Create directory if it doesn't exist
    if !markdown_dir.exists() {
        fs::create_dir_all(&markdown_dir).map_err(|err| format!("Could not create directory: {err}"))?;
    }
    Ok(markdown_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn pick_folder(title: Option<String>) -> Option<String> {
    let mut dialog = FileDialog::new();
    if let Some(title) = title {
        dialog = dialog.set_title(&title);
    }

    dialog
        .pick_folder()
        .map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn pick_markdown_file() -> Option<String> {
    FileDialog::new()
        .set_title("Select Markdown File")
        .add_filter("Markdown", &["md", "markdown"])
        .pick_file()
        .map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn list_markdown_files(dir: String) -> Result<Vec<MarkdownFile>, String> {
    let dir_path = PathBuf::from(dir);
    let mut files = Vec::new();

    if !dir_path.exists() {
        return Ok(files);
    }

    let entries = fs::read_dir(&dir_path).map_err(|err| format!("Could not read directory: {err}"))?;

    for entry in entries {
        let entry = entry.map_err(|err| format!("Could not read entry: {err}"))?;
        let path = entry.path();

        if path.is_file() {
            if let Some(ext) = path.extension() {
                if ext == "md" || ext == "markdown" {
                    let name = path
                        .file_name()
                        .and_then(|n| n.to_str())
                        .unwrap_or("Unknown")
                        .to_string();

                    let metadata = entry.metadata().map_err(|err| format!("Could not read metadata: {err}"))?;
                    let modified = metadata
                        .modified()
                        .map_err(|err| format!("Could not get modified time: {err}"))?
                        .duration_since(std::time::UNIX_EPOCH)
                        .map(|d| d.as_secs())
                        .unwrap_or(0);

                    files.push(MarkdownFile {
                        name,
                        path: path.to_string_lossy().to_string(),
                        content: String::new(), // Don't load content in list
                        modified: modified.to_string(),
                    });
                }
            }
        }
    }

    // Sort by modified time (newest first)
    files.sort_by(|a, b| {
        let a_time: u64 = a.modified.parse().unwrap_or(0);
        let b_time: u64 = b.modified.parse().unwrap_or(0);
        b_time.cmp(&a_time)
    });

    Ok(files)
}

#[tauri::command]
fn read_markdown_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|err| format!("Could not read file: {err}"))
}

#[tauri::command]
fn write_markdown_file(path: String, content: String) -> Result<(), String> {
    let file_path = PathBuf::from(&path);
    
    // Create parent directory if it doesn't exist
    if let Some(parent) = file_path.parent() {
        fs::create_dir_all(parent).map_err(|err| format!("Could not create directory: {err}"))?;
    }

    let mut file = fs::File::create(&file_path).map_err(|err| format!("Could not create file: {err}"))?;
    file.write_all(content.as_bytes())
        .map_err(|err| format!("Could not write file: {err}"))?;
    file.sync_all().map_err(|err| format!("Could not sync file: {err}"))?;

    Ok(())
}

#[tauri::command]
fn delete_markdown_file(path: String) -> Result<(), String> {
    fs::remove_file(&path).map_err(|err| format!("Could not delete file: {err}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_default_markdown_dir,
            pick_folder,
            pick_markdown_file,
            list_markdown_files,
            read_markdown_file,
            write_markdown_file,
            delete_markdown_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
