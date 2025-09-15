import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { Reservation, ReservationStatus, Guest, Room, RoomStatus, ReservationModalData, NewReservationData } from '../../types';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Reservation, 'id'>, id?: string) => void;
    initialData: ReservationModalData;
    guests: Guest[];
    rooms: Room[];
}

const isExistingReservation = (data: ReservationModalData): data is Reservation => {
    return data !== null && 'id' in data;
};

const isNewReservationData = (data: ReservationModalData): data is NewReservationData => {
    return data !== null && 'roomId' in data && !('id' in data);
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onSave, initialData, guests, rooms }) => {
    
    const [formData, setFormData] = useState({
        guestId: '',
        roomId: '',
        checkInDate: '',
        checkInTime: '14:00',
        checkOutDate: '',
        checkOutTime: '11:00',
        status: ReservationStatus.Confirmed,
        totalAmount: 0,
        expectedCheckInTime: '',
        expectedCheckOutTime: '',
    });

    useEffect(() => {
        if (initialData) {
            if (isExistingReservation(initialData)) {
                setFormData({
                    guestId: initialData.guestId,
                    roomId: initialData.roomId,
                    checkInDate: initialData.checkInDate,
                    checkInTime: initialData.checkInTime || '14:00',
                    checkOutDate: initialData.checkOutDate,
                    checkOutTime: initialData.checkOutTime || '11:00',
                    status: initialData.status,
                    totalAmount: initialData.totalAmount,
                    expectedCheckInTime: initialData.expectedCheckInTime || '',
                    expectedCheckOutTime: initialData.expectedCheckOutTime || '',
                });
            } else if (isNewReservationData(initialData)) {
                 setFormData({
                    guestId: '',
                    roomId: initialData.roomId,
                    checkInDate: initialData.checkInDate,
                    checkInTime: initialData.checkInTime || '14:00',
                    checkOutDate: '',
                    checkOutTime: '11:00',
                    status: ReservationStatus.Confirmed,
                    totalAmount: 0,
                    expectedCheckInTime: '',
                    expectedCheckOutTime: '',
                });
            }
        } else {
            // Reset for new reservation from scratch
            setFormData({
                guestId: '',
                roomId: '',
                checkInDate: '',
                checkInTime: '14:00',
                checkOutDate: '',
                checkOutTime: '11:00',
                status: ReservationStatus.Confirmed,
                totalAmount: 0,
                expectedCheckInTime: '',
                expectedCheckOutTime: '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reservationData: Omit<Reservation, 'id'> = {
            ...formData,
            expectedCheckInTime: formData.status === ReservationStatus.Confirmed ? formData.expectedCheckInTime : undefined,
            expectedCheckOutTime: formData.status === ReservationStatus.CheckedIn ? formData.expectedCheckOutTime : undefined,
        };

        if (isExistingReservation(initialData)) {
            onSave(reservationData, initialData.id);
        } else {
            onSave(reservationData);
        }
    }
    
    const modalTitle = isExistingReservation(initialData) ? 'Edit Reservation' : 'New Reservation';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="Guest" name="guestId" value={formData.guestId} onChange={handleChange} required>
                    <option value="">Select Guest</option>
                    {guests.map(g => <option key={g.id} value={g.id}>{g.firstName} {g.lastName}</option>)}
                </Select>
                <Select label="Room" name="roomId" value={formData.roomId} onChange={handleChange} required>
                    <option value="">Select Room</option>
                    {rooms
                        .filter(r => r.status === RoomStatus.Available || r.id === (isExistingReservation(initialData) ? initialData.roomId : formData.roomId))
                        .map(r => <option key={r.id} value={r.id}>{r.roomNumber}</option>)
                    }
                </Select>
                <div className="grid grid-cols-2 gap-4">
                    {/* FIX: Added id prop to satisfy InputProps requirement. */}
                    <Input id="checkInDate" label="Check-in Date" name="checkInDate" type="date" value={formData.checkInDate} onChange={handleChange} required />
                    {/* FIX: Added id prop to satisfy InputProps requirement. */}
                    <Input id="checkInTime" label="Check-in Time" name="checkInTime" type="time" value={formData.checkInTime} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* FIX: Added id prop to satisfy InputProps requirement. */}
                    <Input id="checkOutDate" label="Check-out Date" name="checkOutDate" type="date" value={formData.checkOutDate} onChange={handleChange} required />
                    {/* FIX: Added id prop to satisfy InputProps requirement. */}
                    <Input id="checkOutTime" label="Check-out Time" name="checkOutTime" type="time" value={formData.checkOutTime} onChange={handleChange} />
                </div>
                {/* FIX: Added id prop to satisfy InputProps requirement. */}
                <Input id="totalAmount" label="Total Amount" name="totalAmount" type="number" value={formData.totalAmount} onChange={handleChange} required />
                <Select label="Status" name="status" value={formData.status} onChange={handleChange} required>
                    {Object.values(ReservationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>

                {formData.status === ReservationStatus.Confirmed && (
                    /* FIX: Added id prop to satisfy InputProps requirement. */
                    <Input id="expectedCheckInTime" label="Expected Check-in Time" name="expectedCheckInTime" type="time" value={formData.expectedCheckInTime} onChange={handleChange} />
                )}
                {formData.status === ReservationStatus.CheckedIn && (
                    /* FIX: Added id prop to satisfy InputProps requirement. */
                    <Input id="expectedCheckOutTime" label="Expected Check-out Time" name="expectedCheckOutTime" type="time" value={formData.expectedCheckOutTime} onChange={handleChange} />
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Reservation</Button>
                </div>
            </form>
        </Modal>
    )
};

export default ReservationModal;