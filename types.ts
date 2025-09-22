export const Role = Object.freeze({
  Admin: 'Admin',
  Manager: 'Manager',
  FrontDesk: 'Front Desk',
  Housekeeping: 'Housekeeping',
  Guest: 'Guest',
});

export const RoomTypeEnum = Object.freeze({
    Single: 'Single',
    Double: 'Double',
    Suite: 'Suite',
    Deluxe: 'Deluxe',
    Family: 'Family',
});

export const RoomStatus = Object.freeze({
    Available: 'Available',
    Occupied: 'Occupied',
    Dirty: 'Dirty',
    OutOfService: 'Out of Service',
});

export const ReservationStatus = Object.freeze({
    Confirmed: 'Confirmed',
    CheckedIn: 'Checked-In',
    CheckedOut: 'Checked-Out',
    Cancelled: 'Cancelled',
});

export const TaskStatus = Object.freeze({
    Pending: 'Pending',
    InProgress: 'In Progress',
    Done: 'Done',
});

export const TaskPriority = Object.freeze({
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
});
