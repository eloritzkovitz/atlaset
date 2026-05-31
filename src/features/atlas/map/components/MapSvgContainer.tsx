import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { usePointerDrag } from "@hooks";

interface MapSvgContainerProps {
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
}

export const MapSvgContainer = forwardRef<SVGSVGElement, MapSvgContainerProps>(
  function MapSvgContainer({ width, height, children, className }, ref) {
    const { dragging, handlePointerDown, setModalDomRef } = usePointerDrag(
      true,
      true,
    );
    const localRef = useRef<SVGSVGElement | null>(null);

    // Set the ref for the draggable hook and expose the local ref to parent
    useEffect(() => setModalDomRef(localRef.current), [setModalDomRef]);
    useImperativeHandle(ref, () => localRef.current!, []);

    return (
      <svg
        ref={localRef}
        width={width}
        height={height}
        onPointerDown={
          handlePointerDown as React.PointerEventHandler<SVGSVGElement>
        }
        className={`absolute inset-0 w-full h-full ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className ?? ""}`}
      >
        {children}
      </svg>
    );
  },
);
