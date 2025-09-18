

import React, { useState, useMemo } from 'react';
import { Room, Reservation, RoomStatus, Guest, RoomType, ReservationStatus, ReservationModalData, HousekeepingTask, TaskStatus } from '../../types';
import { ReservationIcon, HousekeepingIcon } from '../icons';

interface RoomCalendarViewProps {
  rooms: Room[];
  reservations: Reservation[];
  tasks: HousekeepingTask[];
  guestsMap: Map<string, Guest>;
  roomTypesMap: Map<string, RoomType>;
  onCellClick: (data: ReservationModalData) => void;
}

interface CalendarCell {
  status: RoomStatus | 'Occupied-Confirmed' | 'Occupied-CheckedIn';
  reservation?: Reservation;
}

const RoomCalendarView: React.FC<RoomCalendarViewProps> = ({ rooms, reservations, tasks, guestsMap, roomTypesMap, onCellClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltip, setTooltip] = useState<{ room: number; day: number; content: JSX.Element } | null>(null);

  const statusIndicatorColor: Record<RoomStatus, string> = {
    [RoomStatus.Available]: 'bg-success-500',
    [RoomStatus.Occupied]: 'bg-accent-500',
    [RoomStatus.Dirty]: 'bg-danger-500',
    [RoomStatus.OutOfService]: 'bg-neutral-500',
  };

  const roomsWithActions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const roomsMap = new Map<string, { hasUpcomingReservation: boolean; hasPendingTask: boolean }>();

    const getRoomActions = (roomId: string) => {
        if (!roomsMap.has(roomId)) {
            roomsMap.set(roomId, { hasUpcomingReservation: false, hasPendingTask: false });
        }
        return roomsMap.get(roomId)!;
    };

    reservations.forEach(res => {
        const checkInDate = new Date(res.checkInDate);
        // Consider confirmed reservations for today or in the future
        if (res.status === ReservationStatus.Confirmed && checkInDate >= today) {
            getRoomActions(res.roomId).hasUpcomingReservation = true;
        }
    });

    tasks.forEach(task => {
        if (task.status === TaskStatus.Pending || task.status === TaskStatus.InProgress) {
            getRoomActions(task.roomId).hasPendingTask = true;
        }
    });

    return roomsMap;
}, [reservations, tasks]);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    return rooms.map(room => {
      const dailyStatuses: CalendarCell[] = dates.map(day => {
        const dayString = day.toISOString().split('T')[0];
        
        const reservation = reservations.find(res => 
          res.roomId === room.id &&
          dayString >= res.checkInDate &&
          dayString < res.checkOutDate &&
          (res.status === ReservationStatus.CheckedIn || res.status === ReservationStatus.Confirmed)
        );

        if (reservation) {
          return {
            status: reservation.status === ReservationStatus.CheckedIn ? 'Occupied-CheckedIn' : 'Occupied-Confirmed',
            reservation: reservation,
          };
        }

        return { status: room.status };
      });
      return { room, dailyStatuses };
    });
  }, [rooms, reservations, currentDate]);

  const daysOfMonth = Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const statusColors: { [key in CalendarCell['status']]: string } = {
      [RoomStatus.Available]: 'bg-success-100 hover:bg-success-200 dark:bg-success-900/40 dark:hover:bg-success-900/60 cursor-pointer',
      // FIX: Added missing RoomStatus.Occupied property to handle all possible room statuses.
      [RoomStatus.Occupied]: 'bg-accent-200 hover:bg-accent-300 dark:bg-accent-900/40 dark:hover:bg-accent-900/60',
      'Occupied-Confirmed': 'bg-info-200 hover:bg-info-300 dark:bg-info-900/40 dark:hover:bg-info-900/60 cursor-pointer',
      'Occupied-CheckedIn': 'bg-accent-300 hover:bg-accent-400 dark:bg-accent-800/50 dark:hover:bg-accent-800/70 cursor-pointer',
      [RoomStatus.Dirty]: 'bg-danger-200 hover:bg-danger-300 dark:bg-danger-900/40 dark:hover:bg-danger-900/60',
      [RoomStatus.OutOfService]: 'bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500',
  };
  
    const handleCellClick = (cell: CalendarCell, room: Room, dayIndex: number) => {
        if (cell.reservation) {
            onCellClick(cell.reservation);
        } else if (cell.status === RoomStatus.Available) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayIndex + 1);
            onCellClick({
                roomId: room.id,
                checkInDate: date.toISOString().split('T')[0],
                checkInTime: '14:00',
            });
        }
    };

  const handleMouseEnter = (roomIndex: number, dayIndex: number, cell: CalendarCell) => {
      if (cell.reservation) {
          const guest = guestsMap.get(cell.reservation.guestId);
          const content = (
              <div>
                  <p className="font-bold">{guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}</p>
                  <p className="text-xs">Status: {cell.reservation.status}</p>
                  <p className="text-xs">Check-in: {cell.reservation.checkInDate}{cell.reservation.checkInTime ? ` @ ${cell.reservation.checkInTime}` : ''}</p>
                  <p className="text-xs">Check-out: {cell.reservation.checkOutDate}{cell.reservation.checkOutTime ? ` @ ${cell.reservation.checkOutTime}` : ''}</p>
              </div>
          );
          setTooltip({ room: roomIndex, day: dayIndex, content });
      }
  };

  const handleMouseLeave = () => {
      setTooltip(null);
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl shadow-solid-light dark:shadow-solid-dark">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg">&lt; Prev</button>
        <h3 className="text-lg font-semibold dark:text-neutral-200">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg">Next &gt;</button>
      </div>
      <div className="overflow-x-auto relative">
        <table className="min-w-full border-collapse border border-neutral-200 dark:border-neutral-700">
          <thead>
            <tr>
              <th className="sticky left-0 bg-neutral-100 dark:bg-neutral-700 p-2 border border-neutral-200 dark:border-neutral-600 text-sm font-medium z-10 w-40">Room</th>
              {daysOfMonth.map(day => (
                <th key={day} className="p-2 border border-neutral-200 dark:border-neutral-600 text-sm font-medium w-8 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarData.map(({ room, dailyStatuses }, roomIndex) => (
              <tr key={room.id}>
                <td className="sticky left-0 bg-neutral-50 dark:bg-neutral-800 p-2 border border-neutral-200 dark:border-neutral-600 z-10 w-40">
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${statusIndicatorColor[room.status]}`}
                            title={room.status}
                        >
                           <span className="sr-only">{room.status}</span>
                        </span>
                        <div>
                            <p className="font-semibold text-sm dark:text-neutral-200">{room.roomNumber}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{roomTypesMap.get(room.roomTypeId)?.name}</p>
                        </div>
                        {roomsWithActions.has(room.id) && (
                            <div className="ml-auto flex items-center gap-1.5">
                                {roomsWithActions.get(room.id)?.hasUpcomingReservation && 
                                    // FIX: Wrapped icon in a span to apply the title attribute, resolving a prop-type error.
                                    <span title="Upcoming Reservation">
                                        <ReservationIcon className="text-base text-info-500" />
                                    </span>}
                                {roomsWithActions.get(room.id)?.hasPendingTask && 
                                    // FIX: Wrapped icon in a span to apply the title attribute, resolving a prop-type error.
                                    <span title="Pending Task">
                                        <HousekeepingIcon className="text-base text-accent-600" />
                                    </span>}
                            </div>
                        )}
                    </div>
                </td>
                {dailyStatuses.map((cell, dayIndex) => (
                  <td 
                    key={dayIndex}
                    className={`border border-neutral-200 dark:border-neutral-600 h-10 w-8 text-center transition-colors duration-150 ${statusColors[cell.status]}`}
                    onMouseEnter={() => handleMouseEnter(roomIndex, dayIndex, cell)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCellClick(cell, room, dayIndex)}
                  >
                    {tooltip && tooltip.room === roomIndex && tooltip.day === dayIndex && (
                        <div className="absolute z-20 p-2 bg-neutral-900 text-white text-left text-sm rounded-lg shadow-lg -translate-y-full -translate-x-1/2">
                            {tooltip.content}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-neutral-900"></div>
                        </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomCalendarView;