import {
  Hotel, RoomType, Room, Guest, Reservation, Payment, HousekeepingTask,
  OccupancyReport, RevenueReport, User, Role, RoomTypeEnum, RoomStatus,
  ReservationStatus, TaskStatus, TaskPriority, ActivityLog
} from '../types';

// USERS
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Admin', username: 'admin', role: Role.Admin, avatarUrl: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user-2', name: 'John Manager', username: 'manager', role: Role.Manager, avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user-3', name: 'Jane Desk', username: 'frontdesk', role: Role.FrontDesk, avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'user-4', name: 'Peter Clean', username: 'housekeeping', role: Role.Housekeeping, avatarUrl: 'https://picsum.photos/seed/user4/100/100' },
  { id: 'user-5', name: 'Alice Guest', username: 'guest', role: Role.Guest, avatarUrl: 'https://picsum.photos/seed/user5/100/100' },
];

// HOTELS
export const mockHotels: Hotel[] = [
  { id: 'hotel-1', name: 'Zenith Grand', address: '123 Luxury Ave', city: 'Metropolis', country: 'USA' }
];

// ROOMS
export const mockRoomTypes: RoomType[] = [
  { id: 'rt-1', name: RoomTypeEnum.Single, basePrice: 150, capacity: 2, amenities: ['Wifi', 'TV', 'AC'] },
  { id: 'rt-2', name: RoomTypeEnum.Double, basePrice: 220, capacity: 2, amenities: ['Wifi', 'TV', 'AC', 'Mini-bar'] },
  { id: 'rt-3', name: RoomTypeEnum.Suite, basePrice: 400, capacity: 4, amenities: ['Wifi', 'TV', 'AC', 'Mini-bar', 'Jacuzzi'] },
  { id: 'rt-4', name: RoomTypeEnum.Deluxe, basePrice: 320, capacity: 2, amenities: ['Wifi', 'TV', 'AC', 'Mini-bar', 'Balcony'] },
  { id: 'rt-5', name: RoomTypeEnum.Family, basePrice: 350, capacity: 5, amenities: ['Wifi', 'TV', 'AC', 'Mini-bar', '2 Bedrooms'] },
];

export const mockRooms: Room[] = [
  ...Array.from({ length: 10 }, (_, i) => ({ id: `room-${101 + i}`, roomNumber: `${101 + i}`, roomTypeId: 'rt-1', status: RoomStatus.Available })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `room-${201 + i}`, roomNumber: `${201 + i}`, roomTypeId: 'rt-2', status: RoomStatus.Available })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `room-${301 + i}`, roomNumber: `${301 + i}`, roomTypeId: 'rt-3', status: RoomStatus.Available })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `room-${401 + i}`, roomNumber: `${401 + i}`, roomTypeId: 'rt-4', status: RoomStatus.Available })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `room-${501 + i}`, roomNumber: `${501 + i}`, roomTypeId: 'rt-5', status: RoomStatus.Available })),
];
// Set some initial states
mockRooms[2].status = RoomStatus.Occupied;
mockRooms[3].status = RoomStatus.Dirty;
mockRooms[11].status = RoomStatus.Occupied;
mockRooms[13].status = RoomStatus.OutOfService;
mockRooms[21].status = RoomStatus.Occupied;


