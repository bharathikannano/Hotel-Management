import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import { Room, RoomType, Reservation, Guest, ReservationStatus, RoomStatus } from '../../types';
import { RoomStatusBadge } from '../common/StatusBadge';
import ConfirmationModal from '../common/ConfirmationModal';

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  roomType: RoomType | undefined;
  reservations: Reservation[];
  guestsMap: Map<string, Guest>;
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  isOpen,
  onClose,
  room,
  roomType,
  reservations,
  guestsMap,
  onUpdateRoomStatus,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<RoomStatus | null>(null);
  
  if (!isOpen || !room || !roomType) return null;

  const handleStatusChange = (newStatus: RoomStatus) => {
    if (newStatus !== room.status) {
        setPendingStatus(newStatus);
        setIsConfirmOpen(true);
    }
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus && room) {
        onUpdateRoomStatus(room.id, pendingStatus);
    }
    handleCloseConfirm();
    onClose(); // Also close the details modal after status change
  };

  const handleCloseConfirm = () => {
      setIsConfirmOpen(false);
      setPendingStatus(null);
  };

  const upcomingReservations = reservations.filter(
    (r) =>
      r.roomId === room.id &&
      (r.status === ReservationStatus.Confirmed || r.status === ReservationStatus.CheckedIn)
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Room Details: ${room.roomNumber}`}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Room Number</h4>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{room.roomNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Room Type</h4>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{roomType.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Status</h4>
              {room.status === RoomStatus.Occupied ? (
                <>
                  <RoomStatusBadge status={room.status} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Managed by reservations.</p>
                </>
              ) : (
                <Select
                  label=""
                  id="roomStatus"
                  value={room.status}
                  onChange={(e) => handleStatusChange(e.target.value as RoomStatus)}
                  className="!py-1.5"
                >
                  {Object.values(RoomStatus)
                    .filter(s => s !== RoomStatus.Occupied) // Can't manually set to occupied
                    .map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))
                  }
                </Select>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {roomType.amenities.map((amenity) => (
                <span key={amenity} className="px-3 py-1 bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 text-xs font-semibold rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-t dark:border-slate-700 pt-4 mt-4">Upcoming Reservations</h4>
            {upcomingReservations.length > 0 ? (
              <ul className="space-y-3 mt-2 max-h-48 overflow-y-auto">
                {upcomingReservations.map((res) => {
                  const guest = guestsMap.get(res.guestId);
                  return (
                    <li key={res.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md border border-slate-200 dark:border-slate-600">
                      <div className="flex justify-between items-center">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{guest ? `${guest.firstName} ${guest.lastName}` : 'N/A'}</p>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{res.status}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Check-in: {res.checkInDate}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Check-out: {res.checkOutDate}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 mt-2">No upcoming reservations for this room.</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t dark:border-slate-700 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmStatusChange}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of Room ${room?.roomNumber} from "${room?.status}" to "${pendingStatus}"?`}
        confirmButtonText="Confirm"
        confirmButtonVariant="primary"
      />
    </>
  );
};

export default RoomDetailsModal;