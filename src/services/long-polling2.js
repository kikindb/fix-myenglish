import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const LongPollingComponent = () => {
  const [attempts, setAttempts] = useState(0);
  const [pollingEnabled, setPollingEnabled] = useState(false); // Control when polling starts
  const maxAttempts = 15;

  // API call to check the status
  const fetchStatus = async () => {
    const response = await axios.get('/api/check-status'); // Replace with your API endpoint
    return response.data; // Assuming response data contains a `status` field
  };

  // Use React Query's `useMutation` to handle manual polling
  const { mutate, data } = useMutation(fetchStatus, {
    onSuccess: (data) => {
      // Handle successful fetch; check status and update attempts
      if (data?.status === 'success' || data?.status === 'failed' || attempts >= maxAttempts) {
        setPollingEnabled(false); // Stop polling when status is final or max attempts reached
      } else {
        setAttempts((prevAttempts) => prevAttempts + 1); // Increment attempt count
        if (attempts < maxAttempts) {
          setTimeout(() => {
            mutate(); // Trigger the mutation again after 2 seconds if polling continues
          }, 2000); // Poll every 2 seconds
        }
      }
    },
    onError: (error) => {
      console.error('Error while polling:', error);
      setPollingEnabled(false); // Stop polling in case of an error
    },
  });

  // Button to start polling
  const handleStartPolling = () => {
    setPollingEnabled(true); // Enable polling
    setAttempts(0); // Reset attempts
    mutate(); // Start the first mutation
  };

  return (
    <div>
      <h1>Long Polling Example with useMutation</h1>
      <p>API Status: {data?.status || 'pending'}</p>
      <p>Attempts: {attempts}</p>

      <button onClick={handleStartPolling} disabled={pollingEnabled}>
        Start Polling
      </button>

      {attempts >= maxAttempts && (
        <p>Max attempts reached or polling stopped. Final status: {data?.status}</p>
      )}
    </div>
  );
};

export default LongPollingComponent;