// GUESTS
export const mockGuests: Guest[] = [
  { id: 'guest-1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '555-1234', address: '1 Main St, Anytown', notes: 'Prefers a room on a high floor, away from the elevator. Allergic to peanuts.' },
  { id: 'guest-2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '555-5678', address: '2 Market St, Anytown' },
  { id: 'guest-3', firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@example.com', phone: '555-8765', address: '3 Oak Ave, Anytown', notes: 'VIP Guest. Requested a bottle of champagne on arrival for his next visit.' },
];

// RESERVATIONS
export const mockReservations: Reservation[] = [
  { id: 'res-1', guestId: 'guest-1', roomId: 'room-202', checkInDate: '2024-08-10', checkInTime: '14:00', checkOutDate: '2024-08-15', checkOutTime: '11:00', status: ReservationStatus.CheckedIn, totalAmount: 1100, expectedCheckOutTime: '11:30' },
  { id: 'res-2', guestId: 'guest-2', roomId: 'room-301', checkInDate: '2024-08-12', checkInTime: '15:00', checkOutDate: '2024-08-14', checkOutTime: '11:00', status: ReservationStatus.Confirmed, totalAmount: 800, expectedCheckInTime: '16:00' },
  { id: 'res-3', guestId: 'guest-3', roomId: 'room-103', checkInDate: '2024-07-25', checkInTime: '16:30', checkOutDate: '2024-07-28', checkOutTime: '10:00', status: ReservationStatus.CheckedOut, totalAmount: 450 },
  { id: 'res-4', guestId: 'guest-1', roomId: 'room-401', checkInDate: '2024-09-01', checkInTime: '14:00', checkOutDate: '2024-09-05', checkOutTime: '11:00', status: ReservationStatus.Confirmed, totalAmount: 1280, expectedCheckInTime: '14:00' },
  { id: 'res-5', guestId: 'guest-2', roomId: 'room-104', checkInDate: '2024-08-01', checkInTime: '18:00', checkOutDate: '2024-08-03', checkOutTime: '11:00', status: ReservationStatus.Cancelled, totalAmount: 300 },
];

// PAYMENTS
export const mockPayments: Payment[] = [
  { id: 'pay-1', reservationId: 'res-1', amount: 550, paymentDate: '2024-08-10', method: 'Credit Card' },
  { id: 'pay-2', reservationId: 'res-2', amount: 800, paymentDate: '2024-08-01', method: 'Bank Transfer' },
  { id: 'pay-3', reservationId: 'res-3', amount: 450, paymentDate: '2024-07-28', method: 'Cash' },
  { id: 'pay-4', reservationId: 'res-4', amount: 1280, paymentDate: '2024-08-05', method: 'Credit Card' },
];

// HOUSEKEEPING
export const mockHousekeepingTasks: HousekeepingTask[] = [
  { id: 'task-1', roomId: 'room-104', assignedTo: 'user-4', task: 'Full Cleaning', status: TaskStatus.Done, date: '2024-08-09', priority: TaskPriority.Medium, notes: 'Guest reported a slow draining sink. Maintenance has been notified.' },
  { id: 'task-2', roomId: 'room-202', assignedTo: 'user-4', task: 'Towel Change', status: TaskStatus.InProgress, date: '2024-08-11', priority: TaskPriority.Low },
  { id: 'task-3', roomId: 'room-301', assignedTo: 'user-4', task: 'Prepare for Arrival', status: TaskStatus.Pending, date: '2024-08-11', priority: TaskPriority.High, notes: 'VIP guest. Please ensure a bottle of champagne is placed in the room.' },
  { id: 'task-4', roomId: 'room-103', assignedTo: 'user-4', task: 'Checkout Cleaning', status: TaskStatus.Done, date: '2024-07-28', priority: TaskPriority.Medium },
];

// REPORTS
export const mockOccupancy: OccupancyReport[] = [
  { date: '2024-08-01', occupiedRooms: 25, availableRooms: 10, occupancyRate: 71.4 },
  { date: '2024-08-02', occupiedRooms: 28, availableRooms: 7, occupancyRate: 80.0 },
  { date: '2024-08-03', occupiedRooms: 30, availableRooms: 5, occupancyRate: 85.7 },
  { date: '2024-08-04', occupiedRooms: 27, availableRooms: 8, occupancyRate: 77.1 },
  { date: '2024-08-05', occupiedRooms: 32, availableRooms: 3, occupancyRate: 91.4 },
  { date: '2024-08-06', occupiedRooms: 31, availableRooms: 4, occupancyRate: 88.6 },
  { date: '2024-08-07', occupiedRooms: 29, availableRooms: 6, occupancyRate: 82.9 },
];

export const mockRevenue: RevenueReport[] = [
  { month: 'January', revenue: 55000, adr: 210 },
  { month: 'February', revenue: 62000, adr: 225 },
  { month: 'March', revenue: 75000, adr: 240 },
  { month: 'April', revenue: 82000, adr: 255 },
  { month: 'May', revenue: 95000, adr: 270 },
  { month: 'June', revenue: 110000, adr: 285 },
  { month: 'July', revenue: 125000, adr: 300 },
];

// ACTIVITY LOG
const now = new Date();
const today = (d: Date) => d.toISOString().split('T')[0];
const yesterday = (d: Date) => new Date(d.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const mockActivityLog: ActivityLog[] = [
  // Today's activities
  { id: 'act-1', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), type: 'Check-In', description: 'John Doe checked into Room 202.', link: { page: 'GuestProfile', guestId: 'guest-1' } },
  { id: 'act-2', timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), type: 'New Reservation', description: 'Reservation created for Jane Smith in Room 301.', link: { page: 'GuestProfile', guestId: 'guest-2' } },
  { id: 'act-3', timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), type: 'New Guest', description: 'New guest profile created for Bob Johnson.', link: { page: 'GuestProfile', guestId: 'guest-3' } },
  
  // Yesterday's activities
  { id: 'act-4', timestamp: `${yesterday(now)}T18:30:00.000Z`, type: 'Check-Out', description: 'Previous guest checked out from Room 104.'},
  { id: 'act-5', timestamp: `${yesterday(now)}T15:00:00.000Z`, type: 'Check-In', description: 'A guest checked into Room 501.'},
  { id: 'act-6', timestamp: `${yesterday(now)}T11:00:00.000Z`, type: 'New Reservation', description: 'Future reservation created for Room 402.'},

  // Two days ago
  { id: 'act-7', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'Check-Out', description: 'Bob Johnson checked out from Room 103.', link: { page: 'GuestProfile', guestId: 'guest-3' } },
];
