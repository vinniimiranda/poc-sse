interface NotificationProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export function Notification({ message, type, timestamp }: NotificationProps) {
  const backgroundColor = {
    info: 'bg-blue-100 border-blue-500',
    success: 'bg-green-100 border-green-500',
    warning: 'bg-yellow-100 border-yellow-500',
    error: 'bg-red-100 border-red-500',
  }[type];

  return (
    <div className={`p-4 mb-4 border-l-4 rounded ${backgroundColor}`}>
      <p className="text-sm">{message}</p>
      <span className="text-xs text-gray-500">{new Date(timestamp).toLocaleTimeString()}</span>
    </div>
  );
}
