import React, { useState, useMemo } from 'react';
import { Room, Reservation, RoomStatus, Guest, RoomType, ReservationStatus, ReservationModalData } from '../../types';

interface RoomCalendarViewProps {
  rooms: Room[];
  reservations: Reservation[];
  guestsMap: Map<string, Guest>;
  roomTypesMap: Map<string, RoomType>;
  onCellClick: (data: ReservationModalData) => void;
}

interface CalendarCell {
  status: RoomStatus | 'Occupied-Confirmed' | 'Occupied-CheckedIn';
  reservation?: Reservation;
}

const RoomCalendarView: React.FC<RoomCalendarViewProps> = ({ rooms, reservations, guestsMap, roomTypesMap, onCellClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltip, setTooltip] = useState<{ room: number; day: number; content: JSX.Element } | null>(null);

  const statusIndicatorColor: Record<RoomStatus, string> = {
    [RoomStatus.Available]: 'bg-green-500',
    [RoomStatus.Occupied]: 'bg-yellow-500',
    [RoomStatus.Dirty]: 'bg-red-500',
    [RoomStatus.OutOfService]: 'bg-slate-500',
  };

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
      [RoomStatus.Available]: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-900/60 cursor-pointer',
      // FIX: Added missing RoomStatus.Occupied property to handle all possible room statuses.
      [RoomStatus.Occupied]: 'bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60',
      'Occupied-Confirmed': 'bg-blue-200 hover:bg-blue-300 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 cursor-pointer',
      'Occupied-CheckedIn': 'bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-800/50 dark:hover:bg-yellow-800/70 cursor-pointer',
      [RoomStatus.Dirty]: 'bg-red-200 hover:bg-red-300 dark:bg-red-900/40 dark:hover:bg-red-900/60',
      [RoomStatus.OutOfService]: 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500',
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
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded">&lt; Prev</button>
        <h3 className="text-lg font-semibold dark:text-slate-200">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded">Next &gt;</button>
      </div>
      <div className="overflow-x-auto relative">
        <table className="min-w-full border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr>
              <th className="sticky left-0 bg-slate-100 dark:bg-slate-700 p-2 border border-slate-200 dark:border-slate-600 text-sm font-medium z-10 w-40">Room</th>
              {daysOfMonth.map(day => (
                <th key={day} className="p-2 border border-slate-200 dark:border-slate-600 text-sm font-medium w-8 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarData.map(({ room, dailyStatuses }, roomIndex) => (
              <tr key={room.id}>
                <td className="sticky left-0 bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-600 z-10 w-40">
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${statusIndicatorColor[room.status]}`}
                            title={room.status}
                        >
                           <span className="sr-only">{room.status}</span>
                        </span>
                        <div>
                            <p className="font-semibold text-sm dark:text-slate-200">{room.roomNumber}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{roomTypesMap.get(room.roomTypeId)?.name}</p>
                        </div>
                    </div>
                </td>
                {dailyStatuses.map((cell, dayIndex) => (
                  <td 
                    key={dayIndex}
                    className={`border border-slate-200 dark:border-slate-600 h-10 w-8 text-center transition-colors duration-150 ${statusColors[cell.status]}`}
                    onMouseEnter={() => handleMouseEnter(roomIndex, dayIndex, cell)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCellClick(cell, room, dayIndex)}
                  >
                    {tooltip && tooltip.room === roomIndex && tooltip.day === dayIndex && (
                        <div className="absolute z-20 p-2 bg-slate-900 text-white text-left text-sm rounded-lg shadow-lg -translate-y-full -translate-x-1/2">
                            {tooltip.content}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900"></div>
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