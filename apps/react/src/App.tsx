import './App.css';
import { useNotifications } from './hooks/useNotifications';
import { Notification } from './components/Notification';

function App() {
  const { notifications } = useNotifications();

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">SSE with React</h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            timestamp={notification.timestamp}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
