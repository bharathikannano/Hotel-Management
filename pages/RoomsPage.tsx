

import React, { useState, useMemo } from 'react';
import Table, { Column } from '../components/common/Table';
import { Room, RoomStatus, RoomType, Reservation, Guest, ReservationModalData, HousekeepingTask, RoomTypeEnum } from '../types';
import { RoomStatusBadge } from '../components/common/StatusBadge';
import RoomDetailsModal from '../components/rooms/RoomDetailsModal';
import RoomCalendarView from '../components/rooms/RoomCalendarView';
import Select from '../components/common/Select';
import { CalendarIcon, ListIcon } from '../components/icons';

interface RoomsPageProps {
  rooms: Room[];
  roomTypes: RoomType[];
  reservations: Reservation[];
  guests: Guest[];
  tasks: HousekeepingTask[];
  onOpenModal: (data: ReservationModalData) => void;
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
  onSaveRoomType: (roomTypeId: string, updatedData: Partial<Omit<RoomType, 'id'>>) => void;
}

const statusOrder: Record<RoomStatus, number> = {
    [RoomStatus.Available]: 1,
    [RoomStatus.Occupied]: 2,
    [RoomStatus.Dirty]: 3,
    [RoomStatus.OutOfService]: 4,
};

const RoomsPage: React.FC<RoomsPageProps> = ({ rooms, roomTypes, reservations, guests, tasks, onOpenModal, onUpdateRoomStatus, onSaveRoomType }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [statusFilter, setStatusFilter] = useState<RoomStatus | ''>('');
    const [typeFilter, setTypeFilter] = useState<string | ''>('');
    
    const roomTypesMap = useMemo(() => new Map(roomTypes.map(rt => [rt.id, rt])), [roomTypes]);
    const guestsMap = useMemo(() => new Map(guests.map(g => [g.id, g])), [guests]);

    const filteredRooms = useMemo(() => {
      return rooms.filter(room => {
        const statusMatch = !statusFilter || room.status === statusFilter;
        const typeMatch = !typeFilter || room.roomTypeId === typeFilter;
        return statusMatch && typeMatch;
      });
    }, [rooms, statusFilter, typeFilter]);

    const columns: Column<Room>[] = [
        { 
            header: 'Room No.', 
            accessor: (item) => {
                const roomType = roomTypesMap.get(item.roomTypeId);
                return (
                    <div>
                        <div className="font-medium text-neutral-800 dark:text-neutral-200">{item.roomNumber}</div>
                        {roomType && <div className="text-xs text-neutral-500 dark:text-neutral-400">Capacity: {roomType.capacity}</div>}
                    </div>
                );
            }, 
            sortable: true,
            sortKey: 'roomNumber'
        },
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">Room Management</h2>
                 <div className="flex items-center gap-4">
                    <div className="flex p-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md flex items-center gap-2 ${viewMode === 'list' ? 'bg-neutral-50 dark:bg-neutral-800 shadow' : ''}`}>
                           <ListIcon className="text-xl text-neutral-600 dark:text-neutral-300"/>
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={`p-1.5 rounded-md flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-neutral-50 dark:bg-neutral-800 shadow' : ''}`}>
                           <CalendarIcon className="text-xl text-neutral-600 dark:text-neutral-300"/>
                        </button>
                    </div>
                 </div>
            </div>

            {viewMode === 'list' && (
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-700">
                <Select id="statusFilter" label="Filter by Status" value={statusFilter} onChange={e => setStatusFilter(e.target.value as RoomStatus | '')}>
                  <option value="">All Statuses</option>
                  {Object.values(RoomStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select id="typeFilter" label="Filter by Type" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="">All Types</option>
                  {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                </Select>
              </div>
            )}

            {viewMode === 'list' ? (
                <Table
                    columns={columns}
                    data={filteredRooms}
                    renderRowActions={(room) => (
                        <button className="px-3 py-1 text-sm font-medium rounded-md bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600" onClick={() => setSelectedRoom(room)}>
                            Details
                        </button>
                    )}
                />
            ) : (
                <RoomCalendarView rooms={rooms} reservations={reservations} tasks={tasks} guestsMap={guestsMap} roomTypesMap={roomTypesMap} onCellClick={onOpenModal} />
            )}

            <RoomDetailsModal
                isOpen={!!selectedRoom}
                onClose={() => setSelectedRoom(null)}
                room={selectedRoom}
                roomType={selectedRoom ? roomTypesMap.get(selectedRoom.roomTypeId) : undefined}
                reservations={reservations}
                guestsMap={guestsMap}
                onUpdateRoomStatus={onUpdateRoomStatus}
                onSaveRoomType={onSaveRoomType}
            />
        </div>
    );
};

export default RoomsPage;