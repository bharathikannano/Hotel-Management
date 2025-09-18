import React from 'react';
import { Feedback } from '../types';
import Card from '../components/common/Card';

interface FeedbackPageProps {
  feedback: Feedback[];
}

const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`text-2xl ${star <= rating ? 'text-accent-400' : 'text-neutral-300 dark:text-neutral-600'}`}>
                ★
            </span>
        ))}
    </div>
);

const FeedbackPage: React.FC<FeedbackPageProps> = ({ feedback }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Guest Feedback</h1>
      {feedback.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-neutral-800 dark:text-neutral-200">{item.guestName}</p>
                        {item.roomNumber && <p className="text-sm text-neutral-500 dark:text-neutral-400">Room {item.roomNumber}</p>}
                    </div>
                    <StarDisplay rating={item.rating} />
                </div>
                <div>
                    <h4 className="font-semibold text-neutral-600 dark:text-neutral-300">Comments:</h4>
                    <p className="text-neutral-700 dark:text-neutral-400 italic bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-lg mt-1">"{item.comments}"</p>
                </div>
                {item.suggestions && (
                   <div>
                        <h4 className="font-semibold text-neutral-600 dark:text-neutral-300">Suggestions:</h4>
                        <p className="text-neutral-700 dark:text-neutral-400 italic bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-lg mt-1">"{item.suggestions}"</p>
                    </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-right">
                <p className="text-xs text-neutral-400 dark:text-neutral-500">Submitted on {item.dateSubmitted}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-neutral-500 dark:text-neutral-400">No feedback has been submitted yet.</p>
        </Card>
      )}
    </div>
  );
};

export default FeedbackPage;