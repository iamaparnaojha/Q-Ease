const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const queueService = {
  // Queue operations
  createQueue: async (queueData) => {
    const response = await fetch(`${API_URL}/queues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(queueData),
    });
    return response.json();
  },

  getAllQueues: async () => {
    const response = await fetch(`${API_URL}/queues`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        console.error('Authentication error: Not authorized to access queues');
        return []; // Return empty array instead of throwing to prevent map error
      }
      throw new Error(`Error fetching queues: ${response.status}`);
    }

    return response.json();
  },

  joinQueue: async (queueId) => {
    const response = await fetch(`${API_URL}/queues/${queueId}/join`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  updateParticipantStatus: async (queueId, userId, status) => {
    const response = await fetch(`${API_URL}/queues/${queueId}/participant/${userId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};