import React, { useState } from 'react';
import { Reservation, Guest, Payment } from '../../types';
import Modal from './Modal';
import Button from './Button';
import Select from './Select';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCheckout: (paymentMethod: Payment['method']) => void;
  reservation: Reservation | null;
  guest?: Guest;
  roomNumber?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirmCheckout,
  reservation,
  guest,
  roomNumber
}) => {
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('Credit Card');

  if (!isOpen || !reservation || !guest) return null;
  
  const handleConfirm = () => {
    onConfirmCheckout(paymentMethod);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Checkout & Payment">
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Reservation Details</h4>
          <p className="text-slate-600 dark:text-slate-400">Guest: <span className="font-medium">{guest.firstName} {guest.lastName}</span></p>
          <p className="text-slate-600 dark:text-slate-400">Room: <span className="font-medium">{roomNumber || 'N/A'}</span></p>
        </div>
        <div className="bg-brand-50 dark:bg-brand-900/50 p-4 rounded-lg text-center">
            <p className="text-sm text-brand-700 dark:text-brand-200">Total Amount Due</p>
            <p className="text-3xl font-bold text-brand-900 dark:text-brand-100">${reservation.totalAmount.toFixed(2)}</p>
        </div>
        <div className="space-y-4">
            <Select
                label="Payment Method"
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as Payment['method'])}
            >
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
            </Select>
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t dark:border-slate-700 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirm Payment & Check-out
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;