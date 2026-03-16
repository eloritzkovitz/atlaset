export interface MenuConfigItem {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  url?: string;
}

/**
 * Maps a menu configuration array to a format suitable for rendering in the UI.
 * @param menuConfig
 * @returns
 */
export function mapMenuItems(menuConfig: MenuConfigItem[]) {
  return menuConfig.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon />,
      url: item.url,
    };
  });
}
