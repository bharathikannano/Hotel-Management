import React, { useState, useMemo } from 'react';
import Table, { Column } from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { EditIcon, DeleteIcon, CheckOutIcon } from '../components/icons';
import { Reservation, ReservationStatus, Guest, Room, RoomStatus, Payment, ReservationModalData, User, Role } from '../types';
import { mockGuests, mockRooms, mockPayments } from '../data';
import PaymentModal from '../components/common/PaymentModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { ReservationStatusBadge } from '../components/common/StatusBadge';

interface ReservationsPageProps {
    reservations: Reservation[];
    onOpenModal: (data: ReservationModalData) => void;
    onDeleteReservation: (id: string) => void;
    currentUser: User;
}


const ReservationsPage: React.FC<ReservationsPageProps> = ({ reservations, onOpenModal, onDeleteReservation, currentUser }) => {
    const [rooms, setRooms] = useState<Room[]>(mockRooms);
    const [payments, setPayments] = useState<Payment[]>(mockPayments);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [checkingOutReservation, setCheckingOutReservation] = useState<Reservation | null>(null);
    const [filter, setFilter] = useState('');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

    const guestsMap = useMemo(() => new Map(mockGuests.map(g => [g.id, g])), []);
    const roomsMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);

    const filteredReservations = useMemo(() => 
        reservations.filter(res => {
            const guest = guestsMap.get(res.guestId);
            const guestName = guest ? `${guest.firstName} ${guest.lastName}` : '';
            const room = roomsMap.get(res.roomId);
            const roomNumber = room ? room.roomNumber : '';
            const searchTerm = filter.toLowerCase();

            return res.id.toLowerCase().includes(searchTerm) ||
                   guestName.toLowerCase().includes(searchTerm) ||
                   roomNumber.toLowerCase().includes(searchTerm) ||
                   res.status.toLowerCase().includes(searchTerm);
        }), [reservations, filter, guestsMap, roomsMap]);

    const columns: Column<Reservation>[] = [
        { header: 'ID', accessor: 'id', sortable: true },
        { 
            header: 'Guest', 
            accessor: (item) => {
                const guest = guestsMap.get(item.guestId);
                return guest ? `${guest.firstName} ${guest.lastName}` : 'N/A';
            }, 
            sortable: true 
        },
        { 
            header: 'Room', 
            accessor: (item) => roomsMap.get(item.roomId)?.roomNumber || 'N/A', 
            sortable: true 
        },
        { header: 'Check-in', accessor: (item) => `${item.checkInDate}${item.checkInTime ? ` @ ${item.checkInTime}` : ''}`, sortable: true },
        { header: 'Check-out', accessor: (item) => `${item.checkOutDate}${item.checkOutTime ? ` @ ${item.checkOutTime}` : ''}`, sortable: true },
        { 
            header: 'Expected Arrival/Departure', 
            accessor: (item) => {
                if (item.status === ReservationStatus.Confirmed && item.expectedCheckInTime) {
                    return `Exp. In: ${item.expectedCheckInTime}`;
                }
                if (item.status === ReservationStatus.CheckedIn && item.expectedCheckOutTime) {
                    return `Exp. Out: ${item.expectedCheckOutTime}`;
                }
                return 'N/A';
            }, 
            sortable: false
        },
        { header: 'Status', accessor: (item) => <ReservationStatusBadge status={item.status} />, sortable: true },
        { header: 'Total', accessor: (item) => `$${item.totalAmount.toFixed(2)}`, sortable: true },
    ];

    const handleOpenModal = (reservation: Reservation | null = null) => {
        onOpenModal(reservation);
    };
    
    const handleDelete = (id: string) => {
        setReservationToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (reservationToDelete) {
            onDeleteReservation(reservationToDelete);
        }
        handleCloseDeleteConfirm();
    };

    const handleCloseDeleteConfirm = () => {
        setIsDeleteConfirmOpen(false);
        setReservationToDelete(null);
    };

    const handleOpenPaymentModal = (reservation: Reservation) => {
        setCheckingOutReservation(reservation);
        setIsPaymentModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setCheckingOutReservation(null);
    };

    const handleConfirmCheckout = (paymentMethod: Payment['method']) => {
        if (!checkingOutReservation) return;

        // This should also be lifted up if we want full consistency
        // For now, it updates a local state which will be out of sync.
        // A full solution would lift the checkout logic to App.tsx as well.

        setRooms(prev => prev.map(room => room.id === checkingOutReservation.roomId ? { ...room, status: RoomStatus.Dirty } : room));

        const newPayment: Payment = {
            id: `pay-${Date.now()}`,
            reservationId: checkingOutReservation.id,
            amount: checkingOutReservation.totalAmount,
            paymentDate: new Date().toISOString().split('T')[0],
            method: paymentMethod,
        };
        setPayments(prev => [...prev, newPayment]);

        handleClosePaymentModal();
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="w-full md:w-1/3">
                    <Input label="" id="search" type="text" placeholder="Search by ID, guest, room, or status..." value={filter} onChange={e => setFilter(e.target.value)} />
                </div>
                <Button onClick={() => handleOpenModal()} className="w-full md:w-auto">New Reservation</Button>
            </div>
            <Table
                columns={columns}
                data={filteredReservations}
                renderRowActions={(reservation) => (
                    <div className="flex space-x-2">
                        {reservation.status === ReservationStatus.CheckedIn && (
                            <button onClick={() => handleOpenPaymentModal(reservation)} className="text-green-600 hover:text-green-800" title="Check-out">
                                <CheckOutIcon className="w-5 h-5"/>
                            </button>
                        )}
                        <button onClick={() => handleOpenModal(reservation)} className="text-brand-600 hover:text-brand-800" title="Edit"><EditIcon className="w-5 h-5"/></button>
                        {currentUser.role === Role.Admin && (
                           <button onClick={() => handleDelete(reservation.id)} className="text-red-600 hover:red-800" title="Delete"><DeleteIcon className="w-5 h-5"/></button>
                        )}
                    </div>
                )}
            />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                onConfirmCheckout={handleConfirmCheckout}
                reservation={checkingOutReservation}
                guest={checkingOutReservation ? guestsMap.get(checkingOutReservation.guestId) : undefined}
                roomNumber={checkingOutReservation ? roomsMap.get(checkingOutReservation.roomId)?.roomNumber : undefined}
            />
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this reservation? This action cannot be undone."
            />
        </div>
    );
};

export default ReservationsPage;