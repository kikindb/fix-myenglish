import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const LongPollingComponent = () => {
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 15;

  // API call to check the status
  const fetchStatus = async () => {
    const response = await axios.get('/api/check-status'); // Replace with your API endpoint
    return response.data; // Assuming response data contains a `status` field
  };

  // Use React Query's `useQuery` for polling
  const { data, status: queryStatus, refetch } = useQuery(
    ['checkStatus'],
    fetchStatus,
    {
      refetchInterval: (data) => {
        // Stop polling if the API returns 'success' or 'failed' status
        if (data?.status === 'success' || data?.status === 'failed' || attempts >= maxAttempts) {
          return false;
        }
        return 2000; // Poll every 2 seconds
      },
      onSuccess: (data) => {
        // Stop polling when we reach the max attempts or get a final status
        setAttempts((prevAttempts) => prevAttempts + 1);
      },
      enabled: attempts < maxAttempts, // Disable query if max attempts are reached
      refetchOnWindowFocus: false, // Optional: disable refetch when the window is focused
    }
  );

  return (
    <div>
      <h1>Long Polling Example with React Query</h1>
      <p>API Status: {data?.status || 'pending'}</p>
      <p>Attempts: {attempts}</p>

      {attempts >= maxAttempts && (
        <p>Max attempts reached or polling stopped. Final status: {data?.status}</p>
      )}
    </div>
  );
};

export default LongPollingComponent;
