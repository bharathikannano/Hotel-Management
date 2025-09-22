
import React, { useState, useMemo } from 'react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { EditIcon, DeleteIcon, CheckOutIcon } from '../components/icons';
import { ReservationStatus, Role } from '../types';
import { mockGuests, mockRooms, mockPayments } from '../data';
import PaymentModal from '../components/common/PaymentModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { ReservationStatusBadge } from '../components/common/StatusBadge';

const ReservationsPage = ({ reservations, onOpenModal, onDeleteReservation, currentUser }) => {
    const [rooms, setRooms] = useState(mockRooms);
    const [payments, setPayments] = useState(mockPayments);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [checkingOutReservation, setCheckingOutReservation] = useState(null);
    const [filter, setFilter] = useState('');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    
    const guestsMap = useMemo(() => new Map(mockGuests.map(g => [g.id, g])), []);
    const roomsMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);

    const filteredReservations = useMemo(() =>
        reservations.filter(r => {
            const guest = guestsMap.get(r.guestId);
            const guestName = guest ? `${guest.firstName} ${guest.lastName}` : '';
            return guestName.toLowerCase().includes(filter.toLowerCase()) || r.id.toLowerCase().includes(filter.toLowerCase());
        }), [reservations, filter, guestsMap]
    );

    const handleCheckout = (reservation) => {
        setCheckingOutReservation(reservation);
        setIsPaymentModalOpen(true);
    };

    const handleConfirmCheckout = (paymentMethod) => {
        if (checkingOutReservation) {
            // In a real app, this would involve more logic like updating room status etc.
            // which is handled in App.jsx handleSaveReservation
            const updatedReservation = { ...checkingOutReservation, status: ReservationStatus.CheckedOut };
            // Simulate saving the reservation update by passing the full object to onOpenModal
            onOpenModal(updatedReservation); 
        }
        handleClosePaymentModal();
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setCheckingOutReservation(null);
    };
    
    const handleDelete = (id) => {
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
    
    const columns = [
        { header: 'Guest', accessor: (item) => {
            const guest = guestsMap.get(item.guestId);
            return guest ? `${guest.firstName} ${guest.lastName}` : 'N/A';
        }, sortable: true },
        { header: 'Room', accessor: (item) => roomsMap.get(item.roomId)?.roomNumber || 'N/A', sortable: true },
        { header: 'Check-in', accessor: 'checkInDate', sortable: true },
        { header: 'Check-out', accessor: 'checkOutDate', sortable: true },
        { header: 'Status', accessor: (item) => <ReservationStatusBadge status={item.status} />, sortable: true, sortKey: 'status' },
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="w-full md:w-1/3">
                    {/* FIX: Add missing className prop. */}
                    <Input label="" id="search" type="text" placeholder="Search by guest name or reservation ID..." value={filter} onChange={e => setFilter(e.target.value)} className="" />
                </div>
                <Button onClick={() => onOpenModal(null)} className="w-full md:w-auto">New Reservation</Button>
            </div>
            <Table
                columns={columns}
                data={filteredReservations}
                renderRowActions={(reservation) => (
                    <div className="flex space-x-2">
                        {reservation.status === ReservationStatus.CheckedIn && (
                            <button onClick={() => handleCheckout(reservation)} className="text-success-600 hover:text-success-800" title="Check-out & Pay">
                                <CheckOutIcon className="text-xl" /> 
                            </button>
                        )}
                        <button onClick={() => onOpenModal(reservation)} className="text-primary-600 hover:text-primary-800" title="Edit">
                            <EditIcon className="text-xl" />
                        </button>
                        {currentUser.role === Role.Admin && (
                             <button onClick={() => handleDelete(reservation.id)} className="text-danger-600 hover:danger-800" title="Delete">
                                <DeleteIcon className="text-xl" />
                            </button>
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
