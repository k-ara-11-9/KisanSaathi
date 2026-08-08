import React from 'react';

/**
 * Generic modal shell. Clicking the backdrop or the × calls onClose.
 * Content is passed as children — see LocationPermissionModal for an
 * example of a modal built on top of this.
 */
export default function Modal({ onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
}
