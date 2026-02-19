import {
  FaLock,
  FaPaintbrush,
  FaShieldHalved,
  FaUser,
  FaVolumeHigh,
} from "react-icons/fa6";

export const SETTINGS_MENU = [
  { key: "account", label: "Account", icon: <FaUser /> },
  { key: "sound", label: "Sound", icon: <FaVolumeHigh /> },
  { key: "display", label: "Display", icon: <FaPaintbrush /> },
  { key: "privacy", label: "Privacy", icon: <FaShieldHalved /> },
  { key: "security", label: "Security", icon: <FaLock /> },
];
