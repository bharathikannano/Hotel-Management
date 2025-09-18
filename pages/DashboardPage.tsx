import React from 'react';
import Card from '../components/common/Card';
import { Reservation, Room, RoomStatus, ReservationStatus, Guest, HousekeepingTask, TaskStatus, ActivityLog, Page } from '../types';
import { BedIcon, DeparturesIcon } from '../components/icons';
import ActivityLogCard from '../components/dashboard/ActivityLogCard';

interface DashboardPageProps {
  reservations: Reservation[];
  rooms: Room[];
  guests: Guest[];
  tasks: HousekeepingTask[];
  activityLog: ActivityLog[];
  onNavigate: (page: Page) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ reservations, rooms, guests, tasks, activityLog, onNavigate }) => {
  const today = new Date().toISOString().split('T')[0];
  const guestsMap = new Map(guests.map(g => [g.id, g]));

  const availableRooms = rooms.filter(r => r.status === RoomStatus.Available).length;
  const occupiedRooms = rooms.filter(r => r.status === RoomStatus.Occupied).length;
  const totalRooms = rooms.length;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  const arrivalsToday = reservations.filter(r => r.checkInDate === today && r.status === ReservationStatus.Confirmed);
  const departuresToday = reservations.filter(r => r.checkOutDate === today && r.status === ReservationStatus.CheckedIn);
  
  const inHouseGuests = reservations.filter(r => r.status === ReservationStatus.CheckedIn).length;
  
  const dirtyRooms = rooms.filter(r => r.status === RoomStatus.Dirty).length;
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.Pending).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Top Row Stats */}
      <Card title="Occupancy">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold dark:text-white">{occupancyRate.toFixed(1)}%</p>
            <p className="text-neutral-500 dark:text-neutral-400">{occupiedRooms} / {totalRooms} Rooms</p>
          </div>
          <BedIcon className="text-4xl text-primary-500" />
        </div>
      </Card>
      
      <Card title="Guests In-House">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold dark:text-white">{inHouseGuests}</p>
            <p className="text-neutral-500 dark:text-neutral-400">Total Guests</p>
          </div>
        </div>
      </Card>

      <Card title="Rooms to Clean">
         <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold dark:text-white">{dirtyRooms}</p>
            <p className="text-neutral-500 dark:text-neutral-400">Dirty Rooms</p>
          </div>
        </div>
      </Card>

      <Card title="Pending Tasks">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold dark:text-white">{pendingTasks}</p>
            <p className="text-neutral-500 dark:text-neutral-400">Housekeeping Tasks</p>
          </div>
        </div>
      </Card>
      
      {/* Bottom Row Information */}
      <div className="md:col-span-2 lg:col-span-2">
        <Card title="Upcoming Movements" className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <DeparturesIcon className="text-2xl text-success-500"/>
                        <h4 className="font-semibold text-neutral-700 dark:text-neutral-300">Arrivals ({arrivalsToday.length})</h4>
                    </div>
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {arrivalsToday.length > 0 ? arrivalsToday.map(res => {
                            const guest = guestsMap.get(res.guestId);
                            return (
                                <li key={res.id} className="text-sm p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded-md">
                                    <p className="font-medium text-neutral-800 dark:text-neutral-200">{guest ? `${guest.firstName} ${guest.lastName}` : 'N/A'}</p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Room {rooms.find(r=>r.id === res.roomId)?.roomNumber} &bull; Exp: {res.expectedCheckInTime || 'Any'}</p>
                                </li>
                            )
                        }) : <p className="text-sm text-neutral-500 dark:text-neutral-400">No arrivals today.</p>}
                    </ul>
                </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                        <DeparturesIcon className="text-2xl text-danger-500"/>
                        <h4 className="font-semibold text-neutral-700 dark:text-neutral-300">Departures ({departuresToday.length})</h4>
                    </div>
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {departuresToday.length > 0 ? departuresToday.map(res => {
                            const guest = guestsMap.get(res.guestId);
                            return (
                                <li key={res.id} className="text-sm p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded-md">
                                    <p className="font-medium text-neutral-800 dark:text-neutral-200">{guest ? `${guest.firstName} ${guest.lastName}` : 'N/A'}</p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Room {rooms.find(r=>r.id === res.roomId)?.roomNumber} &bull; Exp: {res.expectedCheckOutTime || 'Any'}</p>
                                </li>
                            )
                        }) : <p className="text-sm text-neutral-500 dark:text-neutral-400">No departures today.</p>}
                    </ul>
                </div>
            </div>
        </Card>
      </div>

       <div className="md:col-span-2 lg:col-span-2">
        <ActivityLogCard log={activityLog} onNavigate={onNavigate} />
       </div>
    </div>
  );
};

export default DashboardPage;