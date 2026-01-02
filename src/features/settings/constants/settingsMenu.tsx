import { FaUser, FaMoon, FaLock, FaList, FaVolumeHigh } from "react-icons/fa6";

export const SETTINGS_MENU = [
  { key: "account", label: "Account", icon: <FaUser /> },
  { key: "sound", label: "Sound", icon: <FaVolumeHigh /> },
  { key: "display", label: "Display", icon: <FaMoon /> },
  { key: "activity", label: "Activity", icon: <FaList /> },
  { key: "security", label: "Security", icon: <FaLock /> },
];
