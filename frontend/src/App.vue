<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { scheduleStore } from './stores/schedule.store';

const pdfStoreInstance = scheduleStore();

onMounted(() => {
  pdfStoreInstance.getScheduleData().catch(err => {
    console.error('PDF init failed:', err);
  });
});

</script>
