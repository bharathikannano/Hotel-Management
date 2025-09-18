
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import { Room, RoomType, Reservation, Guest, ReservationStatus, RoomStatus } from '../../types';
import { RoomStatusBadge, ReservationStatusBadge } from '../common/StatusBadge';
import ConfirmationModal from '../common/ConfirmationModal';
import { WifiIcon, TvIcon, AcIcon, MiniBarIcon, JacuzziIcon, BalconyIcon, BedroomsIcon, CloseIcon } from '../icons';

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  roomType: RoomType | undefined;
  reservations: Reservation[];
  guestsMap: Map<string, Guest>;
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
  onSaveRoomType: (roomTypeId: string, updatedData: { amenities: string[]; basePrice: number; }) => void;
}

const amenityIcons: { [key: string]: React.FC<{ className?: string }> } = {
  'Wifi': WifiIcon,
  'TV': TvIcon,
  'AC': AcIcon,
  'Mini-bar': MiniBarIcon,
  'Jacuzzi': JacuzziIcon,
  'Balcony': BalconyIcon,
  '2 Bedrooms': BedroomsIcon,
};

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  isOpen,
  onClose,
  room,
  roomType,
  reservations,
  guestsMap,
  onUpdateRoomStatus,
  onSaveRoomType,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<RoomStatus | null>(null);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [currentAmenities, setCurrentAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [currentBasePrice, setCurrentBasePrice] = useState('');

  useEffect(() => {
    if (roomType) {
        setCurrentAmenities(roomType.amenities);
        setCurrentBasePrice(String(roomType.basePrice));
    }
    // Reset editing state when modal reopens for a new room
    setIsEditing(false);
    setNewAmenity('');
  }, [roomType, isOpen]);

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
  
  const handleRemoveAmenity = (amenityToRemove: string) => {
    setCurrentAmenities(prev => prev.filter(a => a !== amenityToRemove));
  };

  const handleAddAmenity = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedAmenity = newAmenity.trim();
      if (trimmedAmenity && !currentAmenities.find(a => a.toLowerCase() === trimmedAmenity.toLowerCase())) {
          setCurrentAmenities(prev => [...prev, trimmedAmenity]);
          setNewAmenity('');
      }
  };
  
  const handleSaveChanges = () => {
    if (!roomType) return;
    onSaveRoomType(roomType.id, {
        amenities: currentAmenities,
        basePrice: parseFloat(currentBasePrice) || 0,
    });
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
      if (roomType) {
          setCurrentAmenities(roomType.amenities);
          setCurrentBasePrice(String(roomType.basePrice));
      }
      setIsEditing(false);
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Room Number</h4>
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{room.roomNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Room Type</h4>
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{roomType.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Capacity</h4>
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{roomType.capacity} Guests</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Current Status</h4>
              {room.status === RoomStatus.Occupied ? (
                <>
                  <RoomStatusBadge status={room.status} />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Managed by reservations.</p>
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
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300">Room Type Details</h4>
                {!isEditing && (
                    <Button variant="secondary" onClick={() => setIsEditing(true)} className="!py-1 !px-3 !text-xs">
                        Edit
                    </Button>
                )}
            </div>
            <div className="space-y-4 p-4 border dark:border-neutral-700 rounded-lg">
                <div>
                    <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Base Price</label>
                    {isEditing ? (
                        <Input 
                            id="basePrice" 
                            label="" 
                            type="number" 
                            value={currentBasePrice} 
                            onChange={(e) => setCurrentBasePrice(e.target.value)}
                            className="mt-1"
                        />
                    ) : (
                        <p className="text-neutral-800 dark:text-neutral-200 font-medium">${parseFloat(currentBasePrice).toFixed(2)}</p>
                    )}
                </div>
                <div>
                     <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Amenities</label>
                    <div className="flex flex-wrap gap-3 mt-1">
                        {currentAmenities.map((amenity) => {
                            const Icon = amenityIcons[amenity];
                            return (
                            <div key={amenity} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-neutral-200 dark:bg-neutral-700/50 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg">
                                {Icon && <Icon className="text-xl text-primary-600 dark:text-primary-400" />}
                                <span>{amenity}</span>
                                {isEditing && (
                                    <button onClick={() => handleRemoveAmenity(amenity)} className="ml-1 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 p-0.5 transition-colors" aria-label={`Remove ${amenity}`}>
                                        <CloseIcon className="text-xs" />
                                    </button>
                                )}
                            </div>
                            );
                        })}
                    </div>
                    {isEditing && (
                        <form onSubmit={handleAddAmenity} className="mt-4 flex items-center gap-2">
                            <Input
                                label=""
                                id="new-amenity"
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                                placeholder="Add new amenity"
                                className="flex-grow !py-1.5"
                            />
                            <Button type="submit" className="!py-1.5">Add</Button>
                        </form>
                    )}
                </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 border-t dark:border-neutral-700 pt-4 mt-4">Upcoming Reservations</h4>
            {upcomingReservations.length > 0 ? (
              <ul className="space-y-3 mt-2 max-h-48 overflow-y-auto">
                {upcomingReservations.map((res) => {
                  const guest = guestsMap.get(res.guestId);
                  return (
                    <li key={res.id} className="p-3 bg-neutral-100 dark:bg-neutral-700/50 rounded-md border border-neutral-200 dark:border-neutral-600">
                      <div className="flex justify-between items-center">
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{guest ? `${guest.firstName} ${guest.lastName}` : 'N/A'}</p>
                          <ReservationStatusBadge status={res.status} />
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Check-in: {res.checkInDate}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Check-out: {res.checkOutDate}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400 mt-2">No upcoming reservations for this room.</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-neutral-700 mt-6">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </>
            ) : (
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            )}
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