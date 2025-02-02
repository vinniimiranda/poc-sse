import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

let notifications: Notification[] = [];

app.get('/notifications', (req, res) => {
  res.json(notifications);
});

app.post('/notifications', express.json(), (req, res) => {
  const { message, type = 'info' } = req.body;

  const newNotification: Notification = {
    id: Date.now().toString(),
    message,
    type,
    timestamp: Date.now(),
  };

  notifications = [...notifications, newNotification];
  notifyClients();
  res.json({ success: true, notification: newNotification });
});

app.get('/notifications-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify(notifications)}\n\n`);

  const sendUpdate = () => {
    res.write(`data: ${JSON.stringify(notifications)}\n\n`);
  };

  const clientId = Date.now();
  clients.set(clientId, sendUpdate);

  req.on('close', () => {
    clients.delete(clientId);
  });
});

const clients = new Map<number, () => void>();

const notifyClients = () => {
  clients.forEach((sendUpdate) => sendUpdate());
};

const PORT = process.env.PORT || 3333;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
