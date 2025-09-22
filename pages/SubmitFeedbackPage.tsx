
import React from 'react';
import GuestFeedbackForm from '../components/feedback/GuestFeedbackForm';
import Card from '../components/common/Card';

const SubmitFeedbackPage = ({ onSubmit }) => {
  return (
    <div className="max-w-3xl mx-auto">
        <Card title="Share Your Feedback">
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                We value your opinion! Please take a moment to tell us about your experience at Zenith Grand Hotel.
                Your feedback helps us improve our services.
            </p>
            <GuestFeedbackForm onSubmit={onSubmit} />
        </Card>
    </div>
  );
};

export default SubmitFeedbackPage;
