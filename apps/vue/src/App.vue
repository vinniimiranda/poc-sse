<script setup>
import './style.css';
import { ref, onMounted, onUnmounted } from 'vue';

const notifications = ref([]);

let eventSource;

onMounted(() => {
  eventSource = new EventSource('http://localhost:3333/notifications-stream');
  
  eventSource.onmessage = (event) => {
    notifications.value = JSON.parse(event.data);
  };
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h3 class="text-2xl font-bold mb-4">SSE with Vue</h3>
    <div class="space-y-4">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="{
          'p-4 mb-4 border-l-4 rounded': true,
          'bg-blue-100 border-blue-500': notification.type === 'info',
          'bg-green-100 border-green-500': notification.type === 'success',
          'bg-yellow-100 border-yellow-500': notification.type === 'warning',
          'bg-red-100 border-red-500': notification.type === 'error'
        }"
      >
        <p class="text-sm">{{ notification.message }}</p>
        <span class="text-xs text-gray-500">{{ new Date(notification.timestamp).toLocaleTimeString() }}</span>
      </div>
    </div>
  </div>
</template>

