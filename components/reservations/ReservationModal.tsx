
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { ReservationStatus, RoomStatus } from '../../types';

const isExistingReservation = (data: any): data is { id: string } => {
    return data !== null && 'id' in data;
};

const isNewReservationData = (data: any): data is { roomId: string } => {
    return data !== null && 'roomId' in data && !('id' in data);
}

// FIX: Define a type for the reservation form data to avoid type inference issues.
type ReservationFormData = {
    guestId: string;
    roomId: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    status: (typeof ReservationStatus)[keyof typeof ReservationStatus];
    totalAmount: number;
    expectedCheckInTime: string;
    expectedCheckOutTime: string;
};

const ReservationModal = ({ isOpen, onClose, onSave, initialData, guests, rooms }) => {
    
    // FIX: Use the explicit form data type for the state.
    const [formData, setFormData] = useState<ReservationFormData>({
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const reservationData = {
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
                {/* FIX: Add missing id and className props. */}
                <Select label="Guest" id="guestId" name="guestId" value={formData.guestId} onChange={handleChange} required className="">
                    <option value="">Select Guest</option>
                    {guests.map(g => <option key={g.id} value={g.id}>{g.firstName} {g.lastName}</option>)}
                </Select>
                {/* FIX: Add missing id and className props. */}
                <Select label="Room" id="roomId" name="roomId" value={formData.roomId} onChange={handleChange} required className="">
                    <option value="">Select Room</option>
                    {rooms
                        .filter(r => r.status === RoomStatus.Available || r.id === (isExistingReservation(initialData) ? initialData.roomId : formData.roomId))
                        .map(r => <option key={r.id} value={r.id}>{r.roomNumber}</option>)
                    }
                </Select>
                <div className="grid grid-cols-2 gap-4">
                    {/* FIX: Add missing className prop. */}
                    <Input id="checkInDate" label="Check-in Date" name="checkInDate" type="date" value={formData.checkInDate} onChange={handleChange} required className="" />
                    {/* FIX: Add missing className prop. */}
                    <Input id="checkInTime" label="Check-in Time" name="checkInTime" type="time" value={formData.checkInTime} onChange={handleChange} className="" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* FIX: Add missing className prop. */}
                    <Input id="checkOutDate" label="Check-out Date" name="checkOutDate" type="date" value={formData.checkOutDate} onChange={handleChange} required className="" />
                    {/* FIX: Add missing className prop. */}
                    <Input id="checkOutTime" label="Check-out Time" name="checkOutTime" type="time" value={formData.checkOutTime} onChange={handleChange} className="" />
                </div>
                {/* FIX: Add missing className prop. */}
                <Input id="totalAmount" label="Total Amount" name="totalAmount" type="number" value={formData.totalAmount} onChange={handleChange} required className="" />
                {/* FIX: Add missing id and className props. */}
                <Select label="Status" id="status" name="status" value={formData.status} onChange={handleChange} required className="">
                    {Object.values(ReservationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>

                {formData.status === ReservationStatus.Confirmed && (
                    // FIX: Add missing className prop.
                    <Input id="expectedCheckInTime" label="Expected Check-in Time" name="expectedCheckInTime" type="time" value={formData.expectedCheckInTime} onChange={handleChange} className="" />
                )}
                {formData.status === ReservationStatus.CheckedIn && (
                    // FIX: Add missing className prop.
                    <Input id="expectedCheckOutTime" label="Expected Check-out Time" name="expectedCheckOutTime" type="time" value={formData.expectedCheckOutTime} onChange={handleChange} className="" />
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    {/* FIX: Add missing className prop. */}
                    <Button type="button" variant="secondary" onClick={onClose} className="">Cancel</Button>
                    {/* FIX: Add missing className prop. */}
                    <Button type="submit" className="">Save Reservation</Button>
                </div>
            </form>
        </Modal>
    )
};

export default ReservationModal;
