import type { keyCommands } from "@constants/keyCommands";

/** Represents a key on the keyboard. */
export type Key =
  | "a"
  | "A"
  | "b"
  | "B"
  | "c"
  | "C"
  | "d"
  | "D"
  | "e"
  | "E"
  | "f"
  | "F"
  | "g"
  | "G"
  | "h"
  | "H"
  | "i"
  | "I"
  | "j"
  | "J"
  | "k"
  | "K"
  | "l"
  | "L"
  | "m"
  | "M"
  | "n"
  | "N"
  | "o"
  | "O"
  | "p"
  | "P"
  | "q"
  | "Q"
  | "r"
  | "R"
  | "s"
  | "S"
  | "t"
  | "T"
  | "u"
  | "U"
  | "v"
  | "V"
  | "w"
  | "W"
  | "x"
  | "X"
  | "y"
  | "Y"
  | "z"
  | "Z"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | "Esc"
  | "Escape"
  | "Tab"
  | "Backspace"
  | "Delete"
  | "Home"
  | "End"
  | "PgUp"
  | "PageUp"
  | "PgDn"
  | "PageDown"
  | "="
  | "+"
  | "-"
  | "0"
  | "?"
  | "/"
  | " "
  | "Space";

/** Represents a modifier key. */
export type Modifier = "Ctrl" | "Alt" | "Shift" | "Meta";

/** Represents the ID of a keyboard command. */
export type CommandId = (typeof keyCommands)[number]["id"];

/** Represents a keyboard command. */
export type KeyCommand = {
  id: CommandId;
  /** The main key pressed. */
  key: Key;
  /** The modifier keys pressed along with the main key. */
  modifiers: readonly Modifier[];
  /** The category to which the keyboard command belongs. */
  category: string;
  /** The label key for the keyboard command. */
  labelKey: string;
};

/** Represents a function that handles keyboard events. */
export type KeyHandler = (event: KeyboardEvent) => void;
