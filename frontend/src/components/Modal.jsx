import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!children) {
    onClose();
  }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="p-3 rounded-lg"
          >
            ❌
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
