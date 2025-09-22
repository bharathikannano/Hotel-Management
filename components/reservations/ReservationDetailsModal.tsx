
import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ReservationStatusBadge } from '../common/StatusBadge';

const ReservationDetailsModal = ({
  isOpen,
  onClose,
  reservation,
  guest,
  room,
  roomType,
}) => {
  if (!isOpen || !reservation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reservation Details: ${reservation.id}`}>
      <div className="space-y-6">
        <div className="p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Guest</h4>
                <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{guest ? `${guest.firstName} ${guest.lastName}` : 'N/A'}</p>
            </div>
            <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Room</h4>
                <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{room?.roomNumber || 'N/A'}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{roomType?.name || ''}</p>
            </div>
            <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Status</h4>
                <ReservationStatusBadge status={reservation.status} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-300">Check-in</h4>
            <p className="text-neutral-600 dark:text-neutral-400">{reservation.checkInDate} {reservation.checkInTime ? ` at ${reservation.checkInTime}` : ''}</p>
            {reservation.expectedCheckInTime && <p className="text-xs text-neutral-500 dark:text-neutral-500">Expected: {reservation.expectedCheckInTime}</p>}
          </div>
          <div>
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-300">Check-out</h4>
            <p className="text-neutral-600 dark:text-neutral-400">{reservation.checkOutDate} {reservation.checkOutTime ? ` at ${reservation.checkOutTime}` : ''}</p>
            {reservation.expectedCheckOutTime && <p className="text-xs text-neutral-500 dark:text-neutral-500">Expected: {reservation.expectedCheckOutTime}</p>}
          </div>
        </div>
        
        <div className="bg-primary-50 dark:bg-primary-900/50 p-4 rounded-lg text-center">
            <p className="text-sm text-primary-700 dark:text-primary-200">Total Amount</p>
            <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">${reservation.totalAmount.toFixed(2)}</p>
        </div>

        <div className="flex justify-end pt-4 border-t dark:border-neutral-700 mt-6">
          {/* FIX: Add missing className prop. */}
          <Button variant="secondary" onClick={onClose} className="">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReservationDetailsModal;
