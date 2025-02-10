import { io } from 'socket.io-client';
import { API_URL } from '../config';

class SocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (!this.socket) {
      const token = localStorage.getItem('token');
      
      this.socket = io(API_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.setupEventHandlers();
    }
    return this.socket;
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Disconnected by the server, reconnect manually
        this.connect();
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinEventRoom(eventId) {
    if (this.socket?.connected) {
      this.socket.emit('joinEvent', { eventId });
    }
  }

  leaveEventRoom(eventId) {
    if (this.socket?.connected) {
      this.socket.emit('leaveEvent', { eventId });
    }
  }
}

export default new SocketService(); 