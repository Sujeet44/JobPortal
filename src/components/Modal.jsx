import React from "react";

export default function Modal({ isOpen, onClose, children }) {

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      
      <div
  className="modalContent max-h-[90vh] overflow-y-auto custom-scrollbar"
  onClick={(e) => e.stopPropagation()}
>
  {children}
</div>

    </div>
  );
}