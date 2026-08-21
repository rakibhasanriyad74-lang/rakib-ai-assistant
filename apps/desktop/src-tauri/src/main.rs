#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuEntry, MenuItem, Submenu};

fn main() {
  let ctx = tauri::generate_context!();

  // Menu bar
  let app_menu = Submenu::new(
    "App",
    Menu::new()
      .add_item(CustomMenuItem::new("about", "About RAKIB"))
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit),
  );

  let edit_menu = Submenu::new(
    "Edit",
    Menu::new()
      .add_native_item(MenuItem::Undo)
      .add_native_item(MenuItem::Redo)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Cut)
      .add_native_item(MenuItem::Copy)
      .add_native_item(MenuItem::Paste),
  );

  let view_menu = Submenu::new(
    "View",
    Menu::new()
      .add_item(CustomMenuItem::new("reload", "Reload"))
      .add_item(CustomMenuItem::new("dev_tools", "Developer Tools"))
      .add_native_item(MenuItem::Separator)
      .add_item(CustomMenuItem::new("fullscreen", "Toggle Fullscreen")),
  );

  let menu = Menu::new()
    .add_entry(MenuEntry::Submenu(app_menu))
    .add_entry(MenuEntry::Submenu(edit_menu))
    .add_entry(MenuEntry::Submenu(view_menu));

  tauri::Builder::default()
    .menu(menu)
    .on_menu_event(|event| match event.menu_item_id() {
      "about" => {
        // Show about dialog
      }
      "reload" => {
        event.window().emit("menu:reload", ()).unwrap();
      }
      "dev_tools" => {
        #[cfg(debug_assertions)]
        event.window().open_devtools();
      }
      "fullscreen" => {
        let window = event.window();
        window
          .set_fullscreen(!window.is_fullscreen().unwrap_or(false))
          .ok();
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![
      greet,
      get_app_info,
      get_system_info
    ])
    .run(ctx)
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}

#[tauri::command]
fn get_app_info() -> serde_json::json::Value {
  serde_json::json!({
    "name": "RAKIB AI Assistant",
    "version": "1.0.0",
    "author": "Rakib Hasan"
  })
}

#[tauri::command]
fn get_system_info() -> serde_json::json::Value {
  serde_json::json!({
    "platform": std::env::consts::OS,
    "arch": std::env::consts::ARCH,
  })
}
