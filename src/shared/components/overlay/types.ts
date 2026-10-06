/** Props for a controlled overlay. */
export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Props for a controlled overlay that supports exit animations. */
export interface AnimatedOverlayProps extends OverlayProps {
  closing?: boolean;
}

/** Props for a component that triggers an overlay. */
export interface TriggerProps {
  triggerRef: React.RefObject<HTMLElement | null>;
}

/** Props for a controlled overlay that is triggered by another component. */
export type TriggeredOverlayProps = OverlayProps & TriggerProps;

/** Props for an animated controlled overlay that is triggered by another component. */
export type AnimatedTriggeredOverlayProps = AnimatedOverlayProps & TriggerProps;
