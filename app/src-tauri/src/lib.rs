use rfd::FileDialog;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::Manager;

const CURRENT_SCHEMA_VERSION: u32 = 1;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Rgb {
    r: u8,
    g: u8,
    b: u8,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct ProjectSwatch {
    id: String,
    hex: String,
    rgb: Rgb,
    label: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct ProjectData {
    schema_version: u32,
    name: String,
    notes: String,
    created_at: String,
    updated_at: String,
    last_saved_at: String,
    reference_image: Option<String>,
    swatches: Vec<ProjectSwatch>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ProjectEnvelope {
    project_path: String,
    project: ProjectData,
    needs_repair: bool,
    repair_notes: Vec<String>,
}

fn unix_timestamp() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0)
}

fn now_isoish() -> String {
    format!("{}", unix_timestamp())
}

fn sanitize_segment(input: &str) -> String {
    let mut out = String::new();
    for ch in input.chars() {
        if ch.is_ascii_alphanumeric() {
            out.push(ch.to_ascii_lowercase());
        } else if (ch == ' ' || ch == '-' || ch == '_') && !out.ends_with('-') {
            out.push('-');
        }
    }
    out.trim_matches('-').to_string()
}

fn sanitize_hex(hex: &str) -> Option<String> {
    if hex.len() != 7 || !hex.starts_with('#') {
        return None;
    }

    if hex.chars().skip(1).all(|ch| ch.is_ascii_hexdigit()) {
        Some(hex.to_uppercase())
    } else {
        None
    }
}

fn rgb_to_hex(rgb: &Rgb) -> String {
    format!("#{:02X}{:02X}{:02X}", rgb.r, rgb.g, rgb.b)
}

fn parse_rgb(raw: &Value) -> Option<Rgb> {
    let obj = raw.as_object()?;

    let r = obj.get("r")?.as_u64()?;
    let g = obj.get("g")?.as_u64()?;
    let b = obj.get("b")?.as_u64()?;

    if r > 255 || g > 255 || b > 255 {
        return None;
    }

    Some(Rgb {
        r: r as u8,
        g: g as u8,
        b: b as u8,
    })
}

fn run_migrations_placeholder(raw: &Value) -> Vec<String> {
    let mut notes = Vec::new();
    let raw_schema = raw.get("schemaVersion").and_then(|value| value.as_u64()).unwrap_or(0);

    if raw_schema == 0 {
        notes.push("Migration placeholder hit: defaulting legacy project to schemaVersion 1.".to_string());
    }

    notes
}

fn default_project() -> ProjectData {
    ProjectData {
        schema_version: CURRENT_SCHEMA_VERSION,
        name: "Recovered Project".to_string(),
        notes: String::new(),
        created_at: "0".to_string(),
        updated_at: "0".to_string(),
        last_saved_at: "0".to_string(),
        reference_image: None,
        swatches: Vec::new(),
    }
}

fn normalize_project_value(raw: Value) -> (ProjectData, Vec<String>) {
    let mut notes = Vec::new();
    notes.extend(run_migrations_placeholder(&raw));

    let Some(obj) = raw.as_object() else {
        notes.push("project.json is not an object; loaded safe defaults.".to_string());
        return (default_project(), notes);
    };

    let mut project = default_project();

    if let Some(raw_schema) = obj.get("schemaVersion").and_then(|value| value.as_u64()) {
        project.schema_version = if raw_schema >= CURRENT_SCHEMA_VERSION as u64 {
            raw_schema as u32
        } else {
            CURRENT_SCHEMA_VERSION
        };
    }

    if let Some(name) = obj.get("name").and_then(|value| value.as_str()) {
        if !name.trim().is_empty() {
            project.name = name.trim().to_string();
        } else {
            notes.push("Project name was empty; defaulted to 'Recovered Project'.".to_string());
        }
    } else {
        notes.push("Missing 'name'; defaulted to 'Recovered Project'.".to_string());
    }

    if let Some(notes_value) = obj.get("notes").and_then(|value| value.as_str()) {
        project.notes = notes_value.to_string();
    }

    if let Some(created_at) = obj.get("createdAt").and_then(|value| value.as_str()) {
        project.created_at = created_at.to_string();
    } else {
        notes.push("Missing 'createdAt'; defaulted to '0'.".to_string());
    }

    if let Some(updated_at) = obj.get("updatedAt").and_then(|value| value.as_str()) {
        project.updated_at = updated_at.to_string();
    } else {
        notes.push("Missing 'updatedAt'; defaulted to '0'.".to_string());
    }

    if let Some(last_saved_at) = obj.get("lastSavedAt").and_then(|value| value.as_str()) {
        project.last_saved_at = last_saved_at.to_string();
    } else {
        project.last_saved_at = project.updated_at.clone();
        notes.push("Missing 'lastSavedAt'; defaulted to 'updatedAt'.".to_string());
    }

    if let Some(reference) = obj.get("referenceImage") {
        match reference {
            Value::Null => project.reference_image = None,
            Value::String(path) => {
                if path.starts_with("http://") || path.starts_with("https://") {
                    notes.push("Remote reference image URL blocked; cleared referenceImage.".to_string());
                    project.reference_image = None;
                } else {
                    project.reference_image = Some(path.clone());
                }
            }
            _ => notes.push("Invalid 'referenceImage'; cleared value.".to_string()),
        }
    }

    match obj.get("swatches") {
        Some(Value::Array(raw_swatches)) => {
            for (index, raw_swatch) in raw_swatches.iter().enumerate() {
                let Some(swatch_obj) = raw_swatch.as_object() else {
                    notes.push(format!("Swatch {} was not an object and was skipped.", index));
                    continue;
                };

                let rgb = match swatch_obj.get("rgb").and_then(parse_rgb) {
                    Some(rgb) => rgb,
                    None => {
                        notes.push(format!("Swatch {} had invalid rgb and was skipped.", index));
                        continue;
                    }
                };

                let hex = swatch_obj
                    .get("hex")
                    .and_then(|value| value.as_str())
                    .and_then(sanitize_hex)
                    .unwrap_or_else(|| {
                        notes.push(format!("Swatch {} had invalid hex; derived from rgb.", index));
                        rgb_to_hex(&rgb)
                    });

                let id = swatch_obj
                    .get("id")
                    .and_then(|value| value.as_str())
                    .map(|value| value.trim())
                    .filter(|value| !value.is_empty())
                    .map(ToOwned::to_owned)
                    .unwrap_or_else(|| {
                        notes.push(format!("Swatch {} missing id; generated deterministic id.", index));
                        format!("recovered-{}", index)
                    });

                let label = swatch_obj
                    .get("label")
                    .and_then(|value| value.as_str())
                    .map(|value| value.to_string());

                project.swatches.push(ProjectSwatch { id, hex, rgb, label });
            }
        }
        Some(_) => notes.push("Invalid 'swatches'; defaulted to empty list.".to_string()),
        None => notes.push("Missing 'swatches'; defaulted to empty list.".to_string()),
    }

    (project, notes)
}

fn read_project(project_dir: &Path) -> Result<(ProjectData, Vec<String>), String> {
    let json_path = project_dir.join("project.json");
    let raw = fs::read_to_string(&json_path).map_err(|err| err.to_string())?;

    match serde_json::from_str::<Value>(&raw) {
        Ok(value) => Ok(normalize_project_value(value)),
        Err(_) => {
            let mut notes = Vec::new();
            notes.push("Malformed JSON in project.json; loaded safe defaults.".to_string());
            Ok((default_project(), notes))
        }
    }
}

fn write_project(project_dir: &Path, project: &ProjectData) -> Result<(), String> {
    let json_path = project_dir.join("project.json");
    let tmp_path = project_dir.join("project.json.tmp");
    let json = serde_json::to_vec_pretty(project).map_err(|err| err.to_string())?;

    if let Some(parent) = json_path.parent() {
        fs::create_dir_all(parent).map_err(|err| err.to_string())?;
    }

    let mut file = OpenOptions::new()
        .create(true)
        .truncate(true)
        .write(true)
        .open(&tmp_path)
        .map_err(|err| err.to_string())?;

    file.write_all(&json).map_err(|err| err.to_string())?;
    file.sync_all().map_err(|err| err.to_string())?;
    drop(file);

    fs::rename(&tmp_path, &json_path).map_err(|err| err.to_string())?;

    if let Ok(dir) = OpenOptions::new().read(true).open(project_dir) {
        let _ = dir.sync_all();
    }

    Ok(())
}

#[tauri::command]
fn default_projects_dir(app: tauri::AppHandle) -> Result<String, String> {
    let documents = app
        .path()
        .document_dir()
        .map_err(|err| format!("Could not find Documents folder: {err}"))?;
    Ok(documents.join("ColorWizard").to_string_lossy().to_string())
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
fn pick_image_file() -> Option<String> {
    FileDialog::new()
        .set_title("Select reference image")
        .add_filter("Image", &["png", "jpg", "jpeg", "webp", "bmp"])
        .pick_file()
        .map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn create_project(base_dir: String, project_name: String) -> Result<ProjectEnvelope, String> {
    let base = PathBuf::from(base_dir);
    fs::create_dir_all(&base).map_err(|err| err.to_string())?;

    let slug = sanitize_segment(&project_name);
    let fallback = format!("project-{}", unix_timestamp());
    let folder_name = if slug.is_empty() { fallback } else { slug };

    let mut project_path = base.join(folder_name);
    if project_path.exists() {
        project_path = base.join(format!("{}-{}", sanitize_segment(&project_name), unix_timestamp()));
    }

    fs::create_dir_all(project_path.join("reference")).map_err(|err| err.to_string())?;
    fs::create_dir_all(project_path.join("exports")).map_err(|err| err.to_string())?;

    let now = now_isoish();
    let project = ProjectData {
        schema_version: CURRENT_SCHEMA_VERSION,
        name: project_name,
        notes: String::new(),
        created_at: now.clone(),
        updated_at: now.clone(),
        last_saved_at: now,
        reference_image: None,
        swatches: Vec::new(),
    };

    write_project(&project_path, &project)?;

    Ok(ProjectEnvelope {
        project_path: project_path.to_string_lossy().to_string(),
        project,
        needs_repair: false,
        repair_notes: Vec::new(),
    })
}

#[tauri::command]
fn load_project(project_dir: String) -> Result<ProjectEnvelope, String> {
    let project_path = PathBuf::from(project_dir);
    let (project, repair_notes) = read_project(&project_path)?;

    Ok(ProjectEnvelope {
        project_path: project_path.to_string_lossy().to_string(),
        project,
        needs_repair: !repair_notes.is_empty(),
        repair_notes,
    })
}

#[tauri::command]
fn save_project(project_dir: String, mut project: ProjectData) -> Result<ProjectEnvelope, String> {
    let project_path = PathBuf::from(project_dir);
    let now = now_isoish();

    project.schema_version = CURRENT_SCHEMA_VERSION;
    project.updated_at = now.clone();
    project.last_saved_at = now;

    write_project(&project_path, &project)?;

    Ok(ProjectEnvelope {
        project_path: project_path.to_string_lossy().to_string(),
        project,
        needs_repair: false,
        repair_notes: Vec::new(),
    })
}

#[tauri::command]
fn import_reference_image(
    project_dir: String,
    image_path: String,
    mut project: ProjectData,
) -> Result<ProjectEnvelope, String> {
    let project_path = PathBuf::from(project_dir);
    let source = PathBuf::from(image_path);

    if !source.exists() {
        return Err("Selected image does not exist on disk".to_string());
    }

    let ext = source
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or("png")
        .to_lowercase();
    let file_name = format!("reference-{}.{}", unix_timestamp(), ext);

    let dest = project_path.join("reference").join(&file_name);
    if let Some(parent) = dest.parent() {
        fs::create_dir_all(parent).map_err(|err| err.to_string())?;
    }

    fs::copy(&source, &dest).map_err(|err| err.to_string())?;

    let now = now_isoish();
    project.schema_version = CURRENT_SCHEMA_VERSION;
    project.reference_image = Some(format!("reference/{}", file_name));
    project.updated_at = now.clone();
    project.last_saved_at = now;

    write_project(&project_path, &project)?;

    Ok(ProjectEnvelope {
        project_path: project_path.to_string_lossy().to_string(),
        project,
        needs_repair: false,
        repair_notes: Vec::new(),
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            default_projects_dir,
            pick_folder,
            pick_image_file,
            create_project,
            load_project,
            save_project,
            import_reference_image,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
