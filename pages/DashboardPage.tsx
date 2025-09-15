import React from 'react';
import Card from '../components/common/Card';
import { Reservation, Room, RoomStatus, ReservationStatus, Guest, HousekeepingTask, TaskStatus } from '../types';
import { BedIcon, CheckInIcon, CheckOutIcon, RevenueIcon } from '../components/icons';

interface DashboardPageProps {
  reservations: Reservation[];
  rooms: Room[];
  guests: Guest[];
  tasks: HousekeepingTask[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ reservations, rooms, guests, tasks }) => {
  const today = new Date().toISOString().split('T')[0];

  const availableRooms = rooms.filter(r => r.status === RoomStatus.Available).length;
  const occupiedRooms = rooms.filter(r => r.status === RoomStatus.Occupied).length;
  const totalRooms = rooms.length;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  const arrivalsToday = reservations.filter(r => r.checkInDate === today && r.status === ReservationStatus.Confirmed).length;
  const departuresToday = reservations.filter(r => r.checkOutDate === today && r.status === ReservationStatus.CheckedIn).length;
  
  const inHouseGuests = reservations.filter(r => r.status === ReservationStatus.CheckedIn).length;
  
  const revenueToday = reservations
    .filter(r => r.checkOutDate === today && r.status === ReservationStatus.CheckedOut)
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const dirtyRooms = rooms.filter(r => r.status === RoomStatus.Dirty).length;
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.Pending).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card title="Occupancy">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold dark:text-white">{occupancyRate.toFixed(1)}%</p>
            <p className="text-slate-500 dark:text-slate-400">{occupiedRooms} / {totalRooms} Rooms</p>
          </div>
          <BedIcon className="w-10 h-10 text-brand-500" />
        </div>
      </Card>
      
      <Card title="Today's Movements">
        <div className="flex items-center justify-between mb-4">
            <div>
                <p className="text-3xl font-bold dark:text-white">{arrivalsToday}</p>
                <p className="text-slate-500 dark:text-slate-400">Arrivals</p>
            </div>
            <CheckInIcon className="w-10 h-10 text-green-500" />
        </div>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-3xl font-bold dark:text-white">{departuresToday}</p>
                <p className="text-slate-500 dark:text-slate-400">Departures</p>
            </div>
            <CheckOutIcon className="w-10 h-10 text-red-500" />
        </div>
      </Card>

       <Card title="Guest Information">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold dark:text-white">{inHouseGuests}</p>
            <p className="text-slate-500 dark:text-slate-400">Guests In-House</p>
          </div>
        </div>
      </Card>

      <Card title="Housekeeping">
         <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold dark:text-white">{dirtyRooms}</p>
            <p className="text-slate-500 dark:text-slate-400">Dirty Rooms</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-3xl font-bold dark:text-white">{pendingTasks}</p>
            <p className="text-slate-500 dark:text-slate-400">Pending Tasks</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
