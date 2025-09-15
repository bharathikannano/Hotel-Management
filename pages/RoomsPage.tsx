import React, { useState, useMemo } from 'react';
import Table, { Column } from '../components/common/Table';
import { Room, RoomStatus, RoomType, Reservation, Guest, ReservationModalData } from '../types';
import { RoomStatusBadge } from '../components/common/StatusBadge';
import RoomDetailsModal from '../components/rooms/RoomDetailsModal';
import RoomCalendarView from '../components/rooms/RoomCalendarView';
import Button from '../components/common/Button';
import { CalendarIcon, ListIcon } from '../components/icons';

interface RoomsPageProps {
  rooms: Room[];
  roomTypes: RoomType[];
  reservations: Reservation[];
  guests: Guest[];
  onOpenModal: (data: ReservationModalData) => void;
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
}

const statusOrder: Record<RoomStatus, number> = {
    [RoomStatus.Available]: 1,
    [RoomStatus.Occupied]: 2,
    [RoomStatus.Dirty]: 3,
    [RoomStatus.OutOfService]: 4,
};

const RoomsPage: React.FC<RoomsPageProps> = ({ rooms, roomTypes, reservations, guests, onOpenModal, onUpdateRoomStatus }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    
    const roomTypesMap = useMemo(() => new Map(roomTypes.map(rt => [rt.id, rt])), [roomTypes]);
    const guestsMap = useMemo(() => new Map(guests.map(g => [g.id, g])), [guests]);

    const columns: Column<Room>[] = [
        { header: 'Room No.', accessor: 'roomNumber', sortable: true },
        { 
            header: 'Type', 
            accessor: (item) => roomTypesMap.get(item.roomTypeId)?.name || 'N/A', 
            sortable: true,
            sortKey: 'roomTypeId'
        },
        { 
            header: 'Status', 
            accessor: (item) => <RoomStatusBadge status={item.status} />, 
            sortable: true,
            sortKey: 'status',
            sortFn: (a, b) => statusOrder[a.status] - statusOrder[b.status],
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Room Management</h2>
                <div className="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md flex items-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>
                       <ListIcon className="w-5 h-5 text-slate-600 dark:text-slate-300"/>
                    </button>
                    <button onClick={() => setViewMode('calendar')} className={`p-1.5 rounded-md flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>
                       <CalendarIcon className="w-5 h-5 text-slate-600 dark:text-slate-300"/>
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <Table
                    columns={columns}
                    data={rooms}
                    renderRowActions={(room) => (
                        <Button variant="secondary" onClick={() => setSelectedRoom(room)}>
                            Details
                        </Button>
                    )}
                />
            ) : (
                <RoomCalendarView rooms={rooms} reservations={reservations} guestsMap={guestsMap} roomTypesMap={roomTypesMap} onCellClick={onOpenModal} />
            )}

            <RoomDetailsModal
                isOpen={!!selectedRoom}
                onClose={() => setSelectedRoom(null)}
                room={selectedRoom}
                roomType={selectedRoom ? roomTypesMap.get(selectedRoom.roomTypeId) : undefined}
                reservations={reservations}
                guestsMap={guestsMap}
                onUpdateRoomStatus={onUpdateRoomStatus}
            />
        </div>
    );
};

export default RoomsPage;