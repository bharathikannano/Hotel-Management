
import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmButtonText = 'Confirm Deletion',
    confirmButtonVariant = 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-neutral-600 dark:text-neutral-300">{message}</p>
        <div className="flex justify-end space-x-2 pt-4 border-t dark:border-neutral-700 mt-6">
          {/* FIX: Add missing className prop. */}
          <Button type="button" variant="secondary" onClick={onClose} className="">
            Cancel
          </Button>
          {/* FIX: Add missing className prop. */}
          <Button type="button" variant={confirmButtonVariant} onClick={onConfirm} className="">
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
