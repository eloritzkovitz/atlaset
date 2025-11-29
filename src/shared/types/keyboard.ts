// Key type definition
export type Key =
  | "a" | "A"
  | "b" | "B"
  | "c" | "C"
  | "d" | "D"
  | "e" | "E"
  | "f" | "F"
  | "g" | "G"
  | "h" | "H"
  | "i" | "I"
  | "j" | "J"
  | "k" | "K"
  | "l" | "L"
  | "m" | "M"
  | "n" | "N"
  | "o" | "O"
  | "p" | "P"
  | "q" | "Q"
  | "r" | "R"
  | "s" | "S"
  | "t" | "T"
  | "u" | "U"
  | "v" | "V"
  | "w" | "W"
  | "x" | "X"
  | "y" | "Y"
  | "z" | "Z"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | "Esc" | "Escape"
  | "Tab"
  | "Backspace"
  | "Delete"
  | "Home"
  | "End"
  | "PgUp" | "PageUp"
  | "PgDn" | "PageDown"
  | "="
  | "+"
  | "-"
  | "0"
  | "?"
  | "/"
  | " " | "Space";

// Modifier type definition
export type Modifier = "Ctrl" | "Alt" | "Shift" | "Meta";

// Key command type definition
export type KeyCommand = {
  key: Key;
  modifiers: Modifier[];
  action: string;
  category: string;
};

// Key handler function type definition
export type KeyHandler = (event: KeyboardEvent) => void;
