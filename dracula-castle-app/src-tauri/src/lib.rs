use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct WindowClick {
    window_id: u32,
}

#[tauri::command]
fn window_clicked(window_id: u32) -> Result<String, String> {
    // You can add sound effects or other backend logic here
    println!("Window {} was clicked!", window_id);
    Ok(format!("Window {} clicked!", window_id))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![window_clicked])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
