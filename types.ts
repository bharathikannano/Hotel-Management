// FIX: Added Page type to be shared across components.
export type Page = 'Dashboard' | 'Reservations' | 'Guests' | 'Rooms' | 'Housekeeping' | 'Reports' | 'Users' | 'GuestProfile' | 'Feedback' | 'SubmitFeedback' | 'ActivityLog';
export type Theme = 'light' | 'dark' | 'system';

export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  FrontDesk = 'Front Desk',
  Housekeeping = 'Housekeeping',
  Guest = 'Guest',
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  avatarUrl: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
}

export enum RoomTypeEnum {
    Single = 'Single',
    Double = 'Double',
    Suite = 'Suite',
    Deluxe = 'Deluxe',
    Family = 'Family',
}

export interface RoomType {
  id: string;
  name: RoomTypeEnum;
  basePrice: number;
  capacity: number;
  amenities: string[];
}

export enum RoomStatus {
    Available = 'Available',
    Occupied = 'Occupied',
    Dirty = 'Dirty',
    OutOfService = 'Out of Service',
}

export interface Room {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  status: RoomStatus;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export enum ReservationStatus {
    Confirmed = 'Confirmed',
    CheckedIn = 'Checked-In',
    CheckedOut = 'Checked-Out',
    Cancelled = 'Cancelled',
}

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkInTime?: string;
  checkOutDate: string;
  checkOutTime?: string;
  status: ReservationStatus;
  totalAmount: number;
  expectedCheckInTime?: string;
  expectedCheckOutTime?: string;
}

export type NewReservationData = {
  roomId: string;
  checkInDate: string;
  checkInTime?: string;
};

export type ReservationModalData = Reservation | NewReservationData | null;


export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  paymentDate: string;
  method: 'Credit Card' | 'Cash' | 'Bank Transfer';
}

export enum TaskStatus {
    Pending = 'Pending',
    InProgress = 'In Progress',
    Done = 'Done',
}

export enum TaskPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  assignedTo: string; // User ID
  task: string;
  status: TaskStatus;
  date: string;
  priority: TaskPriority;
  notes?: string;
}

export type HousekeepingTaskModalData = HousekeepingTask | null;

export interface OccupancyReport {
  date: string;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
}

export interface RevenueReport {
  month: string;
  revenue: number;
  adr: number; // Average Daily Rate
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Feedback {
  id: string;
  guestName: string;
  roomNumber: string;
  rating: number;
  comments: string;
  suggestions?: string;
  dateSubmitted: string;
}

export type ActivityLogType = 'Check-In' | 'Check-Out' | 'New Reservation' | 'New Guest';

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  type: ActivityLogType;
  description: string;
  link?: { page: Page; guestId?: string; };
}

export type GlobalSearchResult = {
    type: 'Guest' | 'Reservation' | 'Room';
    id: string;
    title: string;
    description: string;
    data: Guest | Reservation | Room;
}