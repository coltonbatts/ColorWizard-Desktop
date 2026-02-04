pub mod example;

pub use example::*;

// Export all commands for Specta type generation
use specta::collect_types;
use tauri::command;

// This will generate TypeScript types at build time
#[cfg(feature = "specta")]
pub fn specta_builder() -> specta::ts::ExportError {
    use specta::ts;
    
    ts::export(
        collect_types![greet, get_app_info],
        "../src/lib/tauri-commands.ts",
    )
}
