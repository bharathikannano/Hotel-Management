
import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-4xl focus:outline-none"
                    aria-label={`Rate ${star} out of 5 stars`}
                >
                    <span className={star <= rating ? 'text-accent-400' : 'text-neutral-300 dark:text-neutral-600'}>
                        ★
                    </span>
                </button>
            ))}
        </div>
    );
};


const GuestFeedbackForm = ({ onSubmit }) => {
    const [guestName, setGuestName] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !guestName || !comments) {
            setError('Please provide your name, a rating, and your comments.');
            return;
        }
        setError('');
        onSubmit({
            guestName,
            roomNumber,
            rating,
            comments,
            suggestions,
        });
        
        // Reset form after submission
        setGuestName('');
        setRoomNumber('');
        setRating(0);
        setComments('');
        setSuggestions('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* FIX: Add missing className prop. */}
            <Input
                label="Your Full Name"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className=""
            />
            {/* FIX: Add missing className prop. */}
            <Input
                label="Room Number (Optional)"
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., 101"
                className=""
            />
            <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Overall Rating
                </label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
             <div>
                <label htmlFor="comments" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Comments
                </label>
                <textarea
                    id="comments"
                    name="comments"
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200 hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400"
                    placeholder="Tell us about your stay..."
                    required
                />
            </div>
            <div>
                <label htmlFor="suggestions" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Suggestions for Improvement (Optional)
                </label>
                <textarea
                    id="suggestions"
                    name="suggestions"
                    rows={3}
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200 hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400"
                    placeholder="What could we do better?"
                />
            </div>

            {error && <p className="text-danger-500 text-sm">{error}</p>}

            <div className="flex justify-end pt-4 border-t dark:border-neutral-700 mt-4">
                {/* FIX: Add missing className prop. */}
                <Button type="submit" className="">Submit Feedback</Button>
            </div>
        </form>
    );
};

export default GuestFeedbackForm;
