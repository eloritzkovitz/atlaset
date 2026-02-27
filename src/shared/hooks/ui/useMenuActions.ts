type MenuActionsMap = { [key: string]: (() => void) | undefined };

/** Manages menu actions by wrapping them to close the menu before calling the action.
 * @param actions - An object mapping action names to their corresponding functions.
 * @param setMenuOpen - A function to control the open state of the menu.
 * @returns An object with the same keys as actions, but with each function wrapped to close the menu first.
 */
export function useMenuActions(
  actions: MenuActionsMap,
  setMenuOpen: (open: boolean) => void,
) {
  const closeMenuAndCall = (action?: () => void) => {
    setTimeout(() => setMenuOpen(false), 100);
    if (action) action();
  };

  // Wrap all actions to close menu before calling
  const wrappedActions: MenuActionsMap = {};
  for (const key in actions) {
    const action = actions[key];
    wrappedActions[key] = action ? () => closeMenuAndCall(action) : undefined;
  }
  return wrappedActions;
}
