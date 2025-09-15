import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';
import GuestsPage from './pages/GuestsPage';
import RoomsPage from './pages/RoomsPage';
import HousekeepingPage from './pages/HousekeepingPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import GuestProfilePage from './pages/GuestProfilePage';
import ReservationModal from './components/reservations/ReservationModal';
import TaskModal from './components/housekeeping/TaskModal';
import ToastContainer from './components/common/ToastContainer';
import { Page, User, Reservation, Guest, Room, HousekeepingTask, ReservationModalData, RoomType, ReservationStatus, RoomStatus, Guest as GuestType, ToastMessage, Theme, HousekeepingTaskModalData, TaskStatus } from './types';
import { mockUsers, mockReservations, mockGuests, mockRooms, mockHousekeepingTasks, mockRoomTypes } from './data';

function App() {
  // --- STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [tasks, setTasks] = useState<HousekeepingTask[]>(mockHousekeepingTasks);
  const [roomTypes] = useState<RoomType[]>(mockRoomTypes);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Profile page state
  const [viewingGuest, setViewingGuest] = useState<GuestType | null>(null);

  // Modal State
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationModalData, setReservationModalData] = useState<ReservationModalData>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<HousekeepingTaskModalData>(null);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  // --- THEME HANDLING ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // --- AUTHENTICATION ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  // --- TOAST NOTIFICATIONS ---
  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- NAVIGATION ---
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setViewingGuest(null); // Reset guest profile view on navigation
    if (window.innerWidth < 768) { // Close sidebar on mobile after navigation
      setIsSidebarOpen(false);
    }
  };

  const handleViewGuestProfile = (guest: GuestType) => {
    setViewingGuest(guest);
    setCurrentPage('GuestProfile');
  };

  // --- MODAL HANDLING ---
  const handleOpenReservationModal = (data: ReservationModalData) => {
    setReservationModalData(data);
    setIsReservationModalOpen(true);
  };

  const handleCloseReservationModal = () => {
    setIsReservationModalOpen(false);
    setReservationModalData(null);
  };

  const handleOpenTaskModal = (task: HousekeepingTask | null) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // --- DATA MUTATIONS ---
  const handleSaveReservation = (data: Omit<Reservation, 'id'>, id?: string) => {
    if (id) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
      // Update room status if reservation status changed
      const originalReservation = reservations.find(r => r.id === id);
      if (originalReservation && originalReservation.status !== data.status) {
        if (data.status === ReservationStatus.CheckedIn) {
          setRooms(prev => prev.map(room => room.id === data.roomId ? {...room, status: RoomStatus.Occupied} : room));
        } else if (data.status === ReservationStatus.CheckedOut) {
          setRooms(prev => prev.map(room => room.id === data.roomId ? {...room, status: RoomStatus.Dirty} : room));
        } else if (data.status === ReservationStatus.Cancelled || data.status === ReservationStatus.Confirmed) {
           // check if another reservation exists for that room
           const otherRes = reservations.find(r => r.roomId === data.roomId && r.id !== id && r.status === ReservationStatus.CheckedIn);
           if (!otherRes) {
             setRooms(prev => prev.map(room => room.id === data.roomId ? {...room, status: RoomStatus.Available} : room));
           }
        }
      }
      addToast('Reservation updated successfully!');
    } else {
      const newReservation: Reservation = { ...data, id: `res-${Date.now()}` };
      setReservations(prev => [newReservation, ...prev]);
      if (newReservation.status === ReservationStatus.CheckedIn) {
         setRooms(prev => prev.map(room => room.id === newReservation.roomId ? {...room, status: RoomStatus.Occupied} : room));
      }
      addToast('Reservation created successfully!');
    }
    handleCloseReservationModal();
  };

  const handleDeleteReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
    addToast('Reservation deleted.', 'info');
  };
  
  const handleAddGuest = (guestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = { ...guestData, id: `guest-${Date.now()}` };
    setGuests(prev => [newGuest, ...prev]);
    addToast('Guest added successfully!');
  };
  
  const handleUpdateGuest = (id: string, guestData: Omit<Guest, 'id'>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...guestData } : g));
    addToast('Guest updated successfully!');
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    // Also remove their reservations
    setReservations(prev => prev.filter(r => r.guestId !== id));
    addToast('Guest and their reservations deleted.', 'info');
  };

  const handleSaveTask = (data: Omit<HousekeepingTask, 'id' | 'date'>, id?: string) => {
    if (id) {
        // Update
        const taskToUpdate = tasks.find(t => t.id === id);
        if (!taskToUpdate) return;
        
        const updatedTask = { ...taskToUpdate, ...data };
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

        // Check if room status should be updated
        const room = rooms.find(r => r.id === updatedTask.roomId);
        if (data.status === TaskStatus.Done && room?.status === RoomStatus.Dirty) {
             setRooms(prev => prev.map(r => r.id === updatedTask.roomId ? { ...r, status: RoomStatus.Available } : r));
             addToast(`Room ${room.roomNumber} status updated to Available.`);
        } else {
            addToast('Task updated successfully!');
        }
    } else {
        // Create
        const newTask: HousekeepingTask = {
            ...data,
            id: `task-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
        };
        setTasks(prev => [newTask, ...prev]);
        addToast('Task created successfully!');
    }
    handleCloseTaskModal();
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task deleted.', 'info');
  };

  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    const room = rooms.find(r => r.id === roomId);
    addToast(`Room ${room?.roomNumber} status updated to ${status}.`, 'info');
  };

  // --- PAGE RENDERING ---
  const renderPage = () => {
    if (!currentUser) return null; // Should not happen due to the login check below
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage reservations={reservations} rooms={rooms} guests={guests} tasks={tasks} />;
      case 'Reservations':
        return <ReservationsPage 
            reservations={reservations} 
            onOpenModal={handleOpenReservationModal} 
            onDeleteReservation={handleDeleteReservation}
            currentUser={currentUser}
        />;
      case 'Guests':
        return <GuestsPage 
            guests={guests} 
            onAddGuest={handleAddGuest} 
            onUpdateGuest={handleUpdateGuest} 
            onDeleteGuest={handleDeleteGuest} 
            onViewProfile={handleViewGuestProfile}
            currentUser={currentUser}
        />;
      case 'Rooms':
        return <RoomsPage 
          rooms={rooms} 
          roomTypes={roomTypes} 
          reservations={reservations} 
          guests={guests} 
          onOpenModal={handleOpenReservationModal} 
          onUpdateRoomStatus={handleUpdateRoomStatus}
        />;
      case 'Housekeeping':
        return <HousekeepingPage 
            tasks={tasks} 
            rooms={rooms} 
            users={mockUsers}
            onOpenModal={handleOpenTaskModal}
            onDeleteTask={handleDeleteTask}
            currentUser={currentUser}
        />;
      case 'Reports':
        return <ReportsPage />;
      case 'Users':
        return <UsersPage />;
      case 'GuestProfile':
        if (viewingGuest) {
          const guestReservations = reservations.filter(r => r.guestId === viewingGuest.id);
          const roomsMap = new Map(rooms.map(r => [r.id, r]));
          return <GuestProfilePage guest={viewingGuest} reservations={guestReservations} roomsMap={roomsMap} onNavigate={handleNavigate} />;
        }
        return null; // or a fallback
      default:
        return <DashboardPage reservations={reservations} rooms={rooms} guests={guests} tasks={tasks} />;
    }
  };
  
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={mockUsers} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Sidebar 
        currentPage={currentPage} 
        user={currentUser} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentPage={currentPage} 
          user={currentUser} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleCloseReservationModal}
        onSave={handleSaveReservation}
        initialData={reservationModalData}
        guests={guests}
        rooms={rooms}
      />
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSave={handleSaveTask}
        initialData={editingTask}
        rooms={rooms}
        users={mockUsers}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;