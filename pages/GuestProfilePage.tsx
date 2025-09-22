
import React, { useState, useMemo } from 'react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import { ReservationStatusBadge } from '../components/common/StatusBadge';
import ReservationDetailsModal from '../components/reservations/ReservationDetailsModal';
import { InfoIcon } from '../components/icons';
import Card from '../components/common/Card';
import { ReservationStatus } from '../types';

const GuestProfilePage = ({ guest, reservations, roomsMap, roomTypesMap, onNavigate, onSaveNotes }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [notes, setNotes] = useState(guest.notes || '');

  const handleOpenDetails = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedReservation(null);
    setIsDetailsModalOpen(false);
  };
  
  const handleNotesSave = () => {
      onSaveNotes(guest.id, notes);
  }

  const { activeAndUpcomingReservations, pastReservations } = useMemo(() => {
    const activeAndUpcoming = reservations
      .filter(r => r.status === ReservationStatus.Confirmed || r.status === ReservationStatus.CheckedIn)
      .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
      
    const past = reservations
      .filter(r => r.status === ReservationStatus.CheckedOut || r.status === ReservationStatus.Cancelled)
      .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());

    return { activeAndUpcomingReservations: activeAndUpcoming, pastReservations: past };
  }, [reservations]);


  const columns = [
    { 
      header: 'Room', 
      accessor: (item) => roomsMap.get(item.roomId)?.roomNumber || 'N/A', 
      sortable: true 
    },
    { header: 'Check-in', accessor: (item) => `${item.checkInDate}${item.checkInTime ? ` @ ${item.checkInTime}` : ''}`, sortable: true },
    { header: 'Check-out', accessor: (item) => `${item.checkOutDate}${item.checkOutTime ? ` @ ${item.checkOutTime}` : ''}`, sortable: true },
    { header: 'Status', accessor: (item) => <ReservationStatusBadge status={item.status} />, sortable: true },
    { header: 'Total', accessor: (item) => `$${item.totalAmount.toFixed(2)}`, sortable: true },
  ];

  const selectedRoom = selectedReservation ? roomsMap.get(selectedReservation.roomId) : undefined;
  const selectedRoomType = selectedRoom ? roomTypesMap.get(selectedRoom.roomTypeId) : undefined;

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{guest.firstName} {guest.lastName}'s Profile</h1>
          {/* FIX: Add missing className prop. */}
          <Button variant="secondary" onClick={() => onNavigate('Guests')} className="">
            &larr; Back to All Guests
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {reservations.length === 0 ? (
              <Card title="Reservations">
                  <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">This guest has no reservation history.</p>
              </Card>
            ) : (
              <>
                {activeAndUpcomingReservations.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Active & Upcoming Reservations</h2>
                    <Table
                      columns={columns}
                      data={activeAndUpcomingReservations}
                      renderRowActions={(reservation) => (
                        <button
                          onClick={() => handleOpenDetails(reservation)}
                          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                          title="View Details"
                        >
                          <InfoIcon className="text-xl" />
                        </button>
                      )}
                    />
                  </div>
                )}
                {pastReservations.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Reservation History</h2>
                    <Table
                      columns={columns}
                      data={pastReservations}
                      renderRowActions={(reservation) => (
                        <button
                          onClick={() => handleOpenDetails(reservation)}
                          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                          title="View Details"
                        >
                          <InfoIcon className="text-xl" />
                        </button>
                      )}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="space-y-6">
            <Card title="Contact Information">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Email Address</p>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium">{guest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone Number</p>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium">{guest.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Address</p>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium">{guest.address}</p>
                </div>
              </div>
            </Card>

            <Card title="Guest Notes">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400"
                    placeholder="Add notes about guest preferences, allergies, etc."
                />
                <Button onClick={handleNotesSave} className="w-full mt-2">Save Notes</Button>
            </Card>
          </div>
        </div>
      </div>
      <ReservationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        reservation={selectedReservation}
        guest={guest}
        room={selectedRoom}
        roomType={selectedRoomType}
      />
    </>
  );
};

export default GuestProfilePage;
