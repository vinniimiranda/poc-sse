import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3333/notifications-stream?clientId=react', {});
    eventSource.addEventListener('message', () => {});
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { notifications };
}
