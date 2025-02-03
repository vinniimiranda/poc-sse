import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  clientId?: string;
}

let notifications = new Map<string, Notification[]>();
let lastNotifiedClientId: number | null = null;

app.get('/notifications', (req, res) => {
  const clientId = req.headers['x-client-id'] as string;

  if (!clientId) {
    return res.status(400).json({ error: 'Client ID é obrigatório' });
  }

  const clientNotifications = notifications.get(clientId) || [];
  res.json(clientNotifications);
});

app.post('/notifications', express.json(), (req, res) => {
  const { message, type = 'info', clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: 'Client ID é obrigatório' });
  }

  const newNotification: Notification = {
    id: Date.now().toString(),
    message,
    type,
    timestamp: Date.now(),
    clientId,
  };

  const clientNotifications = notifications.get(clientId) || [];
  notifications.set(clientId, [...clientNotifications, newNotification]);

  notifyClients(clientId);
  res.json({ success: true, notification: newNotification });
});

app.get('/notifications-stream', (req, res) => {
  const clientId = req.query.clientId as string;

  if (!clientId) {
    return res.status(400).json({ error: 'Client ID é obrigatório' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientNotifications = notifications.get(clientId) || [];
  res.write(`data: ${JSON.stringify(clientNotifications)}\n\n`);

  const sendUpdate = () => {
    const updatedNotifications = notifications.get(clientId) || [];
    res.write(`data: ${JSON.stringify(updatedNotifications)}\n\n`);
  };

  const connectionId = Date.now();
  clients.set(connectionId, { sendUpdate, clientId });

  req.on('close', () => {
    clients.delete(connectionId);
  });
});

const clients = new Map<number, { sendUpdate: () => void; clientId: string }>();

const notifyClients = (targetClientId: string) => {
  if (clients.size === 0) return;

  const relevantClients = Array.from(clients.entries()).filter(([_, { clientId }]) => clientId === targetClientId);

  if (relevantClients.length === 0) return;

  const currentIndex = lastNotifiedClientId ? relevantClients.findIndex(([id]) => id === lastNotifiedClientId) : -1;

  const nextIndex = (currentIndex + 1) % relevantClients.length;
  const [connectionId, { sendUpdate }] = relevantClients[nextIndex];

  lastNotifiedClientId = connectionId;

  sendUpdate();
};

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
