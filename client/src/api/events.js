import axiosInstance from '../utils/axios';

export const fetchEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.date) params.append('date', filters.date);
  
  const response = await axiosInstance.get(`/events?${params}`);
  return response.data;
};

export const fetchEventById = async (id) => {
  const response = await axiosInstance.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const formData = new FormData();
  
  Object.keys(eventData).forEach(key => {
    if (eventData[key] !== null && eventData[key] !== undefined) {
      if (key === 'date' && eventData.time) {
        const dateTime = new Date(`${eventData.date}T${eventData.time}`);
        formData.append('date', dateTime.toISOString());
      } else if (key !== 'time') {
        formData.append(key, eventData[key]);
      }
    }
  });

  const response = await axiosInstance.post('/events', formData);
  return response.data;
};

export const attendEvent = async (eventId) => {
  const response = await axiosInstance.post(`/events/${eventId}/attend`);
  return response.data;
};

export const cancelEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/events/${eventId}`);
  return response.data;
};

export const unattendEvent = async (eventId) => {
  const response = await axiosInstance.post(`/events/${eventId}/unattend`);
  return response.data;
};

export const apiUpdateEvent = async (id, eventData) => {
  // Handle date and time combination if present
  if (eventData.date && eventData.time) {
    const dateTime = new Date(`${eventData.date}T${eventData.time}`);
    eventData.date = dateTime.toISOString();
    delete eventData.time;
  }

  const response = await axiosInstance.put(`/events/${id}`, eventData);
  return response.data;
};
