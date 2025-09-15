import React from 'react';
import { Guest, Reservation, Room, Page } from '../types';
import Table, { Column } from '../components/common/Table';
import Button from '../components/common/Button';
import { ReservationStatusBadge } from '../components/common/StatusBadge';

interface GuestProfilePageProps {
  guest: Guest;
  reservations: Reservation[];
  roomsMap: Map<string, Room>;
  onNavigate: (page: Page) => void;
}

const GuestProfilePage: React.FC<GuestProfilePageProps> = ({ guest, reservations, roomsMap, onNavigate }) => {
  const columns: Column<Reservation>[] = [
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{guest.firstName} {guest.lastName}'s Profile</h1>
        <Button variant="secondary" onClick={() => onNavigate('Guests')}>
          &larr; Back to All Guests
        </Button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 border-b dark:border-slate-700 pb-2">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Email Address</p>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{guest.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Phone Number</p>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{guest.phone}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">Address</p>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{guest.address}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Reservation History</h2>
        {reservations.length > 0 ? (
          <Table columns={columns} data={reservations} />
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-500 dark:text-slate-400">This guest has no reservation history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestProfilePage;