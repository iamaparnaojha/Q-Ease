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

    if (!response.ok) {
      throw new Error(`Error creating queue: ${response.status}`);
    }

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

  getQueueByCode: async (code) => {
    const response = await fetch(`${API_URL}/queues/${code}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Queue not found');
      }
      throw new Error(`Error fetching queue: ${response.status}`);
    }

    return response.json();
  },

  getUserQueues: async () => {
    const response = await fetch(`${API_URL}/queues/user`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Authentication error: Not authorized');
        return [];
      }
      throw new Error(`Error fetching user queues: ${response.status}`);
    }

    return response.json();
  },

  joinQueue: async (queueId) => {
    const response = await fetch(`${API_URL}/queues/${queueId}/join`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to join queue');
      }
      throw new Error(`Error joining queue: ${response.status}`);
    }

    return response.json();
  },

  leaveQueue: async (queueId) => {
    const response = await fetch(`${API_URL}/queues/${queueId}/leave`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error leaving queue: ${response.status}`);
    }

    return response.json();
  },

  updateParticipantStatus: async (queueId, userId, status) => {
    const response = await fetch(`${API_URL}/queues/${queueId}/participant/${userId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Error updating participant status: ${response.status}`);
    }

    return response.json();
  },
};