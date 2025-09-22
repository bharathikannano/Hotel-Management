import React, { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { Guest, Reservation, Room, GlobalSearchResult, Page } from '../../types';
// FIX: Imported IconProps to ensure type consistency for icon components.
import { GuestIcon, ReservationIcon, BedIcon, IconProps } from '../icons';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  reservations: Reservation[];
  rooms: Room[];
  onNavigate: (page: Page, data?: any) => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, guests, reservations, rooms, onNavigate }) => {
  const [query, setQuery] = useState('');
  
  const searchResults: GlobalSearchResult[] = useMemo(() => {
    if (query.length < 2) return [];

    const lowerCaseQuery = query.toLowerCase();
    const results: GlobalSearchResult[] = [];

    // Search Guests
    guests.forEach(guest => {
        if (`${guest.firstName} ${guest.lastName}`.toLowerCase().includes(lowerCaseQuery) || guest.email.toLowerCase().includes(lowerCaseQuery)) {
            results.push({
                type: 'Guest',
                id: guest.id,
                title: `${guest.firstName} ${guest.lastName}`,
                description: guest.email,
                data: guest,
            });
        }
    });

    // Search Reservations
    reservations.forEach(res => {
        if (res.id.toLowerCase().includes(lowerCaseQuery)) {
            const guest = guests.find(g => g.id === res.guestId);
            results.push({
                type: 'Reservation',
                id: res.id,
                title: `Reservation #${res.id}`,
                description: `Guest: ${guest ? `${guest.firstName} ${guest.lastName}` : 'N/A'}`,
                data: res,
            });
        }
    });
    
    // Search Rooms
    rooms.forEach(room => {
        if (room.roomNumber.includes(lowerCaseQuery)) {
             results.push({
                type: 'Room',
                id: room.id,
                title: `Room ${room.roomNumber}`,
                description: `Status: ${room.status}`,
                data: room,
            });
        }
    });

    return results;
  }, [query, guests, reservations, rooms]);

  const handleResultClick = (result: GlobalSearchResult) => {
    if (result.type === 'Guest') {
        onNavigate('GuestProfile', result.data as Guest);
    }
    // For reservations and rooms, a more advanced navigation/modal system would be needed.
    // For now, we can navigate to the relevant page.
    if (result.type === 'Reservation') {
        onNavigate('Reservations');
    }
    if (result.type === 'Room') {
        onNavigate('Rooms');
    }
    onClose();
    setQuery('');
  };

  // FIX: Updated icon prop type to use imported IconProps and removed redundant 'key' from the li element.
  const ResultItem = ({ result, icon: Icon }: { result: GlobalSearchResult; icon: React.FC<IconProps> }) => (
    <li
        onClick={() => handleResultClick(result)}
        className="p-3 flex items-center gap-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors"
    >
        <div className="bg-primary-100 dark:bg-primary-800/50 p-2 rounded-full">
            <Icon className="text-xl text-primary-600 dark:text-primary-300" />
        </div>
        <div>
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">{result.title}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{result.description}</p>
        </div>
    </li>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Search">
        <div className="space-y-4">
            <Input
                label=""
                id="global-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for guests, reservations, rooms..."
                autoFocus
            />
            <div className="max-h-96 overflow-y-auto">
                {query.length >= 2 && searchResults.length === 0 ? (
                    <p className="text-center text-neutral-500 dark:text-neutral-400 py-6">No results found.</p>
                ) : (
                    <ul className="space-y-1">
                       {searchResults.filter(r => r.type === 'Guest').map(r => <ResultItem key={r.id} result={r} icon={GuestIcon} />)}
                       {searchResults.filter(r => r.type === 'Reservation').map(r => <ResultItem key={r.id} result={r} icon={ReservationIcon} />)}
                       {searchResults.filter(r => r.type === 'Room').map(r => <ResultItem key={r.id} result={r} icon={BedIcon} />)}
                    </ul>
                )}
            </div>
        </div>
    </Modal>
  );
};

export default GlobalSearchModal;