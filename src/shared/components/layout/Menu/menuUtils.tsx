export interface MenuConfigItem {
  key: string;
  label: string;
  icon: React.ComponentType<object>;
  url?: string;
  file?: string;
}

/**
 * Maps a menu configuration array to a format suitable for rendering in the UI.
 * @param menuConfig - Array of menu configuration items, each containing key, label, icon, and optional url/file.
 * @returns Array of menu items with React nodes for icons and additional properties for rendering.
 */
export function mapMenuItems(menuConfig: MenuConfigItem[]) {
  return menuConfig.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon />,
      url: item.url,
      file: item.file,
    };
  });
}
